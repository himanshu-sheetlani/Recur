import type { Response, Request } from "express"
import jwt from "jsonwebtoken"
import { User } from "../model/user.model.ts";
import bcrypt from "bcrypt"

import type { UserI } from "../model/user.model.ts";

const JWT_Secret = process.env.JWT_SECRET as string

export const login = async (req: Request, res: Response)=>{
    try{
        const {username, email, password} = req.body;
        if (!username || !email || !password ){
            return res.status(401).json({"msg": "invalid data entered"})
        }
        const user = await User.findOne({username, email})

        if (!user) {
            return res.status(401).json({"msg":"user not found"})
        }

        const pass: boolean = await bcrypt.compare(password, user.password)
        if (!pass){
            return res.status(401).json({"msg":"invalid password"})
        }

        const token = jwt.sign({
                id: user._id.toString(), 
                email: user.email, 
                username: user.username
            }, 
            JWT_Secret, 
            {
                expiresIn: '7d'
            } 
        )

        res.status(200).json({
            "msg": "login Successfull",
            "username": user.username,
        })
    }
    catch(e){
        res.status(400).json({"msg": e})
    }

}

export const signup = async (req: Request, res: Response) =>{
    try{
        const {username, email, password} = req.body;
        if (!username || !email || !password ){
            return res.status(422).json({"msg": "invalid data entered"})
        }
        const checkUser = await User.findOne({$or: [{ username }, { email }]})

        if (checkUser) {
            return res.status(409).json({"msg":"user already exist"})
        }
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await User.create({username, email, password: hashPassword})

        const token = jwt.sign({
                id: user._id.toString(), 
                email: user.email, 
                username: user.username
            }, 
            JWT_Secret, 
            {
                expiresIn: '7d'
            } 
        )

        res.cookie('token', token, {httpOnly: true, maxAge: 1000*60*60*24*7})

        return res.status(201).json({
            "msg": "user created successfully",
            "username": user.username,
        })
    } 
    catch(e){
        res.status(400).json({"msg": e})
    }
}