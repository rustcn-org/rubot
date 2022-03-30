import { getContributorInfo } from "./github.ts";

const SvgFile = `
<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject x="10" y="10" width="100%" height="100%">
        <body xmlns="http://www.w3.org/1999/xhtml">
            <style type="text/css">
                <![CDATA[
                .styled-table {
                    border-collapse: collapse;
                    margin: 25px 0;
                    font-size: 0.9em;
                    font-family: sans-serif;
                    min-width: 400px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                }
                
                .styled-table thead tr {
                    background-color: #009879;
                    color: #ffffff;
                    text-align: left;
                }
                
                .styled-table th,
                .styled-table td {
                    padding: 12px 15px;
                }
                .styled-table tbody tr {
                    border-bottom: 1px solid #dddddd;
                }
                
                .styled-table tbody tr:nth-of-type(even) {
                    background-color: #f3f3f3;
                }
                
                .styled-table tbody tr:last-of-type {
                    border-bottom: 2px solid #009879;
                }

                .styled-table tbody tr.active-row {
                    font-weight: bold;
                    color: #009879;
                }
                ]]>
            </style>
            <table border="1" class="styled-table">
                {{table-data}}
            </table>
        </body>
    </foreignObject>
</svg>
`;

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
    let svg_str = SvgFile;
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
