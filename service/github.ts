import { CommonConfig } from "../config/common.ts";

export async function getApproverList(): Promise<string[]> {
  const response = await fetch(
    "https://api.github.com/orgs/" + CommonConfig.organization.name +
      "/teams/" + CommonConfig.organization.teams.approvers + "/members",
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token " + CommonConfig.bot.token,
      },
    },
  );

  const approvers = await response.json();
  if (approvers.message != null) {
    return [];
  }

  const result = [];
  for (const key in approvers) {
    result.push(approvers[key].login);
  }

  return result;
}
