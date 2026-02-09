import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import studentRouter from './routes/StudentRoute.js';
import DepartmentRouter from './routes/DepartmentRouter.js';
import SubjectRouter from './routes/SubjectRouter.js';
import ReportRouter from './routes/ReportRouter.js';
import Surveyrouter from './routes/SurveyRouter.js';
import UserRouter from './routes/UserRouter.js';
import CoPoRouter from './routes/CoPoRouter.js';
import FinalAttainmentRouter from './routes/FinalAttainmentRouter.js';


// app config
const app = express();
const port = 4000

app.use(cors());

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// database config
connectDB();


// API end points

app.use('/student', studentRouter);
app.use('/students', studentRouter);
app.use('/department', DepartmentRouter);
app.use('/departments', DepartmentRouter);
app.use('/subject', SubjectRouter);
app.use('/subjects', SubjectRouter);
app.use('/report', ReportRouter);
app.use('/reports', ReportRouter);
app.use('/report', ReportRouter);
app.use('/Survey', Surveyrouter);
app.use('/Surveys', Surveyrouter);
app.use('/Users/api', UserRouter);
app.use('/Users/api', UserRouter);
app.use('/user/api', UserRouter);
app.use('/copo', CoPoRouter);
app.use('/final-attainment', FinalAttainmentRouter);


// api endpoints
app.get('/', (req,res)=>{
    res.send("Hello Susil!!!")
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}` );
})

//mongodb+srv://OBE:OBE123@cluster0.04gsnxu.mongodb.net/