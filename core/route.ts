import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { hooks } from "../service/hooks.ts";
import { drawContributors, markdownContributors } from "../service/table.ts";

export const router = new Router();

router.get("/", (ctx) => {
    ctx.response.redirect("https://rustt.org/");
});

router.get("/table/:style/:type", async (ctx) => {
    if (ctx.params.type == "contributors") {
        if (ctx.params.style == "svg") {
            ctx.response.type = "image/svg+xml";
            ctx.response.body = await drawContributors();
        } else {
            ctx.response.body = await markdownContributors();
        }
    } else {
        ctx.response.status = 404;
    }
});

router.post("/callback", hooks);
