import { useState, useMemo, useEffect } from 'react';
import type { Expense } from '../data/mockData';
import { mockExpenses } from '../data/mockData';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const getToken = () => localStorage.getItem('token');

    const fetchExpenses = async () => {
        const token = getToken();
        if (!token) {
            setExpenses(mockExpenses);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/expense', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Convert backend format to frontend format
                const formattedExpenses: Expense[] = data.map((exp: any) => ({
                    id: exp._id,
                    date: exp.date,
                    category: exp.category,
                    amount: exp.amount,
                    paymentMethod: exp.paymentMethod,
                    notes: exp.notes
                }));
                setExpenses(formattedExpenses);
            } else {
                console.error('Failed to fetch expenses');
                // Fallback to mock data if API fails
                setExpenses(mockExpenses);
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
            // Fallback to mock data if API fails
            setExpenses(mockExpenses);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (expense?: Expense) => {
        setExpenseToEdit(expense || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExpenseToEdit(null);
    };

    const handleFormSubmit = async (expenseData: Omit<Expense, 'id'> | Expense) => {
        const token = getToken();
        if (!token) return;

        try {
            let response;
            const method = 'id' in expenseData ? 'PUT' : 'POST';
            const url = 'id' in expenseData
                ? `http://localhost:5000/api/expense/${expenseData.id}`
                : 'http://localhost:5000/api/expense';

            response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(expenseData)
            });

            if (response.ok) {
                await fetchExpenses(); // Refresh the list
                handleCloseModal();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save expense');
            }
        } catch (err) {
            console.error('Error saving expense:', err);
            setError('Network error. Please try again.');
        }
    };

    const handleDeleteExpense = async (id: number) => {
        const token = getToken();
        if (!token) return;

        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/expense/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    await fetchExpenses(); // Refresh the list
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to delete expense');
                }
            } catch (err) {
                console.error('Error deleting expense:', err);
                setError('Network error. Please try again.');
            }
        }
    };
    
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const categoryMatch = filterCategory ? expense.category === filterCategory : true;
            const dateMatch = filterDate ? expense.date === filterDate : true;
            return categoryMatch && dateMatch;
        });
    }, [expenses, filterCategory, filterDate]);

    const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Dining Out", "Health", "Shopping", "Other"];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Expenses</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Expense
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                    <button onClick={() => setError('')} className="float-right ml-4">×</button>
                </div>
            )}

            <div className="bg-secondary p-4 rounded-lg mb-6 flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-text-primary">Filters:</h3>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight">
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" />
                <button onClick={() => {setFilterCategory(''); setFilterDate('');}} className="px-8 py-2 rounded-md text-text-primary bg-gray-300 hover:bg-gray-600 transition-colors">
                    Clear
                </button>
            </div>

            <div className="bg-secondary shadow-lg rounded-lg overflow-hidden">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="text-text-primary">Loading expenses...</div>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-accent">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-accent">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-accent">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{expense.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{expense.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">${expense.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{expense.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(expense)} className="text-highlight hover:text-teal-300 p-2">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-500 hover:text-red-400 p-2 ml-2">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={expenseToEdit ? 'Edit Expense' : 'Add New Expense'}>
                <ExpenseForm onSubmit={handleFormSubmit} onClose={handleCloseModal} expenseToEdit={expenseToEdit} />
            </Modal>
        </div>
    );
};

export default ExpensesPage;