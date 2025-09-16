const express = require('express');
const router = express.Router();
const { TeamMemberModel } = require('../models/teamMemberModel');

// Get all team members
router.get('/team', async (req, res) => {
  try {
    const teamMembers = await TeamMemberModel.find({ active: true })
      .sort({ displayOrder: 1, createdAt: -1 });
    
    // Transform _id to id for frontend compatibility
    const transformedTeamMembers = teamMembers.map(member => ({
      ...member.toObject(),
      id: member._id.toString()
    }));
    
    res.json(transformedTeamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
});

// Get single team member by ID
router.get('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMemberModel.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    
    // Transform _id to id for frontend compatibility
    const transformedTeamMember = {
      ...teamMember.toObject(),
      id: teamMember._id.toString()
    };
    
    res.json(transformedTeamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    res.status(500).json({ message: "Failed to fetch team member" });
  }
});

// Create new team member (admin only)
router.post('/team', async (req, res) => {
  try {
    const teamMember = new TeamMemberModel(req.body);
    await teamMember.save();
    
    const transformedTeamMember = {
      ...teamMember.toObject(),
      id: teamMember._id.toString()
    };
    
    res.status(201).json(transformedTeamMember);
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ message: "Failed to create team member" });
  }
});

// Update team member (admin only)
router.put('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMemberModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    
    const transformedTeamMember = {
      ...teamMember.toObject(),
      id: teamMember._id.toString()
    };
    
    res.json(transformedTeamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Failed to update team member" });
  }
});

// Delete team member (admin only)
router.delete('/team/:id', async (req, res) => {
  try {
    const teamMember = await TeamMemberModel.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
});

module.exports = router;