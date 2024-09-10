

import { authorizUser, changePassword, forgotPassword, verifyToken } from '@/controllers/login';
import express from 'express';

const loginRoute = express.Router()

loginRoute.post('/auth/login', authorizUser);
loginRoute.put('/auth/forget-password',forgotPassword)
loginRoute.put('/auth/verify-token',verifyToken)
loginRoute.put('/auth/change-password',changePassword)



export default loginRoute;