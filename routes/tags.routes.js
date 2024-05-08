'use strict';

const { Router } = require('express');
const addTagController = require('../controllers/account-setting/manage-account/addTag.controller');

const authRouter = Router();

authRouter.post('/addTag/:id', addTagController);

module.exports = authRouter;
