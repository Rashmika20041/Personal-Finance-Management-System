const SavingsGoal = require('../models/SavingsGoal');

const savingsGoalController = {
  // Get all savings goals for the authenticated user
  getAllSavingsGoals: async (req, res) => {
    try {
      const goals = await SavingsGoal.find({
        user: req.user.id,
        isDeleted: false
      }).sort({ createdAt: -1 });

      res.json(goals);
    } catch (err) {
      console.error('Get savings goals error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add new savings goal
  addSavingsGoal: async (req, res) => {
    try {
      const { name, targetAmount, currentContribution, deadline, priority } = req.body;

      // Validate required fields
      if (!name || !targetAmount || !deadline) {
        return res.status(400).json({ message: 'Name, target amount, and deadline are required' });
      }

      const newGoal = new SavingsGoal({
        user: req.user.id,
        name,
        targetAmount,
        currentContribution: currentContribution || 0,
        deadline,
        priority: priority || 'Medium'
      });

      const savedGoal = await newGoal.save();
      res.status(201).json(savedGoal);
    } catch (err) {
      console.error('Add savings goal error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update savings goal
  updateSavingsGoal: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, targetAmount, currentContribution, deadline, priority } = req.body;

      // Validate required fields
      if (!name || !targetAmount || !deadline) {
        return res.status(400).json({ message: 'Name, target amount, and deadline are required' });
      }

      const goal = await SavingsGoal.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        {
          name,
          targetAmount,
          currentContribution: currentContribution || 0,
          deadline,
          priority: priority || 'Medium',
          synced: false
        },
        { new: true }
      );

      if (!goal) {
        return res.status(404).json({ message: 'Savings goal not found' });
      }

      res.json(goal);
    } catch (err) {
      console.error('Update savings goal error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete savings goal (soft delete)
  deleteSavingsGoal: async (req, res) => {
    try {
      const { id } = req.params;

      const goal = await SavingsGoal.findOneAndUpdate(
        { _id: id, user: req.user.id, isDeleted: false },
        { isDeleted: true, synced: false },
        { new: true }
      );

      if (!goal) {
        return res.status(404).json({ message: 'Savings goal not found' });
      }

      res.json({ message: 'Savings goal deleted successfully' });
    } catch (err) {
      console.error('Delete savings goal error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = savingsGoalController;