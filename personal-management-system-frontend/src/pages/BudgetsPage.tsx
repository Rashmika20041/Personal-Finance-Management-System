import React, { useState, useEffect } from 'react';
import type { Budget } from '../data/mockData';
import Modal from '../components/Modal';
import BudgetForm from '../components/BudgetForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BudgetCard: React.FC<{ budget: Budget; expenses: any[]; onEdit: () => void; onDelete: () => void; }> = ({ budget, expenses, onEdit, onDelete }) => {
    const { name, amount, spent, category, threshold = 80 } = budget;
    const progress = (spent / amount) * 100;

    // Filter expenses for this budget's category
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const expenseCount = categoryExpenses.length;
    const avgExpense = expenseCount > 0 ? spent / expenseCount : 0;

    const getProgressColor = () => {
        if (progress >= threshold) return 'bg-red-500';
        if (progress >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStatusMessage = () => {
        if (progress >= threshold) return `⚠️ Over ${threshold}% of budget used!`;
        if (progress >= 70) return '⚡ Getting close to limit';
        if (progress === 0) return '📝 No expenses yet';
        return '✅ On track';
    };

    return (
        <div className="bg-secondary shadow-lg rounded-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1 border-l-4 border-teal-500">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary">{name}</h3>
                        <p className="text-sm text-text-secondary">{category} • {expenseCount} expenses</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={onEdit} className="text-text-secondary hover:text-highlight"><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={onDelete} className="text-text-secondary hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2 relative overflow-hidden">
                        <div className={`${getProgressColor()} h-4 rounded-full flex items-center justify-center transition-all duration-500`} style={{ width: `${Math.min(progress, 100)}%` }}>
                            <span className="text-xs font-bold text-white">{progress.toFixed(0)}%</span>
                        </div>
                        {progress > 100 && (
                            <div className="absolute right-0 top-0 h-4 bg-red-600 rounded-full" style={{ width: `${Math.min(progress - 100, 20)}%` }}></div>
                        )}
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-text-secondary">Spent: <span className="font-semibold text-text-primary">${spent.toFixed(2)}</span></span>
                        <span className="text-text-secondary">Budget: <span className="font-semibold text-text-primary">${amount.toFixed(2)}</span></span>
                    </div>

                    <div className="flex justify-between text-xs text-text-secondary">
                        <span>Avg expense: ${avgExpense.toFixed(2)}</span>
                        <span>Remaining: ${(amount - spent).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                    <p className="text-xs text-center font-medium">{getStatusMessage()}</p>
                </div>
            </div>

            {progress > 100 && (
                <p className="text-xs text-red-500 mt-2 text-center font-semibold">
                    Over budget by ${(spent - amount).toFixed(2)}!
                </p>
            )}
        </div>
    );
};


const BudgetsPage = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // API functions
    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/budgets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch budgets');
            }

            const data = await response.json();
            setBudgets(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/expense', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
            }
        } catch (err) {
            console.error('Error fetching expenses:', err);
        }
    };

    const createBudget = async (budgetData: any) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/budgets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(budgetData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create budget');
            }

            const newBudget = await response.json();
            setBudgets(prev => [newBudget, ...prev]);
        } catch (err) {
            throw err;
        }
    };

    const updateBudget = async (id: string, budgetData: any) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(budgetData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update budget');
            }

            const updatedBudget = await response.json();
            setBudgets(prev => prev.map(b => b._id === id ? updatedBudget : b));
        } catch (err) {
            throw err;
        }
    };

    const deleteBudget = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/budgets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete budget');
            }

            setBudgets(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchBudgets();
        fetchExpenses();
    }, []);

    const handleOpenModal = (budget?: Budget) => {
        setBudgetToEdit(budget || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBudgetToEdit(null);
    };

    const handleFormSubmit = async (budgetData: any) => {
        try {
            if (budgetToEdit) {
                await updateBudget(budgetToEdit._id, budgetData);
            } else {
                await createBudget(budgetData);
            }
            handleCloseModal();
            // Refresh data to show updated spent amounts
            await fetchBudgets();
            await fetchExpenses();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDeleteBudget = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await deleteBudget(id);
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete budget');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-text-primary">Loading budgets...</div>
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Budgets</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Budget
                </button>
            </div>

            {budgets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-text-secondary mb-4">No budgets found</p>
                    <p className="text-text-secondary">Create your first budget to start tracking your spending!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map(budget => (
                        <BudgetCard
                            key={budget._id}
                            budget={budget}
                            expenses={expenses}
                            onEdit={() => handleOpenModal(budget)}
                            onDelete={() => handleDeleteBudget(budget._id)}
                        />
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={budgetToEdit ? 'Edit Budget' : 'Create New Budget'}>
                <BudgetForm onSubmit={handleFormSubmit} onClose={handleCloseModal} budgetToEdit={budgetToEdit} />
            </Modal>
        </div>
    );
};

export default BudgetsPage;