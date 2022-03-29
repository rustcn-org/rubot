import { Application } from "oak/mod.ts";
import { router } from "./route.ts";

export const WebService = {
  startup: (port: number) => {
    const app = new Application();
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen({ port: port });
  },
};
