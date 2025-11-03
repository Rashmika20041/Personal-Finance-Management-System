const express = require('express');
const expenseController = require('../controller/expense-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// All expense routes require authentication
router.use(auth);

// GET /api/expense - Get all expenses for the user
router.get('/', expenseController.getAllExpenses);

// POST /api/expense - Add new expense
router.post('/', expenseController.addExpense);

// PUT /api/expense/:id - Update expense
router.put('/:id', expenseController.updateExpense);

// DELETE /api/expense/:id - Delete expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;