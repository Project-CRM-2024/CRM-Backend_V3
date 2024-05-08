'use strict';

const { Router } = require('express');
const loginController = require('../controllers/auth/login.controller');
const registerController = require('../controllers/auth/register.controller');
const updateController = require('../controllers/auth/update.controller');

const AuthValidation = require('../middlewares/validations/auth.validations');
const validateSchema = require('../helpers/joiValidation');
const { fetchUserDetails } = require('../controllers/auth/fetch-user-details');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');
const authorizeRole = require('../middlewares/auth/authorize-role');
const changePasswordController = require('../controllers/auth/change-password');

const authRouter = Router();

authRouter.get('/user', authenticateJWT, fetchUserDetails);
authRouter.post('/login', validateSchema({ body: AuthValidation.loginSchema }), loginController);
authRouter.post('/register', registerController);
authRouter.put('/update', authenticateJWT, updateController);
authRouter.put('/change-password', authenticateJWT, authorizeRole(['CRM_USER']), changePasswordController);

module.exports = authRouter;
