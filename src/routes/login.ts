

import { authorizaUser } from '@/controllers/login';
import express from 'express';

const loginRoute = express.Router()

loginRoute.post('/auth/login', authorizaUser);



export default loginRoute;