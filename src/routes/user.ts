
import { DeleteUser, createUser, getAttendants, getUserById, getUsers, updateUserById, updateUserPasswordById } from '@/controllers/users';
import express from 'express';

const userRoute = express.Router()

userRoute.post('/users', createUser);
userRoute.get('/users', getUsers)
userRoute.get('/attendants', getAttendants)
userRoute.get('/users/:id', getUserById)
userRoute.put('/users/:id', updateUserById)
userRoute.put('/users/update-password/:id', updateUserPasswordById)
userRoute.delete('/users/:id', DeleteUser)


export default userRoute;