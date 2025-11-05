const express = require('express');
const reportsController = require('../controller/reports-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// All reports routes require authentication
router.use(auth);

// GET /api/reports/expenses-by-category - Get expenses aggregated by category from Oracle
router.get('/expenses-by-category', reportsController.getExpensesByCategory);

// GET /api/reports/budget-adherence - Get budget adherence data from Oracle
router.get('/budget-adherence', reportsController.getBudgetAdherence);

// GET /api/reports/savings-trends - Get savings trends over time from Oracle
router.get('/savings-trends', reportsController.getSavingsTrends);

// GET /api/reports/savings-goals-progress - Get savings goals progress from Oracle
router.get('/savings-goals-progress', reportsController.getSavingsGoalsProgress);

// GET /api/reports/forecasted-savings-trends - Get forecasted savings trends from Oracle
router.get('/forecasted-savings-trends', reportsController.getForecastedSavingsTrends);

module.exports = router;