const express = require('express');
const dotenv = require('dotenv');
const {register} = require('../controllers/authController');
const {login} = require('../controllers/authController');
const {logout} = require('../controllers/authController');
const{verifyEmail}=require('../controllers/authController');
const{sendVerifyOtp}=require('../controllers/authController');
const{isAuthenticated}=require('../controllers/authController');
const{sendResetOtp}=require('../controllers/authController');
const{resetPassword}=require('../controllers/authController');
const userAuth = require('../middleware/userAuth');


const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verifyEmail',userAuth,verifyEmail);
authRouter.post('/sendverifyotp',userAuth,sendVerifyOtp);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

module.exports = authRouter;