
import { DeletePayee, createPayee, getPayee, getPayeeById, updatePayeeById } from '@/controllers/payee';

import express from 'express';

const payeeRoute = express.Router()

payeeRoute.post('/payee', createPayee);
payeeRoute.get('/payee', getPayee)
payeeRoute.get('/payee/:id', getPayeeById)
payeeRoute.put('/payee/:id', updatePayeeById)
payeeRoute.delete('/payee/:id', DeletePayee)


export default payeeRoute;