import type { APIRes } from "./stats";

interface question{
    _id:string,
    userId: string,
    questionNo: number,
    name?: string,
    tag: "easy" | "medium" | "hard",
    link: string,
    createdAt: string;
    updatedAt: string;
    _v: number;
}

export interface questions extends APIRes{
    questions:question[]
}