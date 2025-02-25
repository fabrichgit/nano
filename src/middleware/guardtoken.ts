import { NextFunction, Request, Response } from "express";
import {verify} from "jsonwebtoken"

const verifyToken = (token: string) => {
    return verify(token, process.env.JWT_SECRET as string);
};

export const guardToken = (req: Request, res: Response, next: NextFunction) => {
    const token = (() => {
        const headers = req.headers;
        const bearer = headers.authorization! as string;
        return bearer.split(' ')[1];
    })();

    if (token) {
        try {
            const decoded = verifyToken(token);
            res.status(202).send()
        } catch (error) {
            res.status(400).send()
        }
    } else {
        res.status(400).send()
    }
}