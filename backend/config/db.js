import mongoose from "mongoose";
import chalk from "chalk";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.green("MongoDB Connected"));
    } catch (error) {
        console.error(
            chalk.red("MongoDB Connection Error:"),
            chalk.yellow(error.message)
        );
        process.exit(1); // good practice: stop app if DB fails
    }
};

export default connectDb;