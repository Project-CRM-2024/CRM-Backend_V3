const { Router } = require('express');
const multer = require('multer');
const { createCampaign } = require('../controllers/campaign');
const { fetchCampaignsByUser } = require('../controllers/campaign/fetch-campaigns-by-user');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');
const { triggerScheduler } = require('../controllers/campaign/send-sms');

const campaignRouter = Router();
const upload = multer({ dest: 'uploads/' });

campaignRouter.post('/create-campaign',upload.single('file'), authenticateJWT, createCampaign);
campaignRouter.get('/fetch-campaigns-user', authenticateJWT, fetchCampaignsByUser);
campaignRouter.post('/schedule', triggerScheduler);

module.exports = campaignRouter;
