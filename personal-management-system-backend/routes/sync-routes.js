const syncService = require('../utils/syncService');
const auth = require('../middleware/auth-middleware');
const express = require('express');
const router = express.Router();

// @route   POST api/sync/incomes
// @desc    Manually trigger income sync for the logged-in user
// @access  Private
router.post('/incomes', auth, async (req, res) => {
  try {
    const result = await syncService.syncAllUserIncomes(req.user.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('Manual sync error:', err);
    res.status(500).json({ message: 'Server error during sync' });
  }
});

// @route   POST api/sync/expenses
// @desc    Manually trigger expense sync for the logged-in user
// @access  Private
router.post('/expenses', auth, async (req, res) => {
  try {
    const result = await syncService.syncAllUserExpenses(req.user.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('Manual sync error:', err);
    res.status(500).json({ message: 'Server error during sync' });
  }
});

// @route   POST api/sync/savings-goals
// @desc    Manually trigger savings goals sync for the logged-in user
// @access  Private
router.post('/savings-goals', auth, async (req, res) => {
  try {
    const result = await syncService.syncAllUserSavingsGoals(req.user.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('Manual sync error:', err);
    res.status(500).json({ message: 'Server error during sync' });
  }
});

// @route   POST api/sync/budgets
// @desc    Manually trigger budget sync for the logged-in user
// @access  Private
router.post('/budgets', auth, async (req, res) => {
  try {
    const result = await syncService.syncAllUserBudgets(req.user.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    console.error('Manual sync error:', err);
    res.status(500).json({ message: 'Server error during sync' });
  }
});

// @route   GET api/sync/status
// @desc    Get the sync status for the logged-in user
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const status = await syncService.getSyncStatus(req.user.id);
    res.json(status);
  } catch (err) {
    console.error('Get sync status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
