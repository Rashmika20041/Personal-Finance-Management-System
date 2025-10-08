import React, { useState } from 'react';
import type { Budget } from '../data/mockData';
import { mockBudgets } from '../data/mockData';
import Modal from '../components/Modal';
import BudgetForm from '../components/BudgetForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const BudgetCard: React.FC<{ budget: Budget; onEdit: () => void; onDelete: () => void; }> = ({ budget, onEdit, onDelete }) => {
    const { name, amount, spent, category } = budget;
    const progress = (spent / amount) * 100;

    const getProgressColor = () => {
        if (progress >= 90) return 'bg-red-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-secondary shadow-lg rounded-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-text-primary">{name}</h3>
                    <div className="flex space-x-2">
                        <button onClick={onEdit} className="text-text-secondary hover:text-highlight"><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={onDelete} className="text-text-secondary hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mb-4">{category}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 relative">
                    <div className={`${getProgressColor()} h-4 rounded-full flex items-center justify-center`} style={{ width: `${progress > 100 ? 100 : progress}%` }}>
                        <span className="text-xs font-bold text-white">{progress.toFixed(0)}%</span>
                    </div>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Spent: <span className="font-semibold text-text-primary">${spent.toFixed(2)}</span></span>
                    <span className="text-text-secondary">Budget: <span className="font-semibold text-text-primary">${amount.toFixed(2)}</span></span>
                </div>
            </div>
            {progress > 100 && <p className="text-xs text-red-500 mt-2">You've exceeded your budget!</p>}
        </div>
    );
};


const BudgetsPage = () => {
    const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

    const handleOpenModal = (budget?: Budget) => {
        setBudgetToEdit(budget || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBudgetToEdit(null);
    };

    const handleFormSubmit = (budgetData: Omit<Budget, 'id' | 'spent'> | Budget) => {
        if ('id' in budgetData) {
            setBudgets(budgets.map(b => b.id === budgetData.id ? budgetData : b));
        } else {
            const newBudget = { ...budgetData, id: Date.now(), spent: 0 };
            setBudgets([newBudget, ...budgets]);
        }
        handleCloseModal();
    };

    const handleDeleteBudget = (id: number) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            setBudgets(budgets.filter(b => b.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Budgets</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Budget
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(budget => (
                    <BudgetCard 
                        key={budget.id} 
                        budget={budget} 
                        onEdit={() => handleOpenModal(budget)}
                        onDelete={() => handleDeleteBudget(budget.id)}
                    />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={budgetToEdit ? 'Edit Budget' : 'Create New Budget'}>
                <BudgetForm onSubmit={handleFormSubmit} onClose={handleCloseModal} budgetToEdit={budgetToEdit} />
            </Modal>
        </div>
    );
};

export default BudgetsPage;