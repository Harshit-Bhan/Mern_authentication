import crypto from "crypto";
import { redisClient } from "../index.js";

export const generateCsrfToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    
    const csrfKey = `csrf:${userId}`;

    await redisClient.setEx(csrfKey, 3600, csrfToken);

    res.cookie("csrfToken", csrfToken  , {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
    });
    return csrfToken;
}

export const verifyCsrfToken = async(req,res,next) => {
    try {
        if(req.method === "GET") {
            return next();
        }
        const userId = req.user?._id

        if(!userId){
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        const clientToken = req.headers["x-csrf-token"] || req.headers["csrf-token"] || req.headers["xsrf-token"] || req.headers["x-xsrf-token"];

        if(!clientToken){
            return res.status(403).json({
                message: "CSRF token not provided",
                code : "CSRF_TOKEN_MISSING",
            })
        }

        const csrfKey = `csrf:${userId}`;

        const storedToken = await redisClient.get(csrfKey);

        if(!storedToken){
            return res.status(403).json({
                message: "CSRF token not found",
                code : "CSRF_TOKEN_NOT_FOUND",
            })
        }

        if(storedToken !== clientToken){
            return res.status(403).json({
                message: "Invalid CSRF token",
                code : "CSRF_TOKEN_INVALID",
            })
        }

        next();

    } catch (error) {
        console.log("CSRF verification error",error);
        res.status(500).json({
            message: "CSRF verification failed.",
            code: "CSRF_VERIFICATION_ERROR",
        });      
    }
}

export const revokeCsrfToken = async(userId) => {
    const csrfKey = `csrf:${userId}`;
    await redisClient.del(csrfKey);
}

export const refreshCsrfToken = async(userId,res) => {
    await revokeCsrfToken(userId);

    return await generateCsrfToken(userId,res);
}