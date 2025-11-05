const syncService = require('../utils/syncService');
const auth = require('../middleware/auth-middleware');
const express = require('express');
const router = express.Router();

// @route   POST api/sync/all
// @desc    Manually trigger sync for all user data
// @access  Private
router.post('/all', auth, async (req, res) => {
  try {
    const result = await syncService.syncAllUserData(req.user.id);
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
