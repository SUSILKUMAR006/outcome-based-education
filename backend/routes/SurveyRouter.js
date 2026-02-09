import express from 'express';

import { SubmitSurvey, getAllReport, getSurveysByReportId, getReportsWithSurveys } from '../controllers/SurveyControler.js';

const Surveyrouter = express.Router();

Surveyrouter.post('/submit-survey', SubmitSurvey);
Surveyrouter.get('/reports', getAllReport);
Surveyrouter.get('/by-report/:reportId', getSurveysByReportId);
Surveyrouter.get('/reports-with-surveys', getReportsWithSurveys);


export default Surveyrouter;