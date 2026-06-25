import type { Request, Response } from "express";
import { Attempt, type AttemptI } from "../model/attempt.model.ts";
import { Question, type questionI } from "../model/question.model.ts";
import { createQuestions } from "./question.controller.ts";


export const createAttempt = async (req: Request, res: Response) =>{
    const {
    userId,
    questionNo,
    name,
    tag,
    link,
    time,
    hint,
    } = req.body;

    try{
        const question = await Question.findOne({questionNo, userId}) as questionI | null;
        let questionId:any
        if (!question){
            questionId = await createQuestions({
                userId,
                questionNo,
                name,
                tag,
                link
            })
        }
        else{
            questionId = (question as any)._id
        }

        const data: AttemptI = {
            userId,
            questionId,
            time,
            hint
        }

        await Attempt.create(data);
        res.status(201).json({msg: "Record Created"})

    }
    catch(e){
        res.status(400).json({msg: e})
    }
}

export const getAttempt = async (req: Request, res: Response)=>{
    const questionId = req.params.id

    if (!questionId){
        return res.status(422).json("Invalid Data Entered")
    }
    try{
        const response: AttemptI[] = await Attempt.find({questionId, })
        return res.status(200).json({msg: "Data Fetched Successfully", response})
    }
    catch(e){
        return res.status(400).json({msg: "Somthing Went Wrong"})
    }
}