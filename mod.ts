import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { router } from "./core/route.ts";
import { CommonConfig } from "./config/common.ts";
import { startTask } from "./service/task.ts";

// 创建一个 oak 应用程序
const app = new Application({
    logErrors: false,
});

app.use(router.routes());
app.use(router.allowedMethods());

startTask();

// 启动 Oak 服务器
app.listen({ port: CommonConfig.port });
