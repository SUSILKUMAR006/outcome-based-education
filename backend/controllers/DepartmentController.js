import DepartmentModel from '../models/DeparmentModel.js';

const addDepartment = async (req, res) =>{
    try{
        const{departmentName , headOfDepartment ,contactEmail}= req.body;

        const newDepartment = new DepartmentModel({
            departmentName,
            headOfDepartment,
            contactEmail
        })

        const savedDeparment = await newDepartment.save();
        res.status(201).json(savedDeparment);
    }catch(error){
        console.log(error);
    }

}


const getAllDepartments = async (req,res) =>{
    try{
        const departments = await DepartmentModel.find();
        res.json(departments);
    }catch(error){
        console.log(error);
    }
}

export { addDepartment , getAllDepartments };