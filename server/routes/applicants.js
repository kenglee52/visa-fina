const express = require('express');
const router = express.Router();
const {
  createApplicant,
  getProvinces,
  getDistricts,
  uploadDocuments,
  getDocuments,
  updateApplicant,
  getApplicant,
  deleteDocument
} = require('../controllers/applicants');
const { authCheck } = require('../middlewares/authCheck');

router.post('/create-applicants', authCheck, createApplicant);
router.get('/provinces', authCheck, getProvinces);
router.get('/districts/:province_id', authCheck, getDistricts);
router.post('/upload-documents', authCheck, uploadDocuments);
router.get('/documents/:applicant_id', authCheck, getDocuments);
router.put('/update-applicant/:applicant_id', authCheck, updateApplicant);
router.delete('/delete-document/:applicant_id/:file_type', authCheck, deleteDocument);
router.get('/applicant/:applicant_id', authCheck, getApplicant);

module.exports = router;
