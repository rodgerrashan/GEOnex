const express = require('express');
const dotenv = require('dotenv');
const {createDevice, getDeviceById, updateDevice, checkDeviceInUse} = require('../controllers/deviceController');
const router = express.Router();

router.post('/', createDevice);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.get('/:deviceCode/check', checkDeviceInUse);


module.exports = router;
