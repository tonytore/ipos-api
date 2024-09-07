

import { DeleteProduct, createProducts, getProductById, getProducts, updateProductById } from '@/controllers/Product';

import express from 'express';

const productRoute = express.Router()

productRoute.post('/product', createProducts);
productRoute.get('/product', getProducts)
productRoute.get('/product/:id', getProductById)
productRoute.put('/product/:id', updateProductById)
productRoute.delete('/product/:id', DeleteProduct)


export default productRoute;