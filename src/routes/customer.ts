import { createCustomer, getCustomerById, getCustomers } from '@/controllers/customers';
import express from 'express';

const customerRoute = express.Router()

customerRoute.post('/customers', createCustomer);
customerRoute.get('/customers', getCustomers)
customerRoute.get('/customers/:id', getCustomerById)



export default customerRoute;