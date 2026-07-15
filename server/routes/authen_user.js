const express = require('express');
const router = express.Router();

const { register, login, currentUser, logout, heartbeat, verifyReceiverPassword  } = require('../controllers/authen_user');
const { authCheck, verifierCheck } = require('../middlewares/authCheck');
const {loginLimiter} = require('../middlewares/rateLimiter')

router.post('/register', register);
router.post('/login',loginLimiter, login);
router.post('/current-user', authCheck, currentUser);
router.post('/current-verifier', authCheck, verifierCheck, currentUser);
router.post('/logout', authCheck, logout);
router.post('/heartbeat', authCheck, heartbeat);
router.post('/verify-receiver-password', verifyReceiverPassword);

module.exports = router;