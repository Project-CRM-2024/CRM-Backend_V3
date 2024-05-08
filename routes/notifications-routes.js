const { Router } = require('express');
const { addNotification } = require('../controllers/notifications/add-notification.controller');
const { changeNotificationStatus } = require('../controllers/notifications/change-notification-status');
const { fetchUserNotification } = require('../controllers/notifications/fetch-user-notifications');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');

const notificationRouter = Router();

notificationRouter.post('/add-notification', authenticateJWT, addNotification);
notificationRouter.get('/fetch-notifications', authenticateJWT, fetchUserNotification);
notificationRouter.put('/change-notification-status', authenticateJWT, changeNotificationStatus);

module.exports = notificationRouter;
