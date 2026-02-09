import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://OBE:OBE123@cluster0.04gsnxu.mongodb.net/Outcome-Based-Education").then(()=>console.log("MongoDB connected successfully")).catch((error)=>console.log(error)); 
}