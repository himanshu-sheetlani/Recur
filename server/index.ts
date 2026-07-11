import express from "express"
import { connectDB } from "./utils/db.ts";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import {rateLimit} from 'express-rate-limit'

const app = express();

const limiter = rateLimit({
  windowMs: 1000*60*15,
  limit:50,
})

app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(limiter)

import healthRouter from "./routes/health.route.ts"
import authRouter from "./routes/auth.route.ts"
import dashboardRoute from "./routes/dashboard.route.ts"

app.use("/api/health", healthRouter)
app.use("/api/auth", authRouter )
app.use("/api/dashboard", dashboardRoute)

app.listen(3000, ()=>{
    connectDB()
    console.log("running on http://localhost:3000")
})