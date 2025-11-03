const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Groceries', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  duration: {
    type: String,
    required: true,
    enum: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    default: 'Monthly'
  },
  threshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
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

module.exports = mongoose.model('Budget', budgetSchema);