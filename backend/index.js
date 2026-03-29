import express from "express"
import dotenv from 'dotenv'
import connectDb from "./config/db.js";
import user from "./routes/user.js"
import {createClient} from 'redis';
import chalk from "chalk";

dotenv.config();

await connectDb();

const redisUrl = process.env.REDIS_URL;

if(!redisUrl){
    console.error(chalk.bgRed.white(" REDIS_URL is not defined! "));
    process.exit(1);
}

export const redisClient = createClient({
    url: redisUrl,
});

redisClient
.connect()
.then(() => console.log(chalk.red("Connected to redis")))
.catch(err => console.error(chalk.red(err)));


const app = express();

app.use(express.json());

app.use("/api/v1",user);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(chalk.blue(`Server is running on port ${PORT}`));
});