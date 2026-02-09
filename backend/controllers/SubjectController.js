import SubjectModel from "../models/SubjectModel.js";


const addSubject = async (req , res) =>{
    try {
        const { subjectName , subjectCode } = req.body;

        const newSubject = new SubjectModel({
            subjectName,
            subjectCode
        })

        const savedSubject = await newSubject.save();
        res.json(savedSubject);

    } catch (error) {
        console.log(error);
    }

}


const getAllSubjects = async (req, res)=>{
    try {
        const subjects = await SubjectModel.find();
        res.json(subjects);
    } catch (error) {
        console.log(error);
    }
} 

export { addSubject, getAllSubjects };