const express = require('express');
const router = express.Router();
const { PropertyModel } = require('../models/propertyModel');
const { TeamMemberModel } = require('../models/teamMemberModel');
const { LeadModel } = require('../models/leadModel');

// Admin Property Management
router.post('/properties', async (req, res) => {
  try {
    const property = new PropertyModel(req.body);
    await property.save();
    
    const transformedProperty = {
      ...property.toObject(),
      id: property._id.toString()
    };
    
    res.status(201).json(transformedProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
});

router.put('/properties/:id', async (req, res) => {
  try {
    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    const transformedProperty = {
      ...property.toObject(),
      id: property._id.toString()
    };
    
    res.json(transformedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await PropertyModel.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
});

// Admin Lead Management
router.get('/leads', async (req, res) => {
  try {
    const leads = await LeadModel.find({}).sort({ createdAt: -1 });
    const transformedLeads = leads.map(lead => ({
      ...lead.toObject(),
      id: lead._id.toString()
    }));
    res.json(transformedLeads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

router.patch('/leads/:id', async (req, res) => {
  try {
    const lead = await LeadModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    const transformedLead = {
      ...lead.toObject(),
      id: lead._id.toString()
    };
    
    res.json(transformedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Failed to update lead" });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    const lead = await LeadModel.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Failed to delete lead" });
  }
});

// Admin Team Management
router.patch('/team/:id', async (req, res) => {
  try {
    const member = await TeamMemberModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    
    const transformedMember = {
      ...member.toObject(),
      id: member._id.toString()
    };
    
    res.json(transformedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Failed to update team member" });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const member = await TeamMemberModel.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
});

module.exports = router;