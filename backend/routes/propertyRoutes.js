const express = require('express');
const router = express.Router();
const { PropertyModel } = require('../models/propertyModel');

// Get all properties with filtering
router.get('/properties', async (req, res) => {
  try {
    const filters = {};
    
    // Build filters from query parameters
    if (req.query.type) filters.propertyType = req.query.type;
    if (req.query.listingType) filters.listingType = req.query.listingType;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.location) filters.location = new RegExp(req.query.location, 'i');
    if (req.query.featured === 'true') filters.featured = true;
    
    // Price filtering
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }
    
    const properties = await PropertyModel.find(filters).sort({ createdAt: -1 });
    
    // Transform _id to id for frontend compatibility
    const transformedProperties = properties.map(property => ({
      ...property.toObject(),
      id: property._id.toString()
    }));
    
    res.json(transformedProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// Get single property by ID
router.get('/properties/:id', async (req, res) => {
  try {
    const property = await PropertyModel.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    // Transform _id to id for frontend compatibility
    const transformedProperty = {
      ...property.toObject(),
      id: property._id.toString()
    };
    
    res.json(transformedProperty);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Failed to fetch property" });
  }
});

// Create new property (admin only)
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

// Update property (admin only)
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

// Delete property (admin only)
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

module.exports = router;