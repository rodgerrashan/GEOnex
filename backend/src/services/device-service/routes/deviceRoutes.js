const express = require('express');
const dotenv = require('dotenv');
const {createDevice, getDeviceById, updateDevice} = require('../controllers/deviceController');
const router = express.Router();

router.post('/', createDevice);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);


module.exports = router;
