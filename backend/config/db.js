import mongoose from "mongoose";

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connnected");
    } catch (error) {
        console.log("MongoDb connection error",error.message);
        
    }
}

export default connectDb;