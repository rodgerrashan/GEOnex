const express = require('express');
const userAuth = require('../middleware/userAuth.js');
const { getUserData } = require('../controllers/userController.js');
const { addDeviceToUser, getUserDevices } = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.post('/:userId/add-device',addDeviceToUser);
userRouter.get('/:userId/devices', getUserDevices);

module.exports = userRouter;