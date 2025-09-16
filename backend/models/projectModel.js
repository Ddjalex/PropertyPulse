const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  status: { type: String, default: 'planning' },
  progress: { type: Number, default: 0 },
  totalUnits: Number,
  availableUnits: Number,
  startDate: Date,
  expectedCompletion: Date,
  images: [String],
  features: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;