import { registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { User } from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const registerUser = TryCatch(async(req,res)=>{

    const sanitizedBody = sanitize(req.body);

    const validation = registerSchema.safeParse(sanitizedBody);

    if(!validation.success){

        const zodError = validation.error;

        let firstErrorMessage = "Validation failed";
        let allErrors = [];

        if(zodError?.issues && Array.isArray(zodError.issues)) {
            allErrors = zodError.issues.map((issue) => ({
                field: issue.path ? issue.path.join(".") : "unknown",
                message: issue.message || "Validation Error",
                code: issue.code,
            }));

            firstErrorMessage = allErrors[0]?.message || "validation Error";

        }

        return res.status(400).json({
            message: firstErrorMessage,
            error: allErrors,
        });
    }

    const { name , email , password } = validation.data;

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message: "Too many registration attempts. Please try again later."
        })
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(400).json({
            message: "User with this email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const verifyKey = `verify:${verifyToken}`;

    const datatoStore = JSON.stringify({
        name,
        email,
        password: hashedPassword,
    })

    await redisClient.setEx(verifyKey, 300, datatoStore);

    res.json({
        name,
        email,
        password
    })
});