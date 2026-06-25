import { Question, type questionI } from "../model/question.model.ts";
import jwt from "jsonwebtoken";

import type { userToken } from "./checkAuth.controller.ts";
import type { Request, Response } from "express";

interface data{
    userId: string,
    questionNo: number,
    name?: string,
    tag: "easy" | "medium" | "hard",
    link: string
}


export const createQuestions = async (body: data) =>{
    const question = await Question.create(body)
    const questionId = question._id
    return questionId
}

export const getQuestions = async(req: Request, res: Response) =>{
    const token = req.cookies.token
    const secret = process.env.JWT_SECRET as string

    if (!token){
        return res.status(401).json({msg: "Unauthorized User"})
    }

    try{
        const user = jwt.verify(token, secret) as userToken
        const userId = user.id

        const questions: questionI[] = await Question.find({userId})

        return res.status(200).json({msg: "Data Retrieved Successfully", questions})
    }
    catch(e){
        return res.status(400).json("Somthing Went Wrong")
    }
}