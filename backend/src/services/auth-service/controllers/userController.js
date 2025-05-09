const User = require('../models/User');

const getUserData = async (req, res) => {

    try {
        const userId=req.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.json({success:false, message:'User not found'})
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });


    } catch (error) {
        res.json({success:false, message:error.message}) 
    }
};


const Device = require('../../device-service/models/Device'); 

const addDeviceToUser = async (req, res) => {
    const userId = req.params.userId;
    const { DeviceCode } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const device = await Device.findOne({ DeviceCode: DeviceCode });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }


        // Add device to user's connectedDevices
        user.connectedDevices.push(device._id);
        await user.save();

        res.status(200).json({ message: 'Device added to user successfully', connectedDevices: user.connectedDevices });
    } catch (error) {
        console.error('Error assigning device to user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {getUserData,addDeviceToUser}