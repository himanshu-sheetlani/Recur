import { Router } from "express";
import { createAttempt, getAttempt } from "../controller/attempt.controller.ts";
import { getQuestions } from "../controller/question.controller.ts";
import {authMiddleware} from '../middleware/checkAuth.middleware.ts'

const route = Router();

route.post('/attempt', authMiddleware , createAttempt)
route.get('/question/:id', authMiddleware , getAttempt)
route.get('/question', authMiddleware , getQuestions)

export default route