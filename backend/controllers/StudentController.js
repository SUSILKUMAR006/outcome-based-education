import StudentModel from "../models/StudentModel.js";
import fs from "fs";



// Create a new student
const addStudent = async (req, res) => {
    try{
        const { name, rollNumber, department, batch } = req.body;

        const newStudent = new StudentModel({
            name,
            rollNumber,
            department,
            batch
        })
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    }catch(error){
        console.log(error);
    }
}



const getAllStudents = async(req,res)=>{
    try{
        const students = await StudentModel.find().sort({ rollNumber: 1 });
        res.json(students);
    }catch(error){
        console.log(error);
    }
}

export { addStudent , getAllStudents };