import React, { useState, useEffect } from 'react';
import type { SavingsGoal } from '../data/mockData';
import { mockSavingsGoals } from '../data/mockData';
import Modal from '../components/Modal';
import SavingsGoalForm from '../components/SavingsGoalForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
};

const SavingsGoalCard: React.FC<{ goal: SavingsGoal; onEdit: () => void; onDelete: () => void; }> = ({ goal, onEdit, onDelete }) => {
    const { name, targetAmount, currentContribution, deadline, priority } = goal;
    const progress = (currentContribution / targetAmount) * 100;

    const daysLeft = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const getProgressColor = () => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
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
                <div className="flex items-center mt-1 mb-4">
                    <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${priorityColors[priority]}`}>{priority}</span>
                    <span className="text-xs text-text-secondary ml-3">{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 relative">
                    <div className={`${getProgressColor()} h-4 rounded-full flex items-center justify-center`} style={{ width: `${progress > 100 ? 100 : progress}%` }}>
                        <span className="text-xs font-bold text-white">{progress.toFixed(0)}%</span>
                    </div>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Saved: <span className="font-semibold text-text-primary">${currentContribution.toFixed(2)}</span></span>
                    <span className="text-text-secondary">Goal: <span className="font-semibold text-text-primary">${targetAmount.toFixed(2)}</span></span>
                </div>
            </div>
        </div>
    );
};

const SavingsGoalsPage = () => {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSavingsGoals();
    }, []);

    const getToken = () => localStorage.getItem('token');

    const fetchSavingsGoals = async () => {
        const token = getToken();
        if (!token) {
            setGoals(mockSavingsGoals);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/savings-goals', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGoals(data); // Use data directly since interface now matches API
            } else {
                console.error('Failed to fetch savings goals');
                // Fallback to mock data if API fails
                setGoals(mockSavingsGoals);
            }
        } catch (err) {
            console.error('Error fetching savings goals:', err);
            // Fallback to mock data if API fails
            setGoals(mockSavingsGoals);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (goal?: SavingsGoal) => {
        setGoalToEdit(goal || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGoalToEdit(null);
    };

    const handleFormSubmit = async (goalData: { name: string; targetAmount: number; currentContribution: number; deadline: string; priority: 'High' | 'Medium' | 'Low'; _id?: string }) => {
        const token = getToken();
        if (!token) return;

        try {
            let response;
            const method = goalData._id ? 'PUT' : 'POST';
            const url = goalData._id
                ? `http://localhost:5000/api/savings-goals/${goalData._id}`
                : 'http://localhost:5000/api/savings-goals';

            // Remove _id from the data sent to API for both create and update
            const { _id, ...dataToSend } = goalData;

            response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                await fetchSavingsGoals(); // Refresh the list
                handleCloseModal();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save savings goal');
            }
        } catch (err) {
            console.error('Error saving savings goal:', err);
            setError('Network error. Please try again.');
        }
    };

    const handleDeleteGoal = async (id: string) => {
        const token = getToken();
        if (!token) return;

        if (window.confirm("Are you sure you want to delete this savings goal?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/savings-goals/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    await fetchSavingsGoals(); // Refresh the list
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to delete savings goal');
                }
            } catch (err) {
                console.error('Error deleting savings goal:', err);
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Savings Goals</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Set New Goal
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                    <button onClick={() => setError('')} className="float-right ml-4">×</button>
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="text-text-primary">Loading savings goals...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <SavingsGoalCard
                            key={goal._id}
                            goal={goal}
                            onEdit={() => handleOpenModal(goal)}
                            onDelete={() => handleDeleteGoal(goal._id)}
                        />
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={goalToEdit ? 'Edit Savings Goal' : 'Set New Savings Goal'}>
                <SavingsGoalForm onSubmit={handleFormSubmit} onClose={handleCloseModal} goalToEdit={goalToEdit} />
            </Modal>
        </div>
    );
};

export default SavingsGoalsPage;