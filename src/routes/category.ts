

import { DeleteCategory, createCategory, getCategory, getCategoryById, updateCategoryById } from '@/controllers/category';

import express from 'express';

const categoryRoute = express.Router()

categoryRoute.post('/category', createCategory);
categoryRoute.get('/category', getCategory)
categoryRoute.get('/category/:id', getCategoryById)
categoryRoute.put('/category/:id', updateCategoryById)
categoryRoute.delete('/category/:id', DeleteCategory)


export default categoryRoute;