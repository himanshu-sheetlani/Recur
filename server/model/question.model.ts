import mongoose, { Model, Schema, Types } from "mongoose";

export interface questionI{
    userId: Types.ObjectId,
    questionNo: number,
    name?: string,
    tag: "easy" | "medium" | "hard",
    link: string,
}

const questionSchema: Schema<questionI> = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    questionNo:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
    },
    tag:{
        type: String,
        required: true,
    },
    link:{
        type: String,
        required: true,
    },
},
{
    timestamps: true
})

export const Question: Model<questionI> = mongoose.model("Questions", questionSchema)