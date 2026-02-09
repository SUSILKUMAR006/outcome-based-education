import express from 'express';
import { getAllFinalAttainment, getFinalAttainment, saveFinalAttainment } from '../controllers/FinalAttainmentController.js';

const FinalAttainmentRouter = express.Router();

// Save / upsert
FinalAttainmentRouter.post('/save', saveFinalAttainment);
// Get by batch + subject
FinalAttainmentRouter.get('/by', getFinalAttainment);
// Get all
FinalAttainmentRouter.get('/all', getAllFinalAttainment);

export default FinalAttainmentRouter;

