import mongoose, { Model, Schema } from "mongoose";

export interface UserI{
    username: string,
    email: string,
    password: string,
}

const userSchema: Schema<UserI> = new mongoose.Schema({
    username:{
        type: String,
        reqired: true,
        unique: true,
    },
    email:{
        type: String,
        reqired: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
},
{
    timestamps: true
})

export const User : Model<UserI> = mongoose.model("User", userSchema)