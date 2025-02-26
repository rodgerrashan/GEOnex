const {getDb} = require('../db.js');
const Project = require('../models/Project');
const {ObjectId} = require('mongodb');



// Create new project
const createProject = async (req, res) => {
    try {
        const {Project_Id, User_Id, Name, Status, Survey_Time, Description, Total_Points, Devices } = req.body;
        
        // Check if the Project_Id already exists
        const existingProject = await Project.findOne({ Project_Id });
        if (existingProject) {
            return res.status(400).json({ message: "Project_Id already exists" });
        }
        
        const newProject = new Project({
            Project_Id,
            User_Id,
            Name,
            Status,
            Survey_Time,
            Description,
            Total_Points,
            Devices,
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
        res.json(projects);
    } catch (error) {
        res.status(500).json({message: 'Error fetching projects', error});
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    const db = getDb();
    const {id} = req.params;
    try {
        const project = await db.collection('projects').findOne({_id: ObjectId(id)});
        if (!project) {
            return res.status(404).json({message: 'Project not found'});
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({message: 'Error fetching project', error});
    }
};

// Update project by ID
const updateProject = async (req, res) => {
    const db = getDb();
    const { id } = req.params;
    const { Name, Description } = req.body;
    try {
        const result = await Project.findByIdAndUpdate(id, { Name, Description, Last_Modified: Date.now() }, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project updated', project: result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
};


// Delete project by ID
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const db = getDb();
    try {
        const result = await Project.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
};


module.exports = {createProject, getProjects, getProjectById, updateProject, deleteProject};