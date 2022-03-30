import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { router } from "./core/route.ts";
import { CommonConfig } from "./config/common.ts";

// 创建一个 oak 应用程序
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

// 启动 Oak 服务器
app.listen({
    hostname: "rubot.deno.dev",
    port: CommonConfig.port,
});
