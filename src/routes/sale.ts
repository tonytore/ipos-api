
import { DeleteSale, createSale, createSaleItems, getSaleById, getSales } from '@/controllers/sale';

import express from 'express';

const saleRoute = express.Router()

saleRoute.post('/sales', createSale);
saleRoute.post('/sales/items', createSaleItems);
saleRoute.post('/sales', createSale);
saleRoute.get('/sales', getSales)
saleRoute.get('/sales/:id', getSaleById)
// saleRoute.put('/sale/:id', updateBrandById)
saleRoute.delete('/sales/:id', DeleteSale)


export default saleRoute;