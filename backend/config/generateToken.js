import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

export const generateToken = async(id,res) =>{
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: "1m",
    })

    const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET,{
        expiresIn: "7d",
    });

    const refreshTokenKey = `refresh_token:${id}`;

    await redisClient.setEx(refreshTokenKey,7*24*60*60,refreshToken);

    res.cookie("access_token",accessToken,{
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 1 * 60 * 1000,
    });

    res.cookie("refresh_token",refreshToken,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        // secure: true,
        sameSite: "none",
    })

    return {accessToken, refreshToken};

}
