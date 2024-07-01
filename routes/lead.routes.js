
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController/leadController');
const authenticateJWT = require('../middlewares/auth/authenticate-jwt');

router.get('/search', authenticateJWT, leadController.searchLeads);
router.post('/', authenticateJWT, leadController.createLead);
router.get('/', authenticateJWT, leadController.displayAllLeads);
router.get('/:id', authenticateJWT, leadController.displayLeadInformation);

module.exports = router;
