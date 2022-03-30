import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { hooks } from "../service/hooks.ts";

export const router = new Router();

router.get("/", (ctx) => {
	ctx.response.body = "Helllo Rubot!";
});

router.post("/callback/", hooks);
