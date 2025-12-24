const mongoose = require('mongoose');
const maintenanceSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  scheduledDate: Date,
  cost: Number,
  completedDate: Date,
  status: {
    type: String,
    enum: ['reported', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Maintenance', maintenanceSchema);
