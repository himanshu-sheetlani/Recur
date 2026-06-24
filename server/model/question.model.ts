import mongoose, { Model, Schema } from "mongoose";

export interface questionI{
    userId: string,
    questionNo: number,
    name?: string,
    tag: "easy" | "medium" | "hard",
    link: string,
}

const questionSchema: Schema<questionI> = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    questionNo:{
        type: Number,
        required: true,
        unique: true,
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

export const Quesion: Model<questionI> = mongoose.model("Questions", questionSchema)