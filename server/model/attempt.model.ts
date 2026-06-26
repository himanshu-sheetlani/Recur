import mongoose, { Model, Schema } from "mongoose";
import type { ObjectId } from "mongoose";

export interface AttemptI{
    userId: string,
    questionId: mongoose.Schema.Types.ObjectId,
    time: number,
    hint: boolean,
}

const attemptSchema: Schema<AttemptI> = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    hint:{
        type: Boolean,
        required: true,
    },
},
{
    timestamps: true
})

export const Attempt: Model<AttemptI> = mongoose.model("Attempt", attemptSchema)