import { Context } from "oak/mod.ts";
import { CommonConfig } from "../config/common.ts";

export async function hooks(context: Context) {
  const body = context.request.body();
  context.response.type = "json";
  if (body.type != "json") {
    context.response.body = {
      "error": "未知的请求类型",
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
      },
      content: payload.comment.body,
      creator: payload.comment.user.login,
    };

    await comment_created(cc_info);
  }
}

interface CommentCreated {
  issue: {
    title: string;
    author: string;
    content: string;
  };
  content: string;
  creator: string;
}

async function comment_created(info: CommentCreated) {
  const response = await fetch(
    "https://api.github.com/orgs/" + CommonConfig.organization.name + "/teams",
    {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": "token " + CommonConfig.organization.token,
        }
    }
  );
  response.body;
}
