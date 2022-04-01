import { CommonConfig } from "../config/common.ts";
import { markdownContributors } from "./table.ts";
import { encode, decode } from "https://deno.land/std@0.132.0/encoding/base64.ts";

// 通过 Deno-std 的 decode 解码 base64
function decodeToString(str: string) {
    const temp = decode(str);
    return new TextDecoder().decode(temp);
}

export async function getApproverList(): Promise<string[]> {
    const response = await fetch(
        "https://api.github.com/orgs/" +
            CommonConfig.organization.name +
            "/teams/" +
            CommonConfig.organization.teams.approvers +
            "/members",
        {
            headers: {
                accept: "application/vnd.github.v3+json",
                authorization: "token " + CommonConfig.bot.token,
            },
        }
    );

    const approvers = await response.json();
    if (approvers.message != null) {
        return [];
    }

    const result = [];
    for (const key in approvers) {
        result.push(approvers[key].login);
    }

    // 用于测试
    result.push("mrxiaozhuox");

    return result;
}

export async function getContributorInfo() {
    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Contributors.json";
    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Contributors.json";
    const response = await fetch(url);
    return await response.json();
}

export async function updateScoreList(
    user: string,
    num: number,
    article: number
): Promise<boolean> {
    // https://api.github.com/repos/{owner}/{repo}/contents/{path}

    const curr_info = await getContributorInfo();
    const curr = JSON.parse(decodeToString(curr_info.content));

    if (curr[user] == null) {
        curr[user] = {
            score: num,
            article_num: article,
            is_approver: false,
            is_admin: false,
        };
    } else {
        curr[user].score += num;
        curr[user].article_num += article;
    }

    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Contributors.json";

    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Contributors.json";

    const requestBody = {
        message: "更新贡献者数据",
        content: encode(JSON.stringify(curr, null, 4)),
        sha: curr_info.sha,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            accept: "application/vnd.github.v3+json",
            authorization: "token " + CommonConfig.bot.token,
        },
        body: JSON.stringify(requestBody),
    });

    const date = new Date();
    const date_format =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();

    await updateRecord({
        username: user,
        score: {
            operator: "+",
            num: num,
        },
        article: {
            operator: "+",
            num: article,
        },
        timestamp: date_format,
    });
    await updateRanking(curr);

    return response.status == 200;
}

// deno-lint-ignore no-explicit-any
async function updateRecord(info: any) {
    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Record.json";
    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Record.json";
    const file_info = await (await fetch(url)).json();

    // deno-lint-ignore no-explicit-any
    const curr: Array<any> = JSON.parse(decodeToString(file_info.content));

    curr.push(info);

    const requestBody = {
        message: "更新记录信息",
        content: encode(JSON.stringify(curr, null, 4)),
        sha: file_info.sha,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            accept: "application/vnd.github.v3+json",
            authorization: "token " + CommonConfig.bot.token,
        },
        body: JSON.stringify(requestBody),
    });

    if (response.status != 200) {
        console.log("[Record Failed]: " + JSON.stringify(requestBody));
        console.log("[Record Failed]: " + await response.text());
    }

    return response.status == 200;
}

// deno-lint-ignore no-explicit-any
async function updateRanking(list: any) {
    let content = "# 贡献者排行榜\n";
    content += markdownContributors(list);

    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Ranking.md";
    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Ranking.md";
    const file_info = await (await fetch(url)).json();

    const requestBody = {
        message: "更新贡献者排行",
        content: encode(content),
        sha: file_info.sha,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            accept: "application/vnd.github.v3+json",
            authorization: "token " + CommonConfig.bot.token,
        },
        body: JSON.stringify(requestBody),
    });

    if (response.status != 200) {
        console.log("[Ranking Failed]: " + JSON.stringify(requestBody));
        console.log("[Ranking Failed]: " + await response.text());
    }

    return response.status == 200;
}
