import express from 'express';

import { addSubject, getAllSubjects } from '../controllers/SubjectController.js';


const SubjectRouter = express.Router();

SubjectRouter.post('/add', addSubject);
SubjectRouter.get('/getAll', getAllSubjects);

export default SubjectRouter;