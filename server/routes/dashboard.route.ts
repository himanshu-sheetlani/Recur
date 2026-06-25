import { Router } from "express";
import { createAttempt, getAttempt } from "../controller/attempt.controller.ts";

const route = Router();

route.post('/attempt', createAttempt)
route.get('/question/:id', getAttempt)

export default route