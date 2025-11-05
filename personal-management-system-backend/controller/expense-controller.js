const Expense = require('../models/Expense');
const budgetUtils = require('../utils/budgetUtils');

const expenseController = {
  // Get all expenses for the authenticated user
  getAllExpenses: async (req, res) => {
    try {
      const expenses = await Expense.find({
        user: req.user.id,
        isDeleted: false
      }).sort({ date: -1, createdAt: -1 });

      res.json(expenses);
    } catch (err) {
      console.error('Get expenses error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add new expense
  addExpense: async (req, res) => {
    try {
      const { amount, category, date, paymentMethod, notes } = req.body;

      // Validate required fields
      if (!amount || !category || !date) {
        return res.status(400).json({ message: 'Amount, category, and date are required' });
      }

      const newExpense = new Expense({
        user: req.user.id,
        amount,
        category,
        date,
        paymentMethod: paymentMethod || 'Credit Card',
        notes: notes || ''
      });

      const savedExpense = await newExpense.save();

      // Recalculate budget spent amounts
      try {
        await budgetUtils.recalculateAllBudgetSpent(req.user.id);
      } catch (budgetError) {
        console.error('Error updating budget spent amounts:', budgetError);
        // Don't fail the expense creation if budget update fails
      }

      res.status(201).json(savedExpense);
    } catch (err) {
      console.error('Add expense error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update expense
  updateExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, category, date, paymentMethod, notes } = req.body;

      // Validate required fields
      if (!amount || !category || !date) {
        return res.status(400).json({ message: 'Amount, category, and date are required' });
      }

      const expense = await Expense.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        {
          amount,
          category,
          date,
          paymentMethod: paymentMethod || 'Credit Card',
          notes: notes || ''
        },
        { new: true }
      );

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      // Recalculate budget spent amounts
      try {
        await budgetUtils.recalculateAllBudgetSpent(req.user.id);
      } catch (budgetError) {
        console.error('Error updating budget spent amounts:', budgetError);
        // Don't fail the expense update if budget update fails
      }

      res.json(expense);
    } catch (err) {
      console.error('Update expense error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete expense (soft delete)
  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params;

      const expense = await Expense.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        { isDeleted: true, synced: false },
        { new: true }
      );

      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      // Recalculate budget spent amounts
      try {
        await budgetUtils.recalculateAllBudgetSpent(req.user.id);
      } catch (budgetError) {
        console.error('Error updating budget spent amounts:', budgetError);
        // Don't fail the expense deletion if budget update fails
      }

      res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
      console.error('Delete expense error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = expenseController;