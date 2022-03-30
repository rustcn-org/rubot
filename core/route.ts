import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

import { hooks } from "../service/hooks.ts";

export const router = new Router();

router.post("/callback/", hooks);