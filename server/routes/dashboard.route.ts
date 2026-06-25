import { Router } from "express";
import { createAttempt, getAttempt } from "../controller/attempt.controller.ts";
import { getQuestions } from "../controller/question.controller.ts";

const route = Router();

route.post('/attempt', createAttempt)
route.get('/question/:id', getAttempt)
route.get("/question", getQuestions)

export default route