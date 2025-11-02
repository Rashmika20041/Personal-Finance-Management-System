import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import ReportsPage from './pages/ReportsPage';
import SynchronizationPage from './pages/SynchronizationPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import IncomePage from './pages/IncomePage';

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      } />

      {/* Main App Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/savings" element={<SavingsGoalsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/sync" element={<SynchronizationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;