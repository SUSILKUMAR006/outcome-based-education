import express from 'express';
import { addReport , getAllReports , getReportById, getReportsByType, getInternalReportsByIAT, updateReport, deleteReport } from '../controllers/ReportController.js';

const ReportRouter = express.Router();

ReportRouter.post('/addReport' , addReport);
ReportRouter.get('/getAll' , getAllReports);
ReportRouter.get('/get/:id' , getReportById);
ReportRouter.get('/getByType/:type' , getReportsByType);  // Get by report_type (internal/endsem)
ReportRouter.get('/internal/getByIAT/:iatType' , getInternalReportsByIAT);  // Get internal reports by IAT type
ReportRouter.put('/update/:id' , updateReport);  // Update report by ID
ReportRouter.delete('/delete/:id' , deleteReport);  // Delete report by ID

export default ReportRouter;