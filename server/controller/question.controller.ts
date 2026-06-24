
import { Quesion, type questionI } from "../model/question.model.ts";

interface data{
    userId: string,
    questionNo: number,
    name?: string,
    tag: "easy" | "medium" | "hard",
    link: string
}

export const createQuestions = async (body: data) =>{
    const question = await Quesion.create(body)
    const questionId = question._id
    return questionId
}