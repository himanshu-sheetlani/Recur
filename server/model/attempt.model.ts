import mongoose, { Model, Schema, Types } from "mongoose";

export interface AttemptI{
    userId: Types.ObjectId,
    questionId: Types.ObjectId,
    time: number,
    hint: boolean,
}

const attemptSchema: Schema<AttemptI> = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
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