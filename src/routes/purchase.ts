
import { createPurchaseOrder, getPurchase } from '@/controllers/purchases';
import express from 'express';

const purchaseRoute = express.Router()

purchaseRoute.post('/purchase', createPurchaseOrder);
purchaseRoute.get('/purchase', getPurchase)



export default purchaseRoute;