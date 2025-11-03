const express = require('express');
const budgetController = require('../controller/budget-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// All budget routes require authentication
router.use(auth);

// GET /api/budgets - Get all budgets for the user
router.get('/', budgetController.getAllBudgets);

// POST /api/budgets - Add new budget
router.post('/', budgetController.addBudget);

// PUT /api/budgets/:id - Update budget
router.put('/:id', budgetController.updateBudget);

// DELETE /api/budgets/:id - Delete budget
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;