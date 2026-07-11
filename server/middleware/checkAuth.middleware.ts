import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface userToken extends JwtPayload {
    id: string,
    username: string,
    email: string,
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.cookies.token
    const secret = process.env.JWT_SECRET as string

    if (!token){
        return res.status(401).json({"msg": "Unauthorized User"})
    }
    try{
        const user = jwt.verify(token, secret) as userToken
        req.user = user
        next()
    }
    catch{
        return res.status(401).json({"msg": "Invalid or expired token"})
    }
}