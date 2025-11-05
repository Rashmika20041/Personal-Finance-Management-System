const Budget = require('../models/Budget');
const budgetUtils = require('../utils/budgetUtils');

const budgetController = {
  // Get all budgets for the authenticated user
  getAllBudgets: async (req, res) => {
    try {
      const budgets = await Budget.find({
        user: req.user.id,
        isDeleted: false
      }).sort({ createdAt: -1 });

      res.json(budgets);
    } catch (err) {
      console.error('Get budgets error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add new budget
  addBudget: async (req, res) => {
    try {
      const { name, category, amount, duration, threshold } = req.body;

      // Validate required fields
      if (!name || !category || !amount || !duration) {
        return res.status(400).json({ message: 'Name, category, amount, and duration are required' });
      }

      // Calculate initial spent amount for this category
      const Expense = require('../models/Expense');
      const totalSpent = await Expense.aggregate([
        {
          $match: {
            user: req.user.id,
            category: category,
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;

      const newBudget = new Budget({
        user: req.user.id,
        name,
        category,
        amount,
        spent,
        duration,
        threshold: threshold || 80
      });

      const savedBudget = await newBudget.save();
      res.status(201).json(savedBudget);
    } catch (err) {
      console.error('Add budget error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update budget
  updateBudget: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, amount, duration, threshold } = req.body;

      // Validate required fields
      if (!name || !category || !amount || !duration) {
        return res.status(400).json({ message: 'Name, category, amount, and duration are required' });
      }

      // Calculate spent amount for the new category
      const Expense = require('../models/Expense');
      const totalSpent = await Expense.aggregate([
        {
          $match: {
            user: req.user.id,
            category: category,
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;

      const budget = await Budget.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        {
          name,
          category,
          amount,
          duration,
          threshold: threshold || 80,
          spent,
          synced: false
        },
        { new: true }
      );

      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      res.json(budget);
    } catch (err) {
      console.error('Update budget error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete budget (soft delete)
  deleteBudget: async (req, res) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        { isDeleted: true, synced: false },
        { new: true }
      );

      if (!budget) {
        return res.status(404).json({ message: 'Budget not found' });
      }

      res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
      console.error('Delete budget error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = budgetController;