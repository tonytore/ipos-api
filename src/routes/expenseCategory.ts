

import { DeleteExpenseCategory, createExpenseCategory, getExpenseCategory, getExpenseCategoryById, updateExpenseCategoryById } from '@/controllers/ExpenseCategory';
import express from 'express';

const expenseCategoryRoute = express.Router()

expenseCategoryRoute.post('/expense-category', createExpenseCategory);
expenseCategoryRoute.get('/expense-category', getExpenseCategory)
expenseCategoryRoute.get('/expense-category/:id', getExpenseCategoryById)
expenseCategoryRoute.put('/expense-category/:id', updateExpenseCategoryById)
expenseCategoryRoute.delete('/expense-category/:id', DeleteExpenseCategory)


export default expenseCategoryRoute;