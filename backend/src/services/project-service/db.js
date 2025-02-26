const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB using Mongoose');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const getDb = () => {
    if (!mongoose.connection.readyState) {
        throw new Error('Database not initialized');
    }
    return mongoose.connection;
};

module.exports = { connectDb,getDb };
