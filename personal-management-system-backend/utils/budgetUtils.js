const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const budgetUtils = {
  // Recalculate spent amount for all budgets of a user
  async recalculateAllBudgetSpent(userId) {
    try {
      // Get all active budgets for the user
      const budgets = await Budget.find({
        user: userId,
        isDeleted: false
      });

      // Get all active expenses for the user
      const expenses = await Expense.find({
        user: userId,
        isDeleted: false
      });

      // Group expenses by category
      const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {});

      // Update spent amount for each budget
      const updatePromises = budgets.map(async (budget) => {
        const spent = expensesByCategory[budget.category] || 0;
        await Budget.findByIdAndUpdate(budget._id, { spent });
      });

      await Promise.all(updatePromises);

      console.log(`Recalculated spent amounts for ${budgets.length} budgets`);
    } catch (error) {
      console.error('Error recalculating budget spent amounts:', error);
      throw error;
    }
  },

  // Recalculate spent amount for a specific budget
  async recalculateBudgetSpent(userId, budgetId) {
    try {
      const budget = await Budget.findOne({
        _id: budgetId,
        user: userId,
        isDeleted: false
      });

      if (!budget) {
        throw new Error('Budget not found');
      }

      // Get total expenses for this budget's category
      const totalSpent = await Expense.aggregate([
        {
          $match: {
            user: userId,
            category: budget.category,
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

      await Budget.findByIdAndUpdate(budgetId, { spent });

      console.log(`Updated spent amount for budget ${budgetId}: $${spent}`);
      return spent;
    } catch (error) {
      console.error('Error recalculating budget spent amount:', error);
      throw error;
    }
  }
};

module.exports = budgetUtils;