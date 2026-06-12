const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const { createDistrict, getDistricts, updateDistrict, deleteDistrict } = require('../controllers/address/districts');

router.get('/districts', authCheck, getDistricts);
router.post('/districts', authCheck, adminCheck, createDistrict);
router.put('/districts/:id', authCheck, adminCheck, updateDistrict);
router.delete('/districts/:id', authCheck, adminCheck, deleteDistrict);

module.exports = router;