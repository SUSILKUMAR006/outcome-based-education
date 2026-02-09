import express from "express";
import { addStudent, getAllStudents } from "../controllers/StudentController.js";
import multer from "multer";


const studentRouter = express.Router();

studentRouter.post("/add",addStudent);
studentRouter.get("/getAll",getAllStudents)







export default studentRouter;
