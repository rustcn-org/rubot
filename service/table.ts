import { getLevel } from "./task.ts";

interface contributor {
    name: string;
    score: number;
    article_num: number;
    is_approver: boolean;
    is_admin: boolean;
    title?: string;
}

type STupleN = [string, number];

// deno-lint-ignore no-explicit-any
export function markdownContributors(info: any) {
    let content = "| 昵称 | 贡献等级 | 积分 | 文章数 | 团队角色 | 荣誉称号 |\n";
    content += "| --- | --- | --- | --- | --- | --- |\n";
    const obj = info;
    const contributors: Map<string, contributor> = new Map(Object.entries(obj));
    const arrObj: STupleN[] = [];
    contributors.forEach((value, key) => {
        const temp: [string, number] = [key, value?.score || 0];
        arrObj.push(temp);
    });
    arrObj.sort((a, b) => {
        return b[1] - a[1];
    });

    for (let index = 0; index < arrObj.length; index++) {
        const user = contributors.get(arrObj[index][0]);
        const score = user?.score || 0;
        const article_num = user?.article_num || 0;
        let [icon, role] = levelTable(score);
        if (user?.is_approver) {
            role = "审批者";
        }
        if (user?.is_admin) {
            role = "管理员";
        }

        let title = "";
        if (user?.title != null) {
            title = user?.title;
        }

        let display_name = arrObj[index][0];
        if (user?.name != null) {
            display_name = user?.name;
        }

        content +=
            "| [" +
            display_name +
            "](https://github.com/" +
            arrObj[index][0] +
            ") | " +
            icon +
            " | " +
            score +
            " | " +
            `[${article_num}](https://github.com/search?q=repo%3Arustlang-cn%2FRustt+assignee%3A${arrObj[index][0]}+state%3Aclosed&type=Issues&ref=advsearch)` +
            " | " +
            role +
            " | " +
            title +
            " |\n";
    }
    return content;
}

function levelTable(score: number): [string, string] {
    const table = getLevel();
    for (const key in table) {
        const tmp = table[key];
        if (score < tmp.points) {
            return [tmp.icon, tmp.title];
        }
    }
	return ['unknown', 'unknown'];
}
