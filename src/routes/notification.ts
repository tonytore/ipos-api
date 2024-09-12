

import {DeleteNotification, createNotification, getNotification, updateNotificationById } from '@/controllers/notification';

import express from 'express';

const notificationRoute = express.Router()

notificationRoute.post('/notification', createNotification);
notificationRoute.get('/notification', getNotification)
notificationRoute.put('/notification/:id', updateNotificationById)
notificationRoute.delete('/notification/:id', DeleteNotification)


export default notificationRoute;