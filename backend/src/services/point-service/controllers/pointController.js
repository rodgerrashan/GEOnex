const {getDb} = require('../db.js');
const Point = require('../models/Point');
const {ObjectId} = require('mongodb');


// Create new point
const createPoint = async (req, res) => {
    try {
        const {Point_Id, Project_Id, Name, Type, Latitude, Longitude, Survey_Id, Accuracy, Timestamp } = req.body;
        
        // Check if the Point_Id already exists
        const existingPoint = await Point.findOne({ Point_Id });
        if (existingPoint) {
            return res.status(400).json({ message: "Point_Id already exists" });
        }
        
        const newPoint = new Point({
            Point_Id,
            Project_Id,
            Name,
            Type,
            Latitude,
            Longitude,
            Survey_Id,
            Accuracy,
            Timestamp,
        });

        const savedPoint = await newPoint.save();
        res.status(201).json(savedPoint);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all points by project id
const getPointsByProjectId = async (req, res) => {
    const db = getDb();
    const projectId = Number(req.params.projectId); 
    try {
        const points = await db.collection('points').find({Project_Id: projectId}).toArray();

        console.log(points);
        res.json(points);

    } catch (error) {
        res.status(500).json({message: 'Error fetching points', error});
    }
};

// Delete point by ID and project ID
const deletePoint = async (req, res) => {
    const db = getDb();
    const projectId = Number(req.params.projectId); 
    const id = Number(req.params.id);
    try {
        const result = await db.collection('points').deleteOne({Project_Id: projectId, Point_Id: id});
        if (!result.deletedCount) {
            return res.status(404).json({message: 'Point not found'});
        }
        res.json({message: 'Point deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting point', error});
    }

};

// Modify point by ID and project ID
const modifyPoint = async (req, res) => {
    const db = getDb();
    const projectId = Number(req.params.projectId); 
    const id = Number(req.params.id);
    const {Point_Id, Project_Id, Name, Type, Latitude, Longitude, Survey_Id, Accuracy, Timestamp} = req.body;
    try {
        const result = await db.collection('points').updateOne({Project_Id: projectId, Point_Id: id}, {$set: {Point_Id, Project_Id, Name, Type, Latitude, Longitude, Survey_Id, Accuracy, Timestamp}});
        if (!result.matchedCount) {
            return res.status(404).json({message: 'Point not found'});
        }
        res.json({message: 'Point modified successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error modifying point', error});
    }
};

// Delete all point of a project
const deleteAllPoints = async (req, res) => {
    const db = getDb();
    const projectId = Number(req.params.projectId); 
    try {
        const result = await db.collection('points').deleteMany({Project_Id: projectId});
        res.json({message: 'All points deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting points', error});
    }
};

module.exports = { createPoint, getPointsByProjectId, deletePoint, modifyPoint, deleteAllPoints };
  