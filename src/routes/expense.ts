import { DeleteExpense, createExpense, getExpense, getExpenseById, updateExpenseById } from '@/controllers/Expense';


import express from 'express';

const expenseRoute = express.Router()

expenseRoute.post('/expense', createExpense);
expenseRoute.get('/expense', getExpense)
expenseRoute.get('/expense/:id', getExpenseById)
expenseRoute.put('/expense/:id', updateExpenseById)
expenseRoute.delete('/expense/:id', DeleteExpense)


export default expenseRoute;