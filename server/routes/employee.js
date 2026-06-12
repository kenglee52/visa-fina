const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middlewares/authCheck');
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee');

router.get('/employee', authCheck, getEmployees);
router.post('/employee', authCheck, adminCheck, createEmployee);
router.put('/employee/:id', authCheck, adminCheck, updateEmployee);
router.delete('/employee/:id', authCheck, adminCheck, deleteEmployee);

module.exports = router;