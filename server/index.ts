import express from "express"
import type {Request, Response} from 'express'
import { connectDB } from "./utils/db.ts";

const app = express();

app.use(express.json())

import healthRouter from "./routes/health.route.ts"
import authRouter from "./routes/auth.route.ts"

app.use("/api/health", healthRouter)
app.use("/api/auth", authRouter )

app.listen(3000, ()=>{
    connectDB()
    console.log("running on http://localhost:3000")
})