import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
// import { CommonConfig } from "../config/common.ts";
import { getApproverList, updateScoreList } from "./github.ts";
import { verify } from "https://raw.githubusercontent.com/octokit/webhooks-methods.js/v2.0.0/src/web.ts";

export async function hooks(context: Context) {
    const body = context.request.body();
    context.response.type = "json";
    if (body.type != "json") {
        context.response.body = {
            message: "未知的请求类型",
        };
        context.response.status = 400;
        return;
    }

    const signatureHeader =
        context.request.headers.get("X-Hub-Signature-256") || "";
    const signature = signatureHeader.slice("sha256=".length);
    const status = await verify(
        Deno.env.get("HOOK_SECRET") || "",
        await context.request.body({ type: "text" }).value,
        signature
    );
    if (!status) {
        context.response.body = "安全验证失败";
        context.response.status = 400;
    }

    const payload = await body.value;
    const action_type = payload.action;

    if (action_type == "created" && payload.comment != null) {
        const cc_info = {
            issue: {
                title: payload.issue.title,
                author: payload.issue.user.login,
                content: payload.issue.body,
                assignee: payload.issue.assignee?.login,
            },
            content: payload.comment.body,
            creator: payload.comment.user.login,
        };

        await comment_created(context, cc_info);
    } else {
        context.response.body = {
            message: "未知的 Hook 类型",
        };
    }
}

interface CommentCreated {
    issue: {
        title: string;
        author: string;
        content: string;
        assignee: string | null;
    };
    content: string;
    creator: string;
}

async function comment_created(context: Context, info: CommentCreated) {
    const approvers = await getApproverList();
    if (approvers.indexOf(info.creator) == -1) {
        return "";
    }
    // 具体解析 Approver 的评论
    // [选题|翻译] + 10
    const content = info.content.trim();
    let score_oper = content.split("\n")[0];
    score_oper = score_oper.replaceAll(" ", "");
    // 既不是与选题相关的内容 也不是与 翻译 相关的内容
    if (!score_oper.startsWith("翻译+") && !score_oper.startsWith("选题+")) {
        context.response.status = 200;
        return;
    }

    const approved_type = score_oper.slice(0, 2);

    score_oper = score_oper.slice(3, score_oper.length);

    const score_num = parseInt(score_oper);

    let update_status = false;
    if (approved_type == "翻译") {
        if (info.issue.assignee != null) {
            update_status = await updateScoreList(
                info.issue.assignee,
                score_num
            );
        }
    } else if (approved_type == "选题") {
        update_status = await updateScoreList(info.issue.author, score_num);
    }

    if (update_status) {
        context.response.body = {
            message: "完成",
        };
    } else {
        context.response.body = {
            message: "更新分数失败",
        };
        context.response.status = 500;
    }
}
