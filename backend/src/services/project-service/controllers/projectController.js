const {getDb} = require('../db.js');
const Project = require('../models/Project');
const {ObjectId} = require('mongodb');



// Create new project
const createProject = async (req, res) => {
    try {
        const { Name, Description } = req.body;
        
        const newProject = new Project({
            // User_Id,
            Name,
            Description,
            // Devices,
            Created_On: new Date(),      
            Last_Modified: new Date() 
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    const db = getDb();
    try {
        const projects = await db.collection('projects').find().toArray();
        res.json({success:true,projects});
    } catch (error) {
        res.status(500).json({success:false , message: 'Error fetching projects', error});
    }
};

const getProjectById = async (req, res) => {
    const db = getDb();
    const id = Number(req.params.id);  

    try {
        const project = await db.collection('projects').findOne({ Project_Id: id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

const updateProject = async (req, res) => {
    const db = getDb();
    const id = Number(req.params.id); 
    const { Name, Description } = req.body;

    try {
        const result = await db.collection('projects').updateOne(
            { Project_Id: id }, 
            { $set: { Name, Description, Last_Modified: new Date() } } 
        );

        if (result.matchedCount === 0) { 
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: 'Error updating project', error });
    }
};

const deleteProject = async (req, res) => {
    const id = Number(req.params.id);  
    const db = getDb();

    try {
        const result = await db.collection('projects').deleteOne({ Project_Id: id });

        if (result.deletedCount === 0) {  
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: 'Error deleting project', error });
    }
};



module.exports = {createProject, getProjects, getProjectById, updateProject, deleteProject};