const express = require('express');
const router = express.Router();
const leadVendorController = require('../controllers/leadController/leadController');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');


router.post('/', authenticateJWT, leadVendorController.createLeadVendor);