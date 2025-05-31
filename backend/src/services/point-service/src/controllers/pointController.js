const {getDb} = require('../config/db.js');
const Point = require('../models/Point');
const Project = require('../models/Project.js');
const {ObjectId} = require('mongodb');


// Create new point
const createPoint = async (req, res) => {
    try {
        const {ProjectId, Name, Type, Latitude, Longitude, Accuracy, Timestamp, Device} = req.body;
        
        // Validate required fields (adjust based on your business logic)
        if (!Name || Latitude == null || Longitude == null || !Timestamp || !ProjectId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const newPoint = new Point({ 
            ProjectId,
            Name,
            Type: Type || "recorded",
            Latitude,
            Longitude,
            Accuracy: Accuracy || null,
            Timestamp: Timestamp || null,
            Device: Device || null,
        });

        // Save the new point to the database
        const savedPoint = await newPoint.save();

        // Update the project with the new point
        await Project.findByIdAndUpdate(
            ProjectId,
            {
                $push: { Points: savedPoint._id },
                $inc: { Total_Points: 1 }
            }
        );

        // Return the saved point in the response
        return res.status(201).json(savedPoint);

    } catch (error) {
        console.error("Error creating point:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all points by project id
const getPointsByProjectId = async (req, res) => {

    const db = getDb();

    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: "Missing project id" });
        }

        if (!ObjectId.isValid(projectId)) {
            return res.status(400).json({ error: "Invalid Project ID" });
        }

        const points = await db.collection('points').find({ ProjectId: new ObjectId(projectId) }).toArray();

        return res.status(200).json({success: true,points});

    } catch (error) {
        console.error("Error retrieving points:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }
};

// Delete point by ID and project ID
const deletePoint = async (req, res) => {
    const db = getDb();
    
    try {
        const { projectId, id } = req.params;

        // Validate that both IDs are provided
        if (!projectId || !id) {
            return res.status(400).json({ error: "Missing project id or point id" });
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid project id or point id" });
        }

        const result = await db.collection('points').deleteOne({
            ProjectId: new ObjectId(projectId), 
            _id: new ObjectId(id)
        });

        

        if (!result.deletedCount) {
            return res.status(404).json({ error: 'Point not found'});
        }

        // Update the project with the new point
        await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: { Points: id },
                $inc: { Total_Points: -1 }
            }
        );

        return res.status(200).json({ message: "Point deleted successfully" });
    } catch (error) {
        console.error("Error deleting point:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
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
  