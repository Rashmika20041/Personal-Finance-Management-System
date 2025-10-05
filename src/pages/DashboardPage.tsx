import Card from '../components/Card';
import { mockExpenses, mockBudgets, mockSavingsGoals, savingsTrendData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardPage = () => {
  const totalExpenses = mockExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const totalBudget = mockBudgets.reduce((acc, budget) => acc + budget.amount, 0);
  const totalSavings = mockSavingsGoals.reduce((acc, goal) => acc + goal.currentContribution, 0);
  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Welcome back, Rashmika!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Expenses (This Month)" value={`$${totalExpenses.toFixed(2)}`} />
        <Card title="Budget Usage" value={`${budgetUsage.toFixed(1)}%`}>
            <div className="w-full bg-accent rounded-full h-2.5 mt-3">
                <div className="bg-highlight h-2.5 rounded-full" style={{ width: `${budgetUsage}%` }}></div>
            </div>
        </Card>
        <Card title="Total Savings" value={`$${totalSavings.toFixed(2)}`} />
        <Card title="Upcoming Bill" value="$150.00 (Electricity)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-text-primary mb-4">Category-wise Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-text-primary mb-4">Savings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={savingsTrendData}>
              <XAxis dataKey="name" stroke="#a0aec0" />
              <YAxis stroke="#a0aec0" />
              <Tooltip wrapperClassName="!bg-primary !border-accent" cursor={{fill: '#4a5568'}} />
              <Legend />
              <Bar dataKey="savings" fill="#38b2ac" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;