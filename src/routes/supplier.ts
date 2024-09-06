
import { createSupplier, getSupplier, getSupplierById } from '@/controllers/supplier';
import express from 'express';

const supplierRoute = express.Router()

supplierRoute.post('/supplier', createSupplier);
supplierRoute.get('/supplier', getSupplier)
supplierRoute.get('/supplier/:id', getSupplierById)



export default supplierRoute;