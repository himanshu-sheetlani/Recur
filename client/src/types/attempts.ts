import type { APIRes } from "./stats";

interface response {
    _id: string,
    userId: string,
    questionId: string,
    time: number,
    hint: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number,
}

export interface attempts extends APIRes{
    response: response[]
}
