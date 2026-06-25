import { Question, type questionI } from "../model/question.model.ts";
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

    try{
        const userId = req.user.id
        const questions: questionI[] = await Question.find({userId})

        return res.status(200).json({msg: "Data Retrieved Successfully", questions})
    }
    catch(e){
        return res.status(400).json("Somthing Went Wrong")
    }
}