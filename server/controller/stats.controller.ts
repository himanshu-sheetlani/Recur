import type { Request, Response } from "express";
import { Question, type questionI } from "../model/question.model.ts";
import { Attempt } from "../model/attempt.model.ts";


export const getStats = async (req: Request, res: Response) => {
    const user = req.user
    const userId = user.id

    const difficultyTag = async ()=>{
        const tag = {
            easy: 0,
            medium: 0,
            hard: 0,
        }
        const difficultyStats = await Question.aggregate([
            {
                $match:{
                    userId: userId
                }
            },
            {
                $group:{
                    _id: "$tag",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        difficultyStats.forEach(item => {
            tag[item._id as "easy" | "medium" | "hard"] = item.count;
        });
        return tag
    }

    const avgTimeTaken = async() =>{
        try{
            const time = await Attempt.aggregate([
                {
                    $match: {
                        userId: userId
                    }
                },
                {
                    $group:{
                        _id: null,
                        avgTime: {
                            $avg: '$time'
                        }
                    }
                }
            ])
            return time[0].avgTime
        }
        catch(e){
            return (e)
        }
    }

    const recent = async() =>{
        try{
            const recentQuestions = await Attempt.find({
                userId
            })
            .populate("questionId", "questionNo name tag link")
            .sort({updatedAt: -1})
            .limit(5)
            return recentQuestions
        }
        catch(e){
            return e
        }
    }
    
    try{
        const tag = await difficultyTag()
        const totalQuestion = tag.easy + tag.medium + tag.hard
        const avgTime = await avgTimeTaken()
        const recentAttempt = await recent()
        
        res.status(200).json({msg: "Successful", tag, totalQuestion, avgTime, recentAttempt})
    }
    catch(e){
        res.status(400).json({msg: "Somthing went Wrong"})
    }
}