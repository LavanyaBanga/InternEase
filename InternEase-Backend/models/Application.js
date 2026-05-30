// models/Application.js
const mongoose = require('mongoose');

/**
 * Application Schema
 * Tracks applications made by students for opportunities.
 * Stores snapshot of opportunity details at time of application.
 */
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  opportunity: {
    type: mongoose.Schema.ObjectId,
    ref: 'Opportunity',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'accepted', 'rejected', 'in_review', 'interview'],
    default: 'applied',
  },
  // Snapshot of opportunity details at time of application
 opportunitySnapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Additional application-specific data
  coverLetter: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
});

// Ensure a user can apply to an opportunity only once
applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
