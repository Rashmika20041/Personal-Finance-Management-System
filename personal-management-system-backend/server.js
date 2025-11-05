const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const { connectOracle } = require('./database/oracle');
const authRoutes = require('./routes/auth-routes');
const incomeRoutes = require('./routes/income-routes');
const expenseRoutes = require('./routes/expense-routes');
const savingsGoalsRoutes = require('./routes/savings-goals-routes');
const budgetRoutes = require('./routes/budget-routes');
const syncRoutes = require('./routes/sync-routes');
const settingsRoutes = require('./routes/settings-routes');
const reportsRoutes = require('./routes/reports-routes');

dotenv.config();

// Connect to databases
connectDB();

// Test Oracle connection on startup
const testOracleConnection = async () => {
  try {
    const connection = await connectOracle();
    await connection.close();
  } catch (error) {
    console.log('Oracle connection failed on startup, will connect when needed');
  }
};
testOracleConnection();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/savings-goals', savingsGoalsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
