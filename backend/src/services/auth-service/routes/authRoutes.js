const express = require('express');
const dotenv = require('dotenv');

const {register, login, logout} = require('../controllers/authController');
const{sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword }=require('../controllers/authController');
const userAuth = require('../middleware/userAuth');

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userAuth, logout);

authRouter.get('/sendverifyotp',userAuth,sendVerifyOtp);
authRouter.post('/verify-email',userAuth,verifyEmail);

authRouter.get('/is-auth',userAuth,isAuthenticated);

authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

module.exports = authRouter;