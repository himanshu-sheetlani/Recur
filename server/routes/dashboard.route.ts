import { Router } from "express";
import { createAttempt, getAttempt } from "../controller/attempt.controller.ts";
import { getQuestions } from "../controller/question.controller.ts";
import {authMiddleware} from '../middleware/checkAuth.middleware.ts'
import { getStats } from "../controller/stats.controller.ts";

const route = Router();

route.post('/attempt', authMiddleware , createAttempt)
route.get('/question/:id', authMiddleware , getAttempt)
route.get('/question', authMiddleware , getQuestions)
route.get('/stats', authMiddleware, getStats)

export default route