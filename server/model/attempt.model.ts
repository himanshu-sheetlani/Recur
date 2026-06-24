import mongoose, { Model, Schema } from "mongoose";

export interface AttemptI{
    userId: string,
    questionId: string,
    time: number,
    hint: boolean,
}

const attemptSchema: Schema<AttemptI> = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    questionId:{
        type: String,
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