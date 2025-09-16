const express = require('express');
const router = express.Router();
const { LeadModel } = require('../models/leadModel');

// Get all leads (admin only)
router.get('/leads', async (req, res) => {
  try {
    const leads = await LeadModel.find().sort({ createdAt: -1 });
    
    // Transform _id to id for frontend compatibility
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

// Create new lead (public endpoint)
router.post('/leads', async (req, res) => {
  try {
    const lead = new LeadModel(req.body);
    await lead.save();
    
    const transformedLead = {
      ...lead.toObject(),
      id: lead._id.toString()
    };
    
    res.status(201).json({ 
      message: "Lead created successfully",
      lead: transformedLead 
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Failed to create lead" });
  }
});

// Update lead status (admin only)
router.put('/leads/:id', async (req, res) => {
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

// Delete lead (admin only)
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

module.exports = router;