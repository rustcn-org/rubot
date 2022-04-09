import { getContributorInfo } from "./github.ts";

const SvgFile = `<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject x="0" y="0" width="550" height="100%">
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
</svg>`;

const ContributorsTemplate = `
<tr>
<th>昵称</th>
<th>贡献等级</th>
<th>积分</th>
<th>文章数</th>
<th>角色</th>
</tr>
`;

export async function drawContributors() {
	let svg_str = SvgFile;
	let content = ContributorsTemplate;

	// 转换 JSON to HTML
	const info = await getContributorInfo();
	const contributors = JSON.parse(atob(info.content));

	// console.log(contributors);
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
		let role = titleTable(score);
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

		content += "| [" +
			display_name +
			"](https://github.com/" +
			arrObj[index][0] +
			") | " +
			levelTable(score) +
			" | " +
			score +
			" | " +
			`[${article_num}](https://github.com/search?q=${arrObj[index][0]}+repo%3Astudyrs%2FRustt+path%3A%2FArticles&type=Code&ref=advsearch)` +
			" | " +
			role +
			" | " +
			title +
			" |\n";
	}
	return content;
}

function levelTable(score: number): string {
	if (score < 10) {
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
	if (score < 150) {
		return "预备成员";
	} else if (score >= 150 && score < 700) {
		return "正式成员";
	}
	return "核心成员";
}
