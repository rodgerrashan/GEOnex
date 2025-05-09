const {getDb} = require('../db.js');
const Device = require('../models/Device');
const {ObjectId} = require('mongodb');


const createDevice = async (req, res) => {
    try {
        const { DeviceCode, Name, Type, Registered_User_Id } = req.body;

        // Check if a device with the same name and user ID already exists
        const existingDevice = await Device.findOne({ Name, Registered_User_Id });
        if (existingDevice) {
            return res.status(400).json({ message: "A device with this name is already registered for this user." });
        }

        // If not exists, create a new device
        const newDevice = new Device({
            DeviceCode,
            Name,
            Type,
            Last_Update: Date.now(),
            Registered_User_Id,
            Registered_Date: Date.now(),
        });

        const registeredDevice = await newDevice.save();
        res.status(201).json(registeredDevice);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getDeviceById = async (req, res) => {
    const db = getDb();
    const id = req.params.id; 

    try {
        const device = await db.collection('devices').findOne({ _id: new ObjectId(id) });

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({success:true, device});
    } catch (error) {
        console.error("Error fetching device:", error);
        res.status(500).json({success:false , message: 'Error fetching device', error: error.message });
    }
};

const updateDevice = async (req, res) => {
    const db = getDb();
    const id = req.params.id; 
    const {
        Status,
        Battery_Percentage,
        Signal_Strength,
        Last_Update,
        Active_Project,
        Name,
        Description
    } = req.body;

    try {
        const result = await db.collection('devices').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...(Name && { Name }),
                    ...(Status && { Status }),
                    ...(Battery_Percentage !== undefined && { Battery_Percentage }),
                    ...(Signal_Strength && { Signal_Strength }),
                    ...(Last_Update && { Last_Update }),
                    ...(Active_Project && { Active_Project }),
                    Last_Modified: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Device not found' });
        }

        res.json({ message: 'Device updated successfully' });
    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: 'Error updating device', error });
    }
};




module.exports = {createDevice, getDeviceById, updateDevice};