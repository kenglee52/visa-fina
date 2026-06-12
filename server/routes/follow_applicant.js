
const express = require('express');
const router = express.Router();
const { getReport, getLogs, getLogReport } = require('../controllers/follow_applicant');
const { authCheck, adminCheck } = require('../middlewares/authCheck');

router.get('/follow-report', authCheck, getReport);
router.get('/log-report', authCheck, adminCheck, getLogReport);


module.exports = router;
