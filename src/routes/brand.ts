

import { DeleteBrand, createBrands, getBrandById, getBrands, updateBrandById } from '@/controllers/brand';

import express from 'express';

const brandRoute = express.Router()

brandRoute.post('/brand', createBrands);
brandRoute.get('/brand', getBrands)
brandRoute.get('/brand/:id', getBrandById)
brandRoute.put('/brand/:id', updateBrandById)
brandRoute.delete('/brand/:id', DeleteBrand)


export default brandRoute;