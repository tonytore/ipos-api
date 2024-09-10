
import { DeleteSale, createSale, getSaleById, getSales, getShopSales, getShopsSales } from '@/controllers/sale';

import express from 'express';

const saleRoute = express.Router()

saleRoute.post('/sales', createSale);
//saleRoute.post('/sales/items', createSaleItems);
saleRoute.post('/sales', createSale);
saleRoute.get('/sales', getSales)
saleRoute.get('/sales/shop', getShopSales)  // when we use req.query
//saleRoute.get('/sales/shop/:shopId', getShopSales) // when we use req.params
saleRoute.get('/sales/all-shops', getShopsSales)
saleRoute.get('/sales/:id', getSaleById)
saleRoute.get('/sales/shop', getShopSales)  // when we use req.query
//saleRoute.get('/sales/shop/:shopId', getShopSales) // when we use req.params
saleRoute.get('/sales/all-shops', getShopsSales)
saleRoute.delete('/sales/:id', DeleteSale)


export default saleRoute;