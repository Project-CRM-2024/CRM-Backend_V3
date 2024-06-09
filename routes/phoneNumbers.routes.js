'use strict';

const { Router } = require('express');
const getLocalNumbers = require('../controllers/phone-numbers/getLocalNumbers.controller');
const getTollFreeNumbers = require('../controllers/phone-numbers/getTollFreeNumbers.controller');
const getPhoneNumberSid = require('../controllers/phone-numbers/getPhoneNumberSid.controller');
const removePhoneNumber = require('../controllers/phone-numbers/removePhoneNumber.controller');
const purchaseSelectedNumber = require('../controllers/phone-numbers/purchaseSelectedNumber.controller');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');
const fetchPurchasedPhoneNumbers = require('../controllers/phone-numbers/fetchPurchasedPhoneNumbers');
const fetchDeletedPurchasedPhoneNumbers = require('../controllers/phone-numbers/fetchDeletedPurchasedPhoneNumbers');
const removePhoneNumberFromTwilio = require('../controllers/phone-numbers/removePhoneNumberFromTwilio');
const authorizeRole = require('../middlewares/auth/authorize-role');

const phoneNumbersRouter = Router();

phoneNumbersRouter.get(
	'/fetch-purchased-numbers',
	authenticateJWT,
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	fetchPurchasedPhoneNumbers
);
phoneNumbersRouter.get(
	'/fetch-deleted-purchased-numbers',
	authenticateJWT,
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	fetchDeletedPurchasedPhoneNumbers
);
phoneNumbersRouter.post('/local', authorizeRole(['CRM_USER', 'CRM_ADMIN']), getLocalNumbers);
phoneNumbersRouter.get('/toll-free', authorizeRole(['CRM_USER', 'CRM_ADMIN']), getTollFreeNumbers);
phoneNumbersRouter.get(
	'/:phoneNumber',
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	getPhoneNumberSid
);
phoneNumbersRouter.delete(
	'/:phoneNumber',
	authenticateJWT,
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	removePhoneNumber
);
phoneNumbersRouter.delete(
	'/twilio/:phoneNumber',
	authenticateJWT,
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	removePhoneNumberFromTwilio
);
phoneNumbersRouter.post(
	'/purchase',
	authenticateJWT,
	authorizeRole(['CRM_USER', 'CRM_ADMIN']),
	purchaseSelectedNumber
);

module.exports = phoneNumbersRouter;
