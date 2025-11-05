const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SavingsGoal = require('../models/SavingsGoal');
const Budget = require('../models/Budget');

const settingsController = {
  // Export user data
  exportData: async (req, res) => {
    try {
      const userId = req.user.id;

      const incomes = await Income.find({ user: userId, isDeleted: false });
      const expenses = await Expense.find({ user: userId, isDeleted: false });
      const savingsGoals = await SavingsGoal.find({ user: userId, isDeleted: false });
      const budgets = await Budget.find({ user: userId, isDeleted: false });

      const data = {
        incomes,
        expenses,
        savingsGoals,
        budgets,
        exportedAt: new Date().toISOString()
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="finance_backup_${new Date().toISOString().split('T')[0]}.json"`);
      res.json(data);
    } catch (err) {
      console.error('Export data error:', err);
      res.status(500).json({ message: 'Server error during export' });
    }
  },

  // Import user data
  importData: async (req, res) => {
    try {
      const userId = req.user.id;
      const { incomes, expenses, savingsGoals, budgets } = req.body;

      // Validate input
      if (!Array.isArray(incomes) || !Array.isArray(expenses) || !Array.isArray(savingsGoals) || !Array.isArray(budgets)) {
        return res.status(400).json({ message: 'Invalid data format. Expected arrays for incomes, expenses, savingsGoals, and budgets.' });
      }

      let importedCount = 0;

      // Import incomes
      for (const income of incomes) {
        if (income.amount && income.source && income.date) {
          const newIncome = new Income({
            user: userId,
            amount: income.amount,
            source: income.source,
            date: income.date,
            description: income.description || '',
            synced: false
          });
          await newIncome.save();
          importedCount++;
        }
      }

      // Import expenses
      for (const expense of expenses) {
        if (expense.amount && expense.category && expense.date && expense.paymentMethod) {
          const newExpense = new Expense({
            user: userId,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            paymentMethod: expense.paymentMethod,
            notes: expense.notes || '',
            synced: false
          });
          await newExpense.save();
          importedCount++;
        }
      }

      // Import savings goals
      for (const goal of savingsGoals) {
        if (goal.name && goal.targetAmount && goal.deadline) {
          const newGoal = new SavingsGoal({
            user: userId,
            name: goal.name,
            targetAmount: goal.targetAmount,
            currentContribution: goal.currentContribution || 0,
            deadline: goal.deadline,
            priority: goal.priority || 'Medium',
            synced: false
          });
          await newGoal.save();
          importedCount++;
        }
      }

      // Import budgets
      for (const budget of budgets) {
        if (budget.name && budget.category && budget.amount && budget.duration) {
          const newBudget = new Budget({
            user: userId,
            name: budget.name,
            category: budget.category,
            amount: budget.amount,
            spent: budget.spent || 0,
            duration: budget.duration,
            threshold: budget.threshold || 80,
            synced: false
          });
          await newBudget.save();
          importedCount++;
        }
      }

      res.json({ message: `Successfully imported ${importedCount} items.` });
    } catch (err) {
      console.error('Import data error:', err);
      res.status(500).json({ message: 'Server error during import' });
    }
  }
};

module.exports = settingsController;