const express = require('express');
const settingsController = require('../controller/settings-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// All settings routes require authentication
router.use(auth);

// GET /api/settings/export - Export user data
router.get('/export', settingsController.exportData);

// POST /api/settings/import - Import user data
router.post('/import', settingsController.importData);

module.exports = router;