const express = require('express');
const router = express.Router();
const { checkDocument, rejectDocument, issueCard, updateFinaCtmKey, updateReceiver } = require('../controllers/manage_doc/applicants_manage');
const { authCheck, verifierCheck} = require('../middlewares/authCheck');

// Update applicant status to 'checked' and log to audit_logs
router.put('/check_document', authCheck, verifierCheck, checkDocument);

// Update applicant status to 'rejected' and log to audit_logs
router.put('/reject_document', authCheck, verifierCheck, rejectDocument);

router.put('/issued', authCheck, verifierCheck, issueCard);
router.put('/update_fina_ctm_key', authCheck, verifierCheck, updateFinaCtmKey);
router.post('/confirm-received', authCheck, verifierCheck, updateReceiver);

module.exports = router;