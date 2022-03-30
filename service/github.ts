import { CommonConfig } from "../config/common.ts";

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
        "https://api.github.com/repos/mrxiaozhuox/Rustt/contents/Contributors.json";
    const response = await fetch(url);
    return await response.json();
}

export async function updateScoreList(user: string, num: number) {
    // https://api.github.com/repos/{owner}/{repo}/contents/{path}

    const curr_info = await getContributorInfo();
    const curr = JSON.parse(atob(curr_info.content));
    if (curr[user] == null) {
        curr[user] = {
            score: num,
            article_num: 0,
        };
    } else {
        curr[user] = {
            score: curr[user].score + num,
        };
    }

    const _url =
        "https://api.github.com/repos/" +
        CommonConfig.organization.name +
        "/" +
        CommonConfig.repository +
        "/contents/Contributors.json";

    const url =
        "https://api.github.com/repos/mrxiaozhuox/Rustt/contents/Contributors.json";

    const requestBody = {
        message: "更新贡献者信息",
        content: btoa(JSON.stringify(curr)),
        sha: curr_info.sha,
    };
    // requestBody.append("message", "更新贡献者信息");
    // requestBody.append("content", btoa(JSON.stringify(curr)));

    let response = await fetch(url, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            accept: "application/vnd.github.v3+json",
            authorization: "token " + CommonConfig.bot.token,
        },
        body: JSON.stringify(requestBody),
    });

    console.log(await response.text());
}
