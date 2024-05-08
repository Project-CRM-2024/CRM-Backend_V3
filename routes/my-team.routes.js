const { Router } = require('express');
const { sendAccessRequest } = require('../controllers/account-setting/my-team/send-access-request.controller');
const getMySupervisorsController = require('../controllers/account-setting/my-team/get-my-supervisors.controller');
const getMyAgentsController = require('../controllers/account-setting/my-team/get-my-agents.controller');
const removeAccessFromMyTeam = require('../controllers/account-setting/my-team/remove-access-from-myteam.controller');
const fetchAccessRequests = require('../controllers/account-setting/my-team/fetch-acces-requests.controller');
const changeAccessRequestStatus = require('../controllers/account-setting/my-team/change-access-request-status.controller');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');
const removeMyTeamAccessRequestByAgentOrSupervisor = require('../controllers/account-setting/my-team/remove-access-by-agent-supervisor.controller');
const authorizeRole = require('../middlewares/auth/authorize-role');

const myTeamRouter = Router();

myTeamRouter.post('/send-access-request', authenticateJWT,authorizeRole(['CRM_USER','CRM_ADMIN']), sendAccessRequest);
myTeamRouter.get('/get-my-supervisors', authenticateJWT,getMySupervisorsController);
myTeamRouter.get('/fetch-access-request', authenticateJWT, fetchAccessRequests);
myTeamRouter.get('/get-my-agents', authenticateJWT,getMyAgentsController);
myTeamRouter.put('/remove-access-request', authenticateJWT, authorizeRole(['CRM_USER','CRM_ADMIN']),removeAccessFromMyTeam);
myTeamRouter.put('/change-access-request-status/:id', authenticateJWT, authorizeRole(['CRM_USER','CRM_ADMIN']),changeAccessRequestStatus);
myTeamRouter.put('/remove-access-request-by-agent-supervisor', authenticateJWT, authorizeRole(['CRM_USER','CRM_ADMIN']),removeMyTeamAccessRequestByAgentOrSupervisor);
module.exports = myTeamRouter;
