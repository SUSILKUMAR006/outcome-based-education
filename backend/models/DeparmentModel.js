import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    departmentName:{type:String, required:true, unique:true},
    headOfDepartment:{type:String, required:true},
    contactEmail:{type:String, required:true, unique:true}
})


const DepartmentModel = mongoose.models.department || mongoose.model("department",DepartmentSchema);

export default DepartmentModel;
