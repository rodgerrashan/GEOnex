const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDb = async () => {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(process.env.MONGO_DB);
    console.log('Connected to MongoDB');
};

const getDb = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};

module.exports = { connectDb, getDb };
