import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { CommonConfig } from "../config/common.ts";
import { getApproverList, updateScoreList } from "./github.ts";

export async function hooks(context: Context) {
    const body = context.request.body();
    context.response.type = "json";
    if (body.type != "json") {
        context.response.body = {
            error: "未知的请求类型",
        };
        return;
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

        context.response.body = await comment_created(cc_info);
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

async function comment_created(info: CommentCreated): Promise<string> {
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
        return "";
    }

    const approved_type = score_oper.slice(0, 2);

    score_oper = score_oper.slice(3, score_oper.length);

    const score_num = parseInt(score_oper);

    if (approved_type == "翻译") {
        if (info.issue.assignee != null) {
            updateScoreList(info.issue.assignee, score_num);
        }
    }

    return "OK";
}
