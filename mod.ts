import { WebService } from "./core/app.ts";
import { loadConfig } from "./core/config.ts";

// 加载本地配置信息
const config = loadConfig();

if (!config.port) {
    config.port = 8080;
}

WebService.startup(config.port);