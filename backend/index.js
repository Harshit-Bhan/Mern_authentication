import express from "express"
import dotenv from 'dotenv'
import connectDb from "./config/db.js";
import user from "./routes/user.js"

dotenv.config();

await connectDb();

const app = express();

app.use("/api/v1",user);

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log(`Server is running on the port ${PORT}`);
})