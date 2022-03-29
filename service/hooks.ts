import { Context } from "oak/mod.ts";

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
  // 在这里我们需要检查 action 的类型（是 ISSUE 的创建还是评论的创建）
  const action_tyoe = payload.action;

  if (action_tyoe == "created") {
      // 这里是创建 评论  
  } else if (action_tyoe == "opened") {
      // 这里是创建 ISSUE
  }
}

async function issue_opened() {

}

async function comment_created() {
    
}