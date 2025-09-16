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
    
    // Text search functionality
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
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

// Admin routes moved to adminRoutes.js for proper security separation

module.exports = router;