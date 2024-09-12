

import { createAdjustment, getAdjustment } from '@/controllers/adjustment';
import express from 'express';

const adjustmentRoute = express.Router()

adjustmentRoute.post('/adjustment', createAdjustment);
adjustmentRoute.get('/adjustment', getAdjustment)



export default adjustmentRoute;