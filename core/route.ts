import { Router } from "oak/mod.ts";

import { hooks } from "../service/hooks.ts";

export const router = new Router();

router.post("/callback/", hooks);