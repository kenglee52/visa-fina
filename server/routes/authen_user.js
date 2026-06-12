const express = require('express');
const router = express.Router();
const { register, login, currentUser } = require('../controllers/authen_user');
const { authCheck, verifierCheck } = require('../middlewares/authCheck');

router.post('/register', register);
router.post('/login', login);
router.post('/current-user', authCheck, currentUser);
router.post('/current-verifier', authCheck, verifierCheck, currentUser);

module.exports = router;