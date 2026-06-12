
const express = require('express');
const router = express.Router();
const { authCheck,adminCheck } = require('../middlewares/authCheck');
const {  createProvince,getProvinces,deleteProvince,updateProvince} = require('../controllers/address/provinces');

router.get('/provinces', authCheck, getProvinces);
router.post('/provinces', authCheck, adminCheck, createProvince);
router.put('/provinces/:id', authCheck, adminCheck, updateProvince);
router.delete('/provinces/:id', authCheck, adminCheck,deleteProvince);

module.exports = router;
