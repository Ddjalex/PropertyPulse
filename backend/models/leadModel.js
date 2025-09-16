const mongoose = require('mongoose');
const { Schema } = mongoose;

const LeadSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  propertyInterest: String,
  message: String,
  source: { type: String, default: 'website' },
  status: { type: String, default: 'new' },
  propertyId: { type: String, ref: 'Property' },
  assignedTo: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LeadModel = mongoose.model('Lead', LeadSchema);

module.exports = { LeadModel };