import TryCatch from "../middlewares/TryCatch";

export const registerUser = TryCatch(async(req,res)=>{
    const {name,email,password} = req.body;

    res.json({

    })


});