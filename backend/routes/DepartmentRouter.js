import express from "express";
import { addDepartment, getAllDepartments } from "../controllers/DepartmentController.js";
import multer from "multer";


const DepartmentRouter = express.Router();

DepartmentRouter.post("/add",addDepartment);
DepartmentRouter.get("/getAll",getAllDepartments);


export default DepartmentRouter;