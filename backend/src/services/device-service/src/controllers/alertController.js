const Alert = require('../models/Alert.js');

const createAlert = async (req, res) => {
    
    try {
        const { deviceId,status,code,created_At } = req.body;
        const newAlert = new Alert({
            deviceId,
            status,
            code,
            created_At
        });

        const addedAlert = await newAlert.save();
        res.status(201).json(addedAlert);
        console.log("$ Created Alert");
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {createAlert};