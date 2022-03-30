import { getContributorInfo } from "./github.ts";

const ContributorsTemplate = `
<tr>
<th>GitHub 昵称</th>
<th>贡献者等级</th>
<th>积分数</th>
<th>文章数</th>
<th>组织角色</th>
</tr>
`;

export async function drawContributors() {
    let svg_str = Deno.readTextFileSync("./assets/table.svg");
    let content = ContributorsTemplate;

    // 转换 JSON to HTML
    const info = await getContributorInfo();
    const contributors = JSON.parse(atob(info.content));

    console.log(contributors);
    for (const name in contributors) {
        const score = contributors[name].score;
        const article_num = contributors[name].article_num;

        content += "<tr>";
        content += "<th>" + name + "</th>";
        content += "<th>" + levelTable(score) + "</th>";
        content += "<th>" + score + "</th>";
        content += "<th>" + article_num + "</th>";
        content += "<th>" + titleTable(score) + "</th>";
        content += "</tr>";
    }

    svg_str = svg_str.replace("{{table-data}}", content);
    const encoder = new TextEncoder();
    return encoder.encode(svg_str);
}

function levelTable(score: number): string {
    if (score > 0 && score < 10) {
        return "🌟";
    } else if (score >= 10 && score < 50) {
        return "🌟🌟";
    } else if (score >= 50 && score < 150) {
        return "🌟🌟🌟";
    } else if (score >= 150 && score < 400) {
        return "💎";
    } else if (score >= 400 && score < 700) {
        return "💎💎";
    } else if (score >= 700 && score < 1500) {
        return "💎💎💎";
    } else if (score >= 1500 && score < 3000) {
        return "🔮";
    } else if (score >= 3000 && score < 5000) {
        return "🔮🔮";
    }
    return "🔮🔮🔮";
}

function titleTable(score: number): string {
    if (score > 0 && score < 150) {
        return "预备成员";
    } else if (score >= 150 && score < 700) {
        return "正式成员";
    }
    return "核心成员";
}
