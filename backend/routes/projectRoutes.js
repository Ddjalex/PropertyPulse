const express = require('express');
const router = express.Router();
const { ProjectModel } = require('../models/projectModel');

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    
    // Transform _id to id for frontend compatibility
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      id: project._id.toString()
    }));
    
    res.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Get single project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Transform _id to id for frontend compatibility
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString()
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

// Create new project (admin only)
router.post('/projects', async (req, res) => {
  try {
    const project = new ProjectModel(req.body);
    await project.save();
    
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString()
    };
    
    res.status(201).json(transformedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Update project (admin only)
router.put('/projects/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    const transformedProject = {
      ...project.toObject(),
      id: project._id.toString()
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete project (admin only)
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;