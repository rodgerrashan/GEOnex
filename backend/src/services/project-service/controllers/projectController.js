const {getDb} = require('../../../db');
const Project = require('../models/projectModel');
const {ObjectId} = require('mongodb');

// Create new project
const createProject = async (req, res) => {
    const db = getDb();
    const {name, description, createdBy} = req.body;
    const project = new Project(name, description, createdBy);
    try {
        const result = await db.collection('projects').insertOne(project);
        res.status(201).json({message: 'Project created', project: result.ops[0]});
    } catch (error) {
        res.status(500).json({message: 'Error creating project', error});
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
    const {id} = req.params;
    const {name, description} = req.body;
    try {
        const result = await db.collection('projects').updateOne({_id: ObjectId(id)}, {$set: {name, description}});
        if (result.modifiedCount === 0) {
            return res.status(404).json({message: 'Project not found'});
        }
        res.json({message: 'Project updated'});
    } catch (error) {
        res.status(500).json({message: 'Error updating project', error});
    }
};

// Delete project by ID
const deleteProject = async (req, res) => {
    const db = getDb();
    const {id} = req.params;
    try {
        const result = await db.collection('projects').deleteOne({_id: ObjectId(id)});
        if (result.deletedCount === 0) {
            return res.status(404).json({message: 'Project not found'});
        }
        res.json({message: 'Project deleted'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting project', error});
    }
};

module.exports = {createProject, getProjects, getProjectById, updateProject, deleteProject};