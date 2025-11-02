import Card from '../components/Card';
import { mockExpenses, mockBudgets, mockSavingsGoals, mockIncome, savingsTrendData } from '../data/mockData';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const totalExpenses = mockExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const totalIncome = mockIncome.reduce((acc, income) => acc + income.amount, 0);
  const totalBudget = mockBudgets.reduce((acc, budget) => acc + budget.amount, 0);
  const totalSavings = mockSavingsGoals.reduce((acc, goal) => acc + goal.currentContribution, 0);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const categoryData = mockExpenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#38b2ac', '#4a5568', '#a0aec0', '#4299e1', '#9f7aea', '#ed8936'];

  // Financial health indicators
  const getFinancialHealth = () => {
    if (savingsRate >= 20 && expenseRatio <= 70 && netIncome > 0) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (savingsRate >= 15 && expenseRatio <= 80 && netIncome > 0) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (savingsRate >= 10 && expenseRatio <= 90) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const financialHealth = getFinancialHealth();

  return (
    <div className="min-h-screen">
      {/* Creative Header */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-white/20">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl rotate-12 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-xl -rotate-12 animate-bounce delay-300"></div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-br from-pink-400/30 to-blue-500/30 rounded-lg rotate-45 animate-spin"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-pulse">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Dashboard
                </h1>
                <p className="text-gray-600 text-lg font-medium">Welcome back, Rashmika! 👋</p>
              </div>
            </div>

            {/* Financial Health Badge */}
            <div className={`px-6 py-3 rounded-full ${financialHealth.bg} ${financialHealth.color} font-semibold text-sm border-2 border-current/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${financialHealth.color.replace('text-', 'bg-')} animate-pulse`}></div>
                <span className="font-bold">{financialHealth.status}</span>
              </div>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="mt-6 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ArrowTrendingUpIcon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm font-medium">Monthly</p>
                <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-red-400 via-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ArrowTrendingDownIcon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-rose-100 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(expenseRatio, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${netIncome >= 0 ? 'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600' : 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600'}`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BanknotesIcon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className={`${netIncome >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Net Flow</p>
                <p className="text-2xl font-bold">${Math.abs(netIncome).toFixed(2)}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Net Income</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${netIncome >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {netIncome >= 0 ? 'Surplus' : 'Deficit'}
              </span>
              <div className={`w-2 h-2 rounded-full ${netIncome >= 0 ? 'bg-green-300' : 'bg-red-300'}`}></div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <p className="text-amber-100 text-sm font-medium">Current</p>
                <p className="text-2xl font-bold">{savingsRate.toFixed(1)}%</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Savings Rate</h3>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${savingsRate >= 20 ? 'bg-green-300' : savingsRate >= 15 ? 'bg-yellow-300' : 'bg-red-300'}`} style={{ width: `${Math.min(savingsRate * 5, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Budget Usage" value={`${budgetUsage.toFixed(1)}%`} className="bg-gradient-to-br from-slate-50 to-gray-100 border-l-4 border-slate-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4 shadow-inner overflow-hidden">
                <div className={`h-4 rounded-full transition-all duration-1000 shadow-sm ${budgetUsage > 90 ? 'bg-gradient-to-r from-red-400 to-red-600' : budgetUsage > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`} style={{ width: `${budgetUsage}%` }}>
                  <div className="h-full w-full bg-white/20 animate-pulse"></div>
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {budgetUsage > 90 ? '⚠️ Over budget!' : budgetUsage > 60 ? '⚡ Getting close' : '✅ On track'}
            </p>
        </Card>

        <Card title="Total Savings" value={`$${totalSavings.toFixed(2)}`} className="bg-gradient-to-br from-cyan-50 to-blue-100 border-l-4 border-cyan-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mt-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">$</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">💰</span>
                </div>
              </div>
            </div>
        </Card>

        <Card title="Expense Ratio" value={`${expenseRatio.toFixed(1)}%`} className="bg-gradient-to-br from-violet-50 to-purple-100 border-l-4 border-violet-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Healthy</span>
                <span className="text-gray-600">Risky</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all duration-1000 ${expenseRatio <= 50 ? 'bg-green-500' : expenseRatio <= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(expenseRatio * 2, 100)}%` }}></div>
              </div>
              <p className="text-xs text-center text-gray-500">
                Target: &lt; 70%
              </p>
            </div>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="group bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
              </div>
              Spending Breakdown
            </h2>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {categoryData.length} categories
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                className="drop-shadow-sm"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="group bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
              </div>
              Savings Journey
            </h2>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              9 months
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={savingsTrendData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#savingsGradient)"
                className="drop-shadow-sm"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;