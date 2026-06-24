
const express = require('express');
const router = express.Router();
const { getReport,getVerifierReport, getLogs, getLogReport } = require('../controllers/follow_applicant');
const { authCheck, adminCheck, verifierCheck, verifierOrReceiverCheck } = require('../middlewares/authCheck');

router.get('/follow-report', authCheck, getReport);
router.get('/verifier-report', authCheck, verifierOrReceiverCheck, getVerifierReport);
router.get('/log-report', authCheck, adminCheck, getLogReport);


module.exports = router;
