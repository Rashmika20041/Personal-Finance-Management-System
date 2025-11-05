const { connectOracle, oracledb } = require('../database/oracle');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const SavingsGoal = require('../models/SavingsGoal');
const Budget = require('../models/Budget');

const syncService = {
  // Sync all unsynced incomes for a user
  syncAllUserIncomes: async (userId) => {
    let connection;
    try {
      connection = await connectOracle();
      const unsyncedIncomes = await Income.find({ user: userId, synced: false });

      if (unsyncedIncomes.length === 0) {
        return { success: true, message: 'All incomes are already synced.', syncedCount: 0 };
      }

      let syncedCount = 0;
      for (const income of unsyncedIncomes) {
        if (income.isDeleted) {
          // Handle deletion in Oracle DB
          await connection.execute(
            `DELETE FROM incomes WHERE mongo_id = :mongo_id`,
            { mongo_id: income._id.toString() },
            { autoCommit: true }
          );
        } else {
          // Handle upsert (insert or update) in Oracle DB
          await connection.execute(
            `MERGE INTO incomes d
             USING (SELECT :mongo_id AS mongo_id FROM dual) s
             ON (d.mongo_id = s.mongo_id)
             WHEN MATCHED THEN
               UPDATE SET amount = :amount, source = :source, income_date = :income_date, description = :description
             WHEN NOT MATCHED THEN
               INSERT (mongo_id, user_id, amount, source, income_date, description)
               VALUES (:mongo_id, :user_id, :amount, :source, :income_date, :description)`,
            {
              mongo_id: income._id.toString(),
              user_id: userId,
              amount: income.amount,
              source: income.source,
              income_date: income.date,
              description: income.description,
            },
            { autoCommit: true }
          );
        }

        // Mark as synced in MongoDB
        income.synced = true;
        await income.save();
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} income records.`, syncedCount };

    } catch (err) {
      console.error('Oracle sync error:', err);
      return { success: false, message: 'An error occurred during sync.', error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing Oracle connection:', err);
        }
      }
    }
  },

  // Get sync status for a user
  getSyncStatus: async (userId) => {
    try {
      const totalIncomes = await Income.countDocuments({ user: userId, isDeleted: false });
      const unsyncedIncomes = await Income.countDocuments({ user: userId, synced: false, isDeleted: false });
      const syncedIncomes = totalIncomes - unsyncedIncomes;

      const totalExpenses = await Expense.countDocuments({ user: userId, isDeleted: false });
      const unsyncedExpenses = await Expense.countDocuments({ user: userId, synced: false, isDeleted: false });
      const syncedExpenses = totalExpenses - unsyncedExpenses;

      const totalSavingsGoals = await SavingsGoal.countDocuments({ user: userId, isDeleted: false });
      const unsyncedSavingsGoals = await SavingsGoal.countDocuments({ user: userId, synced: false, isDeleted: false });
      const syncedSavingsGoals = totalSavingsGoals - unsyncedSavingsGoals;

      const totalBudgets = await Budget.countDocuments({ user: userId, isDeleted: false });
      const unsyncedBudgets = await Budget.countDocuments({ user: userId, synced: false, isDeleted: false });
      const syncedBudgets = totalBudgets - unsyncedBudgets;

      const totalRecords = totalIncomes + totalExpenses + totalSavingsGoals + totalBudgets;
      const syncedRecords = syncedIncomes + syncedExpenses + syncedSavingsGoals + syncedBudgets;
      const syncPercentage = totalRecords > 0 ? (syncedRecords / totalRecords) * 100 : 100;

      return {
        totalIncomes,
        syncedIncomes,
        unsyncedIncomes,
        totalExpenses,
        syncedExpenses,
        unsyncedExpenses,
        totalSavingsGoals,
        syncedSavingsGoals,
        unsyncedSavingsGoals,
        totalBudgets,
        syncedBudgets,
        unsyncedBudgets,
        totalRecords,
        syncedRecords,
        syncPercentage: syncPercentage.toFixed(2),
      };
    } catch (err) {
      console.error('Get sync status error:', err);
      return { success: false, message: 'Error fetching sync status.' };
    }
  },

  // Sync all unsynced expenses for a user
  syncAllUserExpenses: async (userId) => {
    let connection;
    try {
      connection = await connectOracle();
      const unsyncedExpenses = await Expense.find({ user: userId, synced: false });

      if (unsyncedExpenses.length === 0) {
        return { success: true, message: 'All expenses are already synced.', syncedCount: 0 };
      }

      let syncedCount = 0;
      for (const expense of unsyncedExpenses) {
        if (expense.isDeleted) {
          // Handle deletion in Oracle DB
          await connection.execute(
            `DELETE FROM expenses WHERE mongo_id = :mongo_id`,
            { mongo_id: expense._id.toString() },
            { autoCommit: true }
          );
        } else {
          // Handle upsert (insert or update) in Oracle DB
          await connection.execute(
            `MERGE INTO expenses d
             USING (SELECT :mongo_id AS mongo_id FROM dual) s
             ON (d.mongo_id = s.mongo_id)
             WHEN MATCHED THEN
               UPDATE SET amount = :amount, category = :category, expense_date = :expense_date, payment_method = :payment_method, notes = :notes
             WHEN NOT MATCHED THEN
               INSERT (mongo_id, user_id, amount, category, expense_date, payment_method, notes)
               VALUES (:mongo_id, :user_id, :amount, :category, :expense_date, :payment_method, :notes)`,
            {
              mongo_id: expense._id.toString(),
              user_id: userId,
              amount: expense.amount,
              category: expense.category,
              expense_date: expense.date,
              payment_method: expense.paymentMethod,
              notes: expense.notes,
            },
            { autoCommit: true }
          );
        }

        // Mark as synced in MongoDB
        expense.synced = true;
        await expense.save();
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} expense records.`, syncedCount };

    } catch (err) {
      console.error('Oracle sync error:', err);
      return { success: false, message: 'An error occurred during sync.', error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing Oracle connection:', err);
        }
      }
    }
  },

  // Sync all unsynced savings goals for a user
  syncAllUserSavingsGoals: async (userId) => {
    let connection;
    try {
      connection = await connectOracle();
      const unsyncedGoals = await SavingsGoal.find({ user: userId, synced: false });

      if (unsyncedGoals.length === 0) {
        return { success: true, message: 'All savings goals are already synced.', syncedCount: 0 };
      }

      let syncedCount = 0;
      for (const goal of unsyncedGoals) {
        if (goal.isDeleted) {
          // Handle deletion in Oracle DB
          await connection.execute(
            `DELETE FROM savings_goals WHERE mongo_id = :mongo_id`,
            { mongo_id: goal._id.toString() },
            { autoCommit: true }
          );
        } else {
          // Handle upsert (insert or update) in Oracle DB
          await connection.execute(
            `MERGE INTO savings_goals d
             USING (SELECT :mongo_id AS mongo_id FROM dual) s
             ON (d.mongo_id = s.mongo_id)
             WHEN MATCHED THEN
               UPDATE SET name = :name, target_amount = :target_amount, current_contribution = :current_contribution, deadline = :deadline, priority = :priority
             WHEN NOT MATCHED THEN
               INSERT (mongo_id, user_id, name, target_amount, current_contribution, deadline, priority)
               VALUES (:mongo_id, :user_id, :name, :target_amount, :current_contribution, :deadline, :priority)`,
            {
              mongo_id: goal._id.toString(),
              user_id: userId,
              name: goal.name,
              target_amount: goal.targetAmount,
              current_contribution: goal.currentContribution,
              deadline: goal.deadline,
              priority: goal.priority,
            },
            { autoCommit: true }
          );
        }

        // Mark as synced in MongoDB
        goal.synced = true;
        await goal.save();
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} savings goal records.`, syncedCount };

    } catch (err) {
      console.error('Oracle sync error:', err);
      return { success: false, message: 'An error occurred during sync.', error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing Oracle connection:', err);
        }
      }
    }
  },

  // Sync all unsynced budgets for a user
  syncAllUserBudgets: async (userId) => {
    let connection;
    try {
      connection = await connectOracle();
      const unsyncedBudgets = await Budget.find({ user: userId, synced: false });

      if (unsyncedBudgets.length === 0) {
        return { success: true, message: 'All budgets are already synced.', syncedCount: 0 };
      }

      let syncedCount = 0;
      for (const budget of unsyncedBudgets) {
        if (budget.isDeleted) {
          // Handle deletion in Oracle DB
          await connection.execute(
            `DELETE FROM budgets WHERE mongo_id = :mongo_id`,
            { mongo_id: budget._id.toString() },
            { autoCommit: true }
          );
        } else {
          // Handle upsert (insert or update) in Oracle DB
          await connection.execute(
            `MERGE INTO budgets d
             USING (SELECT :mongo_id AS mongo_id FROM dual) s
             ON (d.mongo_id = s.mongo_id)
             WHEN MATCHED THEN
               UPDATE SET name = :name, category = :category, amount = :amount, spent = :spent, duration = :duration, threshold = :threshold
             WHEN NOT MATCHED THEN
               INSERT (mongo_id, user_id, name, category, amount, spent, duration, threshold)
               VALUES (:mongo_id, :user_id, :name, :category, :amount, :spent, :duration, :threshold)`,
            {
              mongo_id: budget._id.toString(),
              user_id: userId,
              name: budget.name,
              category: budget.category,
              amount: budget.amount,
              spent: budget.spent,
              duration: budget.duration,
              threshold: budget.threshold,
            },
            { autoCommit: true }
          );
        }

        // Mark as synced in MongoDB
        budget.synced = true;
        await budget.save();
        syncedCount++;
      }

      return { success: true, message: `Successfully synced ${syncedCount} budget records.`, syncedCount };

    } catch (err) {
      console.error('Oracle sync error:', err);
      return { success: false, message: 'An error occurred during sync.', error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing Oracle connection:', err);
        }
      }
    }
  },

  syncAllUserData: async (userId) => {
    try {
      // Execute all sync operations
      const [incomesResult, expensesResult, savingsGoalsResult, budgetsResult] = await Promise.all([
        syncService.syncAllUserIncomes(userId),
        syncService.syncAllUserExpenses(userId),
        syncService.syncAllUserSavingsGoals(userId),
        syncService.syncAllUserBudgets(userId)
      ]);
  
      // Check if all operations were successful
      const allSucceeded = incomesResult.success && expensesResult.success && savingsGoalsResult.success && budgetsResult.success;
  
      if (allSucceeded) {
        return { success: true, message: 'All data synced successfully.' };
      } else {
        // Construct a detailed error message
        let errorMessage = 'Synchronization failed for some items: ';
        if (!incomesResult.success) errorMessage += `Incomes (${incomesResult.message}). `;
        if (!expensesResult.success) errorMessage += `Expenses (${expensesResult.message}). `;
        if (!savingsGoalsResult.success) errorMessage += `Savings Goals (${savingsGoalsResult.message}). `;
        if (!budgetsResult.success) errorMessage += `Budgets (${budgetsResult.message}). `;
        
        console.error('Synchronization failed for some items:', errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('A critical error occurred during the sync process:', error);
      return { success: false, message: `A critical error occurred: ${error.message}` };
    }
  },
};

module.exports = syncService;
