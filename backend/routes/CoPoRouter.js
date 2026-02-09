import express from 'express';
import { createCoPo, getCoPo } from '../controllers/CoPoController.js';

const router = express.Router();

router.post('/create', createCoPo);
router.get('/', getCoPo);

export default router;
