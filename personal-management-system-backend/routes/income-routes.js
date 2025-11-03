const express = require('express');
const incomeController = require('../controller/income-controller');
const auth = require('../middleware/auth-middleware');
const router = express.Router();

// @route   GET api/income
// @desc    Get all user incomes
// @access  Private
router.get('/', auth, incomeController.getAllIncomes);

// @route   POST api/income
// @desc    Add new income
// @access  Private
router.post('/', auth, incomeController.addIncome);

// @route   PUT api/income/:id
// @desc    Update an income
// @access  Private
router.put('/:id', auth, incomeController.updateIncome);

// @route   DELETE api/income/:id
// @desc    Delete an income
// @access  Private
router.delete('/:id', auth, incomeController.deleteIncome);

module.exports = router;
