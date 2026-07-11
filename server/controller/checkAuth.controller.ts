import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface userToken extends JwtPayload {
    id: string,
    username: string,
    email: string,
}

export const checkAuth = (req: Request, res: Response) =>{
    const token = req.cookies.token
    const secret = process.env.JWT_SECRET as string

    if (!token){
        return res.status(401).json({"msg": "Unauthorized User"})
    }
    try{
        const user = jwt.verify(token, secret) as userToken
        res.status(200).json({
            id: user.id,
            username: user.username,
        })
    }
    catch(e){
        return res.status(401).json({msg: "Invalid or expired token", error: e})
    }
}