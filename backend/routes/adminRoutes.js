const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { PropertyModel } = require('../models/propertyModel');
const { TeamMemberModel } = require('../models/teamMemberModel');
const { LeadModel } = require('../models/leadModel');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Admin Property Management
router.post('/properties', upload.array('images', 10), async (req, res) => {
  try {
    // Build images array from uploaded files and URLs
    const images = [];
    
    // Add uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }
    
    // Add URL-based images
    if (req.body.imagesUrls) {
      const urlImages = Array.isArray(req.body.imagesUrls) 
        ? req.body.imagesUrls 
        : [req.body.imagesUrls];
      urlImages.forEach(url => {
        if (url && url.trim()) {
          images.push(url.trim());
        }
      });
    }
    
    // Parse numeric fields
    const propertyData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : 0,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      area: req.body.area ? Number(req.body.area) : undefined,
      images: images,
      featured: req.body.featured === 'true' || req.body.featured === true
    };
    
    const property = new PropertyModel(propertyData);
    await property.save();
    
    const transformedProperty = {
      ...property.toObject(),
      id: property._id.toString()
    };
    
    res.status(201).json(transformedProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Failed to create property", error: error.message });
  }
});

router.put('/properties/:id', upload.array('images', 10), async (req, res) => {
  try {
    const existingProperty = await PropertyModel.findById(req.params.id);
    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    // Build images array
    const images = [];
    
    // Keep existing images if specified
    if (req.body.imagesToKeep) {
      const keepImages = Array.isArray(req.body.imagesToKeep) 
        ? req.body.imagesToKeep 
        : [req.body.imagesToKeep];
      keepImages.forEach(img => {
        if (img && img.trim()) {
          images.push(img.trim());
        }
      });
    }
    
    // Add new uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push(`/uploads/${file.filename}`);
      });
    }
    
    // Add new URL-based images
    if (req.body.imagesUrls) {
      const urlImages = Array.isArray(req.body.imagesUrls) 
        ? req.body.imagesUrls 
        : [req.body.imagesUrls];
      urlImages.forEach(url => {
        if (url && url.trim()) {
          images.push(url.trim());
        }
      });
    }
    
    // Parse numeric fields
    const updateData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : existingProperty.price,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : existingProperty.bedrooms,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : existingProperty.bathrooms,
      area: req.body.area ? Number(req.body.area) : existingProperty.area,
      images: images.length > 0 ? images : existingProperty.images,
      featured: req.body.featured === 'true' || req.body.featured === true,
      updatedAt: new Date()
    };
    
    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    const transformedProperty = {
      ...property.toObject(),
      id: property._id.toString()
    };
    
    res.json(transformedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Failed to update property", error: error.message });
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