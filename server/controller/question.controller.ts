import { Types } from "mongoose";
import { Question, type questionI } from "../model/question.model.ts";
import type { Request, Response } from "express";
import { error } from "node:console";

interface data{
    userId: Types.ObjectId,
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
        const userId = new Types.ObjectId(req.user.id as string)
        const questions: questionI[] = await Question.find({userId})
        .sort({ questionNo: 1 })
        return res.status(200).json({msg: "Data Retrieved Successfully", questions})
    }
    catch(e){
        return res.status(400).json({msg: "Somthing Went Wrong"})
    }
}