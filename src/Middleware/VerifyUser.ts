import { NextFunction, Request,Response } from "express";
import SignJWT from "../utils/SignJWT";
import { sendResponse } from "../utils/Response";

const VerifyUser = (req: any, res: Response, next: NextFunction) => { 
    const bearer = req.headers.authorization;
    if (!bearer) {
        return sendResponse({
            res,
            data: {},
            status: 401,
        })
    }
    const token = bearer.split(' ')[ 1 ];
    if(!token){
        return sendResponse({
            res,
            data: {},
            status: 401,
        })
    };

    try {
        const decoded = SignJWT.verify(token, process.env.JWT_SECRET || "");
        if (!decoded) {
            return sendResponse({
                res,
                data: {},
                status: 401,
            })
        }
        req.user = decoded;

        next();
    }
    catch (err) { 
        console.log(err);
        return sendResponse({
            res,
            data: {},
            status: 401,
        })
    }

}

export default VerifyUser;