const { MongoClient } = require('mongodb');

let db;

const connectDb = async () => {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('surveyDB');
    console.log('Connected to MongoDB');
};

const getDb = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};

module.exports = { connectDb, getDb };
