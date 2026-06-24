import { Router } from "express";
import { createAttempt } from "../controller/attempt.controller.ts";

const route = Router();

route.post('/attempt', createAttempt)

export default route