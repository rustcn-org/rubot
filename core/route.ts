import { Router } from "oak/mod.ts";

export const router = new Router();

router.get("/", (context) => {
  context.response.body = "Hello 123";
});
