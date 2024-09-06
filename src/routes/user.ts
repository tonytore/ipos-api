
import { createUser, getUserById, getUsers } from '@/controllers/users';
import express from 'express';

const userRoute = express.Router()

userRoute.post('/users', createUser);
userRoute.get('/users', getUsers)
userRoute.get('/users/:id', getUserById)



export default userRoute;