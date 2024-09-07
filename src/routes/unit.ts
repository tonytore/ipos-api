

import { DeleteUnit, createUnits, getUnitById, getUnits, updateUnitById } from '@/controllers/unit';
import express from 'express';

const unitRoute = express.Router()

unitRoute.post('/unit', createUnits);
unitRoute.get('/unit', getUnits)
unitRoute.get('/unit/:id', getUnitById)
unitRoute.put('/unit/:id', updateUnitById)
unitRoute.delete('/unit/:id', DeleteUnit)


export default unitRoute;