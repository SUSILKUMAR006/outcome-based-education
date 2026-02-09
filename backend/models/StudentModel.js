import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name:{type:String, required:true},
    rollNumber:{type:String, required:true, unique:true},
    department:{type:String, required:true},
    batch:{type:String, required:true}
})


const StudentModel = mongoose.models.student || mongoose.model("student", StudentSchema);

export default StudentModel;