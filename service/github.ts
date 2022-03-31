import { CommonConfig } from "../config/common.ts";
import { markdownContributors } from "./table.ts";

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
    num: number
): Promise<boolean> {
    // https://api.github.com/repos/{owner}/{repo}/contents/{path}

    const curr_info = await getContributorInfo();
    const curr = JSON.parse(atob(curr_info.content));
    if (curr[user] == null) {
        curr[user] = {
            score: num,
            article_num: 0,
            is_approver: false,
            is_admin: false,
        };
    } else {
        curr[user].score += num;
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
        message: "更新贡献者信息",
        content: btoa(JSON.stringify(curr, null, 4)),
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

    updateRanking(curr);

    return response.status == 200;
}

// deno-lint-ignore no-explicit-any
async function updateRanking(list: any) {
    let content = "# 贡献者排行榜\n";
    content += markdownContributors(list);

    const _sha_url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Ranking.md";
    const sha_url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Ranking.md";
    const file_info = await (await fetch(sha_url)).json();

    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Ranking.md";
    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rubot-Test/contents/Ranking.md";

    const requestBody = {
        message: "更新贡献者信息",
        content: btoa(JSON.stringify(content, null, 4)),
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

    return response.status == 200;
}
