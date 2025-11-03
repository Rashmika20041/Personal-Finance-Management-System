const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Groceries', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Health', 'Shopping', 'Other']
  },
  date: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'],
    default: 'Credit Card'
  },
  notes: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Expense', expenseSchema);