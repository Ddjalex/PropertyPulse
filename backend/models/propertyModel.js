const mongoose = require('mongoose');
const { Schema } = mongoose;

// Property enums
const PropertyStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RENTED: 'rented',
  PENDING: 'pending'
};

const PropertyType = {
  APARTMENT: 'apartment',
  VILLA: 'villa',
  OFFICE: 'office',
  COMMERCIAL: 'commercial',
  LAND: 'land'
};

const ListingType = {
  SALE: 'sale',
  RENT: 'rent'
};

const PropertySchema = new Schema({
  title: { type: String, required: true },
  description: String,
  propertyType: { type: String, enum: Object.values(PropertyType), required: true },
  listingType: { type: String, enum: Object.values(ListingType), required: true },
  status: { type: String, enum: Object.values(PropertyStatus), default: PropertyStatus.AVAILABLE },
  price: { type: Number, required: true },
  pricePerSqm: Number,
  currency: { type: String, default: 'ETB' },
  location: { type: String, required: true },
  address: String,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  features: [String],
  images: [String],
  featured: { type: Boolean, default: false },
  virtualTourUrl: String,
  mapCoordinates: String,
  agentId: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PropertyModel = mongoose.model('Property', PropertySchema);

module.exports = {
  PropertyModel,
  PropertyStatus,
  PropertyType,
  ListingType
};