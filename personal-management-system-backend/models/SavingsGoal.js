const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentContribution: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  deadline: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  synced: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);