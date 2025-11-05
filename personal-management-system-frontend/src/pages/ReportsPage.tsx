import  { useState, useEffect } from 'react';
import type { Expense, Budget, SavingsGoal, Income } from '../data/mockData';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel } from 'docx';

const ReportsPage = () => {
    const [incomes] = useState<Income[]>([]);
    const [expenses] = useState<Expense[]>([]);
    const [budgets] = useState<Budget[]>([]);
    const [savingsGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chart data state
    const [categoryData, setCategoryData] = useState<any[]>([]);
    const [budgetAdherenceData, setBudgetAdherenceData] = useState<any[]>([]);
    const [forecastedSavingsData, setForecastedSavingsData] = useState<any[]>([]);
    const [savingsGoalsProgressData, setSavingsGoalsProgressData] = useState<any[]>([]);

    // Data source tracking
    const [dataSource, setDataSource] = useState<'oracle' | 'local' | 'none'>('none');

    // Fetch all data from Oracle central database APIs
    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // No authentication token - show empty charts
                setCategoryData([]);
                setBudgetAdherenceData([]);
                setForecastedSavingsData([]);
                setSavingsGoalsProgressData([]);
                setLoading(false);
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch all report data from Oracle central database in parallel
            const [categoryRes, budgetRes, savingsRes, goalsRes] = await Promise.all([
                fetch('http://localhost:5000/api/reports/expenses-by-category', { headers }),
                fetch('http://localhost:5000/api/reports/budget-adherence', { headers }),
                fetch('http://localhost:5000/api/reports/savings-trends', { headers }),
                fetch('http://localhost:5000/api/reports/savings-goals-progress', { headers })
            ]);

            console.log('Oracle API responses:', {
                category: categoryRes.status,
                budget: budgetRes.status,
                savings: savingsRes.status,
                goals: goalsRes.status
            });

            const [categoryData, budgetData, savingsData, goalsData] = await Promise.all([
                categoryRes.json(),
                budgetRes.json(),
                savingsRes.json(),
                goalsRes.json()
            ]);

            console.log('Oracle data received:', {
                category: categoryData,
                budget: budgetData,
                savings: savingsData,
                goals: goalsData
            });

            // Validate and filter Oracle data
            const validCategoryData = categoryData.filter((item: any) => item.name && item.value > 0);
            const validBudgetData = budgetData.filter((item: any) => item.name && (item.Budgeted > 0 || item.Spent > 0));
            const validSavingsData = savingsData.filter((item: any) => item.name && typeof item.savings === 'number');
            const validGoalsData = goalsData.filter((item: any) => item.name && item.Target > 0);

            // Check if Oracle has valid data
            const hasOracleData = validCategoryData.length > 0 || validBudgetData.length > 0 ||
                                  validSavingsData.length > 0 || validGoalsData.length > 0;

            if (hasOracleData) {
                // Use Oracle data
                setCategoryData(validCategoryData);
                setBudgetAdherenceData(validBudgetData);
                setForecastedSavingsData(validSavingsData);
                setSavingsGoalsProgressData(validGoalsData);
                setDataSource('oracle');
                console.log('Using Oracle central database data for charts');
            } else {
                // Oracle data is empty, fall back to local MongoDB data
                console.log('Oracle data empty, falling back to local data');
                await fetchLocalData();
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching Oracle report data:', err);
            setError('Failed to load report data from central database');
            // On error, try local data as fallback
            try {
                await fetchLocalData();
            } catch (localErr) {
                console.error('Local data fallback also failed:', localErr);
                setDataSource('none');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fallback to local MongoDB data if Oracle is empty
    const fetchLocalData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch local data
            const [incomesRes, expensesRes, budgetsRes, savingsRes] = await Promise.all([
                fetch('http://localhost:5000/api/income', { headers }),
                fetch('http://localhost:5000/api/expense', { headers }),
                fetch('http://localhost:5000/api/budgets', { headers }),
                fetch('http://localhost:5000/api/savings-goals', { headers })
            ]);

            const [incomesData, expensesData, budgetsData, savingsData] = await Promise.all([
                incomesRes.json(),
                expensesRes.json(),
                budgetsRes.json(),
                savingsRes.json()
            ]);

            // Compute category data from expenses
            const computedCategoryData = expensesData.reduce((acc: any[], expense: any) => {
                const existing = acc.find(item => item.name === expense.category);
                if (existing) {
                    existing.value += expense.amount;
                } else {
                    acc.push({ name: expense.category, value: expense.amount });
                }
                return acc;
            }, []);

            // Compute budget adherence
            const computedBudgetData = Object.values(
                budgetsData.reduce((acc: any, budget: any) => {
                    const category = budget.category || 'Other';
                    if (!acc[category]) {
                        acc[category] = { name: category, Budgeted: 0, Spent: 0 };
                    }
                    acc[category].Budgeted += budget.amount;
                    acc[category].Spent += budget.spent || 0;
                    return acc;
                }, {})
            );

            // Compute savings trends
            const monthlyData: { [key: string]: { income: number; expenses: number; savings: number } } = {};
            incomesData.forEach((income: any) => {
                const date = new Date(income.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData[monthKey]) monthlyData[monthKey] = { income: 0, expenses: 0, savings: 0 };
                monthlyData[monthKey].income += income.amount;
            });
            expensesData.forEach((expense: any) => {
                const date = new Date(expense.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData[monthKey]) monthlyData[monthKey] = { income: 0, expenses: 0, savings: 0 };
                monthlyData[monthKey].expenses += expense.amount;
            });
            Object.keys(monthlyData).forEach(monthKey => {
                monthlyData[monthKey].savings = monthlyData[monthKey].income - monthlyData[monthKey].expenses;
            });
            const computedSavingsData = Object.entries(monthlyData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([monthKey, data]) => {
                    const [, month] = monthKey.split('-');
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return { name: monthNames[parseInt(month) - 1], savings: data.savings };
                });

            // Compute savings goals progress
            const computedGoalsData = savingsData.map((goal: any) => {
                const progress = (goal.currentContribution / goal.targetAmount) * 100;
                return {
                    name: goal.name,
                    Progress: Math.round(progress),
                    ProgressLabel: `${progress.toFixed(1)}%`,
                    Current: goal.currentContribution,
                    Target: goal.targetAmount
                };
            });

            // Set computed data
            setCategoryData(computedCategoryData);
            setBudgetAdherenceData(computedBudgetData as any[]);
            setForecastedSavingsData(computedSavingsData);
            setSavingsGoalsProgressData(computedGoalsData);
            setDataSource('local');

        } catch (err) {
            console.error('Error fetching local data:', err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const COLORS = ['#38b2ac', '#4a5568', '#a0aec0', '#4299e1', '#9f7aea', '#ed8936'];

    // Use the data from state (already includes fallback to local data)
    const incomeData = incomes;
    const expenseData = expenses;
    const budgetData = budgets;
    const savingsGoalsData = savingsGoals;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-primary p-4 border border-accent rounded-lg shadow-lg">
                    <p className="label text-text-primary font-bold">{`${label}`}</p>
                    {payload.map((pld: any, index: number) => (
                        <p key={index} style={{ color: pld.color }}>
                            {`${pld.name}: $${pld.value.toFixed(2)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const generateAndDownloadReport = async () => {
        try {
            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: [
                            new Paragraph({
                                text: "Financial Report",
                                heading: HeadingLevel.TITLE,
                            }),
                            new Paragraph({
                                text: `Generated on: ${new Date().toLocaleDateString()}`,
                            }),
                            new Paragraph({
                                text: "",
                            }),

                            // Financial Summary
                            new Paragraph({
                                text: "Financial Summary",
                                heading: HeadingLevel.HEADING_1,
                            }),
                            new Table({
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Metric")] }),
                                            new TableCell({ children: [new Paragraph("Amount")] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Total Income")] }),
                                            new TableCell({ children: [new Paragraph(`$${incomeData.reduce((acc, income) => acc + income.amount, 0).toFixed(2)}`)] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Total Expenses")] }),
                                            new TableCell({ children: [new Paragraph(`$${expenseData.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)}`)] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Net Savings")] }),
                                            new TableCell({ children: [new Paragraph(`$${(incomeData.reduce((acc, income) => acc + income.amount, 0) - expenseData.reduce((acc, expense) => acc + expense.amount, 0)).toFixed(2)}`)] }),
                                        ],
                                    }),
                                ],
                            }),

                            new Paragraph({
                                text: "",
                            }),

                            // Budget Overview
                            new Paragraph({
                                text: "Budget Overview",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Table({
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Category")] }),
                                            new TableCell({ children: [new Paragraph("Budgeted")] }),
                                            new TableCell({ children: [new Paragraph("Spent")] }),
                                            new TableCell({ children: [new Paragraph("Remaining")] }),
                                        ],
                                    }),
                                    ...budgetData.map(budget => new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph((budget as any).name || 'Unnamed Budget')] }),
                                            new TableCell({ children: [new Paragraph(`$${budget.amount.toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(`$${budget.spent.toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(`$${(budget.amount - budget.spent).toFixed(2)}`)] }),
                                        ],
                                    })),
                                ],
                            }),

                            new Paragraph({
                                text: "",
                            }),

                            // Savings Goals
                            new Paragraph({
                                text: "Savings Goals",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Table({
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Goal")] }),
                                            new TableCell({ children: [new Paragraph("Target")] }),
                                            new TableCell({ children: [new Paragraph("Current")] }),
                                            new TableCell({ children: [new Paragraph("Remaining")] }),
                                            new TableCell({ children: [new Paragraph("Progress")] }),
                                        ],
                                    }),
                                    ...savingsGoalsData.map(goal => new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(goal.name)] }),
                                            new TableCell({ children: [new Paragraph(`$${goal.targetAmount.toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(`$${goal.currentContribution.toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(`$${(goal.targetAmount - goal.currentContribution).toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(`${((goal.currentContribution / goal.targetAmount) * 100).toFixed(1)}%`)] }),
                                        ],
                                    })),
                                ],
                            }),

                            new Paragraph({
                                text: "",
                            }),

                            // Category-wise Expenses
                            new Paragraph({
                                text: "Category-wise Expenses",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Table({
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Category")] }),
                                            new TableCell({ children: [new Paragraph("Total Amount")] }),
                                        ],
                                    }),
                                    ...categoryData.map(category => new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(category.name)] }),
                                            new TableCell({ children: [new Paragraph(`$${category.value.toFixed(2)}`)] }),
                                        ],
                                    })),
                                ],
                            }),

                            new Paragraph({
                                text: "",
                            }),

                            // Recent Expenses
                            new Paragraph({
                                text: "Recent Expenses",
                                heading: HeadingLevel.HEADING_2,
                            }),
                            new Table({
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Date")] }),
                                            new TableCell({ children: [new Paragraph("Category")] }),
                                            new TableCell({ children: [new Paragraph("Amount")] }),
                                            new TableCell({ children: [new Paragraph("Notes")] }),
                                        ],
                                    }),
                                    ...expenseData.slice(0, 20).map(expense => new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(new Date(expense.date).toLocaleDateString())] }),
                                            new TableCell({ children: [new Paragraph(expense.category)] }),
                                            new TableCell({ children: [new Paragraph(`$${expense.amount.toFixed(2)}`)] }),
                                            new TableCell({ children: [new Paragraph(expense.notes)] }),
                                        ],
                                    })),
                                ],
                            }),
                        ],
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Financial_Report_${new Date().toISOString().split('T')[0]}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-text-primary">Loading financial reports...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Financial Reports</h1>
                    <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            dataSource === 'oracle' ? 'bg-green-100 text-green-800' :
                            dataSource === 'local' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                                dataSource === 'oracle' ? 'bg-green-500' :
                                dataSource === 'local' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}></span>
                            Data Source: {
                                dataSource === 'oracle' ? 'Central Oracle Database' :
                                dataSource === 'local' ? 'Local MongoDB Database' :
                                'No Data Available'
                            }
                        </span>
                    </div>
                </div>
                <button
                    onClick={generateAndDownloadReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Report (DOC)</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Monthly Expenditure Analysis */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Monthly Expenditure Analysis</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis type="number" stroke="#a0aec0" />
                            <YAxis type="category" dataKey="name" stroke="#a0aec0" width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }} />
                            <Legend />
                            <Bar dataKey="value" name="Expenditure" fill="#38b2ac" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Budget Adherence Tracking */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Budget Adherence Tracking</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={budgetAdherenceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }} />
                            <Legend />
                            <Bar dataKey="Budgeted" fill="#4a5568" />
                            <Bar dataKey="Spent" fill="#38b2ac" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category-wise Expense Distribution */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Category-wise Expense Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}>
                                {categoryData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Forecasted Savings Trends */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Forecasted Savings Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={forecastedSavingsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="savings" name="Actual Savings" stroke="#38b2ac" strokeWidth={2} />
                            <Line type="monotone" dataKey="forecast" name="Forecasted Savings" stroke="#a0aec0" strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Savings Goals Progress */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Savings Goals Progress</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={savingsGoalsProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" domain={[0, 100]} />
                            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                            <Legend />
                            <Bar dataKey="Progress" name="Progress (%)" fill="#10b981">
                                {savingsGoalsProgressData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        entry.Progress >= 80 ? '#10b981' :
                                        entry.Progress >= 50 ? '#f59e0b' : '#ef4444'
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default ReportsPage;