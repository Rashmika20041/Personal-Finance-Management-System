const express = require('express');
const savingsGoalController = require('../controller/savings-goal-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// All savings goal routes require authentication
router.use(auth);

// GET /api/savings-goals - Get all savings goals for the user
router.get('/', savingsGoalController.getAllSavingsGoals);

// POST /api/savings-goals - Add new savings goal
router.post('/', savingsGoalController.addSavingsGoal);

// PUT /api/savings-goals/:id - Update savings goal
router.put('/:id', savingsGoalController.updateSavingsGoal);

// DELETE /api/savings-goals/:id - Delete savings goal
router.delete('/:id', savingsGoalController.deleteSavingsGoal);

module.exports = router;