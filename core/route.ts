import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { hooks } from "../service/hooks.ts";
import { drawContributors } from "../service/table.ts";

export const router = new Router();

router.get("/", (ctx) => {
	ctx.response.redirect("https://rustt.org/");
});

router.get("/table/:type", async (ctx) => {
	if (ctx.params.type == "contributors") {
		ctx.response.type = "image/svg+xml";
		ctx.response.body = await drawContributors();
	} else {
		ctx.response.status = 404;
	}
});

router.post("/callback", hooks);
