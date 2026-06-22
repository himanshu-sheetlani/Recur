import express from "express"
import type {Request, Response} from 'express'

const app = express();

app.use(express.json())

app.get("/", (req:Request, res: Response)=>{
    res.status(200).json({'status': "Working"})
})

app.listen(3000, ()=>{
    console.log("running on http://localhost:3000")
})