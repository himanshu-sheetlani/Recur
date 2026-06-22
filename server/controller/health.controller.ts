import type { Request, Response } from 'express';

export const health = (req: Request, res: Response) =>{
    return res.status(200).json({'health': "server is healthy"})
}