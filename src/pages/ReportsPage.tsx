import React from 'react';
import { mockExpenses, mockBudgets, savingsTrendData } from '../data/mockData';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';

const ReportsPage = () => {

    // Data for Category-wise Expense Distribution
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

    // Data for Budget Adherence
    const budgetAdherenceData = mockBudgets.map(budget => ({
        name: budget.category,
        Budgeted: budget.amount,
        Spent: budget.spent,
    }));

    // Data for Forecasted Savings
    const forecastedSavingsData = [
        ...savingsTrendData,
        { name: 'Oct', savings: 550, forecast: 550 },
        { name: 'Nov', forecast: 600 },
        { name: 'Dec', forecast: 650 },
    ];

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

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Financial Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Monthly Expenditure Analysis */}
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Monthly Expenditure Analysis</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis type="number" stroke="#a0aec0" />
                            <YAxis type="category" dataKey="name" stroke="#a0aec0" width={80} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#4a5568' }} />
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
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#4a5568' }} />
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
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {categoryData.map((entry, index) => (
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

            </div>
        </div>
    );
};

export default ReportsPage;