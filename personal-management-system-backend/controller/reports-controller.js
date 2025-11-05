const { connectOracle, oracledb } = require('../database/oracle');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Income = require('../models/Income');
const SavingsGoal = require('../models/SavingsGoal');

const reportsController = {
  // Get expenses aggregated by category from Oracle or fallback to local
  getExpensesByCategory: async (req, res) => {
    try {
      const connection = await connectOracle();

      // Query to get expenses by category from Oracle
      const result = await connection.execute(`
        SELECT
          CATEGORY,
          SUM(AMOUNT) as TOTAL_AMOUNT
        FROM EXPENSES
        WHERE USER_ID = :userId
          AND IS_DELETED = 0
        GROUP BY CATEGORY
        ORDER BY TOTAL_AMOUNT DESC
      `, {
        userId: req.user.id
      });

      await connection.close();

      // Transform data to match frontend expectations
      const categoryData = result.rows.map(row => ({
        name: row.CATEGORY,
        value: parseFloat(row.TOTAL_AMOUNT)
      }));

      res.json(categoryData);
    } catch (oracleErr) {
      console.log('Oracle not available for expenses, falling back to local data:', oracleErr.message);

      try {
        // Fallback to local MongoDB data
        const expenses = await Expense.find({
          user: req.user.id,
          isDeleted: false
        });

        const categoryMap = {};
        expenses.forEach(expense => {
          if (!categoryMap[expense.category]) {
            categoryMap[expense.category] = 0;
          }
          categoryMap[expense.category] += expense.amount;
        });

        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value: parseFloat(value.toString())
        }));

        res.json(categoryData);
      } catch (localErr) {
        console.error('Local data fallback also failed:', localErr);
        res.status(500).json({ message: 'Server error' });
      }
    }
  },

  // Get budget adherence data from Oracle or fallback to local
  getBudgetAdherence: async (req, res) => {
    try {
      const connection = await connectOracle();

      // Query to get budget vs actual spending from Oracle
      const result = await connection.execute(`
        SELECT
          b.CATEGORY,
          b.AMOUNT as BUDGETED,
          COALESCE(e.TOTAL_SPENT, 0) as SPENT
        FROM BUDGETS b
        LEFT JOIN (
          SELECT
            CATEGORY,
            SUM(AMOUNT) as TOTAL_SPENT
          FROM EXPENSES
          WHERE USER_ID = :userId
            AND IS_DELETED = 0
            AND EXTRACT(MONTH FROM EXPENSE_DATE) = EXTRACT(MONTH FROM SYSDATE)
            AND EXTRACT(YEAR FROM EXPENSE_DATE) = EXTRACT(YEAR FROM SYSDATE)
          GROUP BY CATEGORY
        ) e ON b.CATEGORY = e.CATEGORY
        WHERE b.USER_ID = :userId
          AND b.IS_DELETED = 0
      `, {
        userId: req.user.id
      });

      await connection.close();

      // Transform data to match frontend expectations
      const budgetData = result.rows.map(row => ({
        name: row.CATEGORY,
        Budgeted: parseFloat(row.BUDGETED),
        Spent: parseFloat(row.SPENT)
      }));

      res.json(budgetData);
    } catch (oracleErr) {
      console.log('Oracle not available for budget adherence, falling back to local data:', oracleErr.message);

      try {
        // Fallback to local MongoDB data
        const budgets = await Budget.find({
          user: req.user.id,
          isDeleted: false
        });

        const expenses = await Expense.find({
          user: req.user.id,
          isDeleted: false
        });

        // Group expenses by category
        const expenseMap = {};
        expenses.forEach(expense => {
          if (!expenseMap[expense.category]) {
            expenseMap[expense.category] = 0;
          }
          expenseMap[expense.category] += expense.amount;
        });

        const budgetData = budgets.map(budget => ({
          name: budget.category,
          Budgeted: budget.amount,
          Spent: expenseMap[budget.category] || 0
        }));

        res.json(budgetData);
      } catch (localErr) {
        console.error('Local data fallback also failed:', localErr);
        res.status(500).json({ message: 'Server error' });
      }
    }
  },

  // Get savings trends over time from Oracle or fallback to local
  getSavingsTrends: async (req, res) => {
    try {
      const connection = await connectOracle();

      // Query to get monthly savings trends from Oracle
      const result = await connection.execute(`
        SELECT
          TO_CHAR(EXPENSE_DATE, 'YYYY-MM') as MONTH_KEY,
          TO_CHAR(EXPENSE_DATE, 'Mon') as MONTH_NAME,
          COALESCE(i.TOTAL_INCOME, 0) - COALESCE(e.TOTAL_EXPENSES, 0) as SAVINGS
        FROM (
          SELECT DISTINCT TO_CHAR(EXPENSE_DATE, 'YYYY-MM') as MONTH_KEY
          FROM EXPENSES
          WHERE USER_ID = :userId AND IS_DELETED = 0
          UNION
          SELECT DISTINCT TO_CHAR(INCOME_DATE, 'YYYY-MM') as MONTH_KEY
          FROM INCOME
          WHERE USER_ID = :userId AND IS_DELETED = 0
        ) dates
        LEFT JOIN (
          SELECT
            TO_CHAR(EXPENSE_DATE, 'YYYY-MM') as MONTH_KEY,
            SUM(AMOUNT) as TOTAL_EXPENSES
          FROM EXPENSES
          WHERE USER_ID = :userId AND IS_DELETED = 0
          GROUP BY TO_CHAR(EXPENSE_DATE, 'YYYY-MM')
        ) e ON dates.MONTH_KEY = e.MONTH_KEY
        LEFT JOIN (
          SELECT
            TO_CHAR(INCOME_DATE, 'YYYY-MM') as MONTH_KEY,
            SUM(AMOUNT) as TOTAL_INCOME
          FROM INCOME
          WHERE USER_ID = :userId AND IS_DELETED = 0
          GROUP BY TO_CHAR(INCOME_DATE, 'YYYY-MM')
        ) i ON dates.MONTH_KEY = i.MONTH_KEY
        ORDER BY dates.MONTH_KEY
      `, {
        userId: req.user.id
      });

      await connection.close();

      // Transform data to match frontend expectations
      const savingsData = result.rows.map(row => ({
        name: row.MONTH_NAME,
        savings: parseFloat(row.SAVINGS)
      }));

      res.json(savingsData);
    } catch (oracleErr) {
      console.log('Oracle not available for savings trends, falling back to local data:', oracleErr.message);

      try {
        // Fallback to local MongoDB data
        const incomes = await Income.find({
          user: req.user.id,
          isDeleted: false
        });

        const expenses = await Expense.find({
          user: req.user.id,
          isDeleted: false
        });

        // Group by month
        const monthlyData = {};

        incomes.forEach(income => {
          const date = new Date(income.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
          }
          monthlyData[monthKey].income += income.amount;
        });

        expenses.forEach(expense => {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
          }
          monthlyData[monthKey].expenses += expense.amount;
        });

        const savingsData = Object.entries(monthlyData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([monthKey, data]) => {
            const [, month] = monthKey.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
              name: monthNames[parseInt(month) - 1],
              savings: data.income - data.expenses
            };
          });

        res.json(savingsData);
      } catch (localErr) {
        console.error('Local data fallback also failed:', localErr);
        res.status(500).json({ message: 'Server error' });
      }
    }
  },

  // Get savings goals progress from Oracle or fallback to local
  getSavingsGoalsProgress: async (req, res) => {
    try {
      const connection = await connectOracle();

      // Query to get savings goals progress from Oracle
      const result = await connection.execute(`
        SELECT
          NAME,
          TARGET_AMOUNT,
          CURRENT_CONTRIBUTION,
          DEADLINE
        FROM SAVINGS_GOALS
        WHERE USER_ID = :userId
          AND IS_DELETED = 0
        ORDER BY CREATED_AT DESC
      `, {
        userId: req.user.id
      });

      await connection.close();

      // Transform data to match frontend expectations
      const goalsData = result.rows.map(row => ({
        name: row.NAME,
        Target: parseFloat(row.TARGET_AMOUNT),
        Current: parseFloat(row.CURRENT_CONTRIBUTION),
        Progress: Math.round((parseFloat(row.CURRENT_CONTRIBUTION) / parseFloat(row.TARGET_AMOUNT)) * 100),
        ProgressLabel: `${((parseFloat(row.CURRENT_CONTRIBUTION) / parseFloat(row.TARGET_AMOUNT)) * 100).toFixed(1)}%`
      }));

      res.json(goalsData);
    } catch (oracleErr) {
      console.log('Oracle not available for savings goals, falling back to local data:', oracleErr.message);

      try {
        // Fallback to local MongoDB data
        const savingsGoals = await SavingsGoal.find({
          user: req.user.id,
          isDeleted: false
        });

        const goalsData = savingsGoals.map(goal => ({
          name: goal.name,
          Target: goal.targetAmount,
          Current: goal.currentContribution,
          Progress: Math.round((goal.currentContribution / goal.targetAmount) * 100),
          ProgressLabel: `${((goal.currentContribution / goal.targetAmount) * 100).toFixed(1)}%`
        }));

        res.json(goalsData);
      } catch (localErr) {
        console.error('Local data fallback also failed:', localErr);
        res.status(500).json({ message: 'Server error' });
      }
    }
  },

  // Get forecasted savings trends using PL/SQL
  getForecastedSavingsTrends: async (req, res) => {
    try {
      const connection = await connectOracle();

      const bindVars = {
        userId: req.user.id,
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      };

      const result = await connection.execute(`
        DECLARE
          avg_savings NUMBER := 0;
          current_month DATE := TRUNC(SYSDATE, 'MM');
        BEGIN
          -- Calculate average positive savings from last 6 months
          SELECT NVL(AVG(monthly_savings), 0) INTO avg_savings
          FROM (
            SELECT dates.month_key,
                   COALESCE(i.total_income, 0) - COALESCE(e.total_expenses, 0) as monthly_savings
            FROM (
              SELECT DISTINCT TO_CHAR(EXPENSE_DATE, 'YYYY-MM') as month_key
              FROM EXPENSES
              WHERE USER_ID = :userId AND IS_DELETED = 0
              UNION
              SELECT DISTINCT TO_CHAR(INCOME_DATE, 'YYYY-MM') as month_key
              FROM INCOME
              WHERE USER_ID = :userId AND IS_DELETED = 0
            ) dates
            LEFT JOIN (
              SELECT TO_CHAR(EXPENSE_DATE, 'YYYY-MM') as month_key,
                     SUM(AMOUNT) as total_expenses
              FROM EXPENSES
              WHERE USER_ID = :userId AND IS_DELETED = 0
              GROUP BY TO_CHAR(EXPENSE_DATE, 'YYYY-MM')
            ) e ON dates.month_key = e.month_key
            LEFT JOIN (
              SELECT TO_CHAR(INCOME_DATE, 'YYYY-MM') as month_key,
                     SUM(AMOUNT) as total_income
              FROM INCOME
              WHERE USER_ID = :userId AND IS_DELETED = 0
              GROUP BY TO_CHAR(INCOME_DATE, 'YYYY-MM')
            ) i ON dates.month_key = i.month_key
            WHERE dates.month_key >= TO_CHAR(ADD_MONTHS(current_month, -6), 'YYYY-MM')
              AND dates.month_key < TO_CHAR(current_month, 'YYYY-MM')
            GROUP BY dates.month_key, COALESCE(i.total_income, 0), COALESCE(e.total_expenses, 0)
            HAVING (COALESCE(i.total_income, 0) - COALESCE(e.total_expenses, 0)) > 0
            ORDER BY dates.month_key DESC
          );

          OPEN :cursor FOR
          SELECT TO_CHAR(ADD_MONTHS(current_month, LEVEL), 'Mon') as month_name,
                 avg_savings as forecasted_savings,
                 CASE 
                   WHEN avg_savings > 100 THEN 'Strong Positive'
                   WHEN avg_savings > 0 THEN 'Positive'
                   WHEN avg_savings = 0 THEN 'Neutral'
                   ELSE 'Negative'
                 END as trend_category
          FROM DUAL
          CONNECT BY LEVEL <= 6
          ORDER BY LEVEL;
        END;
      `, bindVars);

      const cursor = result.outBinds.cursor;
      const rows = await cursor.getRows();
      await cursor.close();
      await connection.close();

      // Transform data
      const forecastData = rows.map(row => ({
        name: row.MONTH_NAME,
        savings: parseFloat(row.FORECASTED_SAVINGS),
        trend: row.TREND_CATEGORY
      }));

      res.json(forecastData);
    } catch (oracleErr) {
      console.log('Oracle not available for forecasted savings, falling back to local calculation:', oracleErr.message);

      try {
        // Fallback: simple average from local data
        const incomes = await Income.find({
          user: req.user.id,
          isDeleted: false
        });

        const expenses = await Expense.find({
          user: req.user.id,
          isDeleted: false
        });

        // Calculate monthly savings for last 6 months
        const monthlySavings = {};
        incomes.forEach(income => {
          const date = new Date(income.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlySavings[monthKey]) monthlySavings[monthKey] = { income: 0, expenses: 0 };
          monthlySavings[monthKey].income += income.amount;
        });
        expenses.forEach(expense => {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlySavings[monthKey]) monthlySavings[monthKey] = { income: 0, expenses: 0 };
          monthlySavings[monthKey].expenses += expense.amount;
        });

        const savingsList = Object.values(monthlySavings).map(data => data.income - data.expenses).filter(s => s > 0);
        const avgSavings = savingsList.length > 0 ? savingsList.reduce((a, b) => a + b, 0) / savingsList.length : 0;

        // Generate forecast for next 6 months
        const forecastData = [];
        const now = new Date();
        for (let i = 1; i <= 6; i++) {
          const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
          const monthName = futureDate.toLocaleString('default', { month: 'short' });
          const trend = avgSavings > 100 ? 'Strong Positive' : avgSavings > 0 ? 'Positive' : avgSavings === 0 ? 'Neutral' : 'Negative';
          forecastData.push({
            name: monthName,
            savings: avgSavings,
            trend: trend
          });
        }

        res.json(forecastData);
      } catch (localErr) {
        console.error('Local fallback failed:', localErr);
        res.status(500).json({ message: 'Server error' });
      }
    }
  }
};

module.exports = reportsController;
