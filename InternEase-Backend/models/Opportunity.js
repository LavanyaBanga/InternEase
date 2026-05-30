// models/Opportunity.js
const mongoose = require('mongoose');

/**
 * Opportunity Schema
 * Defines the structure for events, internships, and courses.
 */

 const opportunitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'internship', 'course'],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  company: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  duration: { type: String, default: '' },
  stipend: { type: String, default: 'Unpaid' },
  skills: [String],
  requirements: [String],
  lastDate: { type: Date },
  poster: { type: String, default: '' },
  url: { type: String, default: '' },
  tags: [String],
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
}, { timestamps: true });
const Opportunity = mongoose.model('Opportunity', opportunitySchema);
module.exports = Opportunity;