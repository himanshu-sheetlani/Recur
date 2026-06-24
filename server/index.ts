import express from "express"
import type {Request, Response} from 'express'
import { connectDB } from "./utils/db.ts";
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());

import healthRouter from "./routes/health.route.ts"
import authRouter from "./routes/auth.route.ts"
import checkAuth from "./routes/me.route.ts"

app.use("/api/health", healthRouter)
app.use("/api/auth", authRouter )
app.use("/api/me", checkAuth )

app.listen(3000, ()=>{
    connectDB()
    console.log("running on http://localhost:3000")
})