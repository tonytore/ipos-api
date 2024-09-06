

import { DeleteShop, createShops, getShopAttendants, getShopById, getShops, updateShopById } from '@/controllers/shops';
import express from 'express';

const shopRoute = express.Router()

shopRoute.post('/shops', createShops);
shopRoute.get('/shops', getShops)
shopRoute.get('/shops/:id', getShopById)
shopRoute.get('/attendants/shop/:id', getShopAttendants)
shopRoute.put('/shops/:id', updateShopById)
shopRoute.delete('/shops/:id', DeleteShop)


export default shopRoute;