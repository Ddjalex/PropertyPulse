const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamMemberSchema = new Schema({
  userId: { type: String, ref: 'User' },
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: String,
  phone: String,
  whatsapp: String,
  email: String,
  profileImage: String,
  specializations: [String],
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TeamMemberModel = mongoose.model('TeamMember', TeamMemberSchema);

module.exports = { TeamMemberModel };