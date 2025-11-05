const Income = require('../models/Income');

const incomeController = {
  // Get all incomes for a user
  getAllIncomes: async (req, res) => {
    try {
      const incomes = await Income.find({ user: req.user.id, isDeleted: false });
      res.json(incomes);
    } catch (err) {
      console.error('Get incomes error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add a new income
  addIncome: async (req, res) => {
    try {
      const { amount, source, date, description } = req.body;
      const newIncome = new Income({
        user: req.user.id,
        amount,
        source,
        date,
        description,
      });
      const income = await newIncome.save();
      res.status(201).json(income);
    } catch (err) {
      console.error('Add income error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update an income
  updateIncome: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, source, date, description } = req.body;

      let income = await Income.findById(id);
      if (!income) {
        return res.status(404).json({ message: 'Income not found' });
      }

      // Ensure user owns the income
      if (income.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      income.amount = amount;
      income.source = source;
      income.date = date;
      income.description = description;
      income.synced = false; // Mark as unsynced after update

      await income.save();
      res.json(income);
    } catch (err) {
      console.error('Update income error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete an income (soft delete)
  deleteIncome: async (req, res) => {
    try {
      const { id } = req.params;

      let income = await Income.findById(id);
      if (!income) {
        return res.status(404).json({ message: 'Income not found' });
      }

      // Ensure user owns the income
      if (income.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await Income.findByIdAndUpdate(id, { isDeleted: true, synced: false });
      res.json({ message: 'Income removed' });
    } catch (err) {
      console.error('Delete income error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = incomeController;
