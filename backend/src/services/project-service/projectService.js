const {getDb} = require('../db');
const {ObjectId} = require('mongodb');

// Fetch project details
const getProjectDetails = async (projectId) => {
    const db = getDb();
    return db.collection('projects').findOne({ _id: new ObjectId(projectId) });
};


module.exports = { getProjectDetails };