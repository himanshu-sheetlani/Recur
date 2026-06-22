import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URI= process.env.MONGO_URI as string

export const connectDB = async(): Promise<void> =>{
    try{
        await mongoose.connect(DB_URI)
        console.log("DB connected")
    }
    catch(e){
        console.log(e)
    }
}