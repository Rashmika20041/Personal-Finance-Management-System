import { mockExpenses, mockBudgets, savingsTrendData, mockSavingsGoals, mockIncome } from '../data/mockData';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, HeadingLevel } from 'docx';

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

    // Data for Savings Goals Progress
    const savingsGoalsData = mockSavingsGoals.map(goal => ({
        name: goal.name,
        Current: goal.currentContribution,
        Target: goal.targetAmount,
        Remaining: goal.targetAmount - goal.currentContribution,
        Progress: ((goal.currentContribution / goal.targetAmount) * 100).toFixed(1) + '%'
    }));

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
                                            new TableCell({ children: [new Paragraph(`$${mockIncome.reduce((acc, income) => acc + income.amount, 0).toFixed(2)}`)] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Total Expenses")] }),
                                            new TableCell({ children: [new Paragraph(`$${mockExpenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)}`)] }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph("Net Savings")] }),
                                            new TableCell({ children: [new Paragraph(`$${(mockIncome.reduce((acc, income) => acc + income.amount, 0) - mockExpenses.reduce((acc, expense) => acc + expense.amount, 0)).toFixed(2)}`)] }),
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
                                    ...mockBudgets.map(budget => new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(budget.category)] }),
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
                                    ...mockSavingsGoals.map(goal => new TableRow({
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
                                    ...mockExpenses.slice(0, 20).map(expense => new TableRow({
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

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Financial Reports</h1>
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
                        <BarChart data={savingsGoalsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }} />
                            <Legend />
                            <Bar dataKey="Current" name="Current Savings" fill="#10b981" stackId="a" />
                            <Bar dataKey="Remaining" name="Remaining" fill="#f59e0b" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default ReportsPage;