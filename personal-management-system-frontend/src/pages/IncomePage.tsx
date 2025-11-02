import { useState, useMemo, useEffect } from 'react';
import type { Income } from '../data/mockData';
import { mockIncome } from '../data/mockData';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const IncomePage = () => {
    const [income, setIncome] = useState<Income[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
    const [filterType, setFilterType] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        // Load initial income from local storage or use mock data
        const localIncome = localStorage.getItem('income');
        if (localIncome) {
            setIncome(JSON.parse(localIncome));
        } else {
            setIncome(mockIncome);
            localStorage.setItem('income', JSON.stringify(mockIncome));
        }
    }, []);

    const handleOpenModal = (incomeItem?: Income) => {
        setIncomeToEdit(incomeItem || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIncomeToEdit(null);
    };

    const handleFormSubmit = (incomeData: Omit<Income, 'id'> | Income) => {
        let newIncome;

        if ('id' in incomeData) {
            // Edit income
            newIncome = income.map(inc => inc.id === incomeData.id ? incomeData : inc);
        } else {
            // Add new income
            const newIncomeItem = { ...incomeData, id: Date.now() };
            newIncome = [newIncomeItem, ...income];
        }

        setIncome(newIncome);
        localStorage.setItem('income', JSON.stringify(newIncome));
        handleCloseModal();
    };

    const handleDeleteIncome = (id: number) => {
        if (window.confirm("Are you sure you want to delete this income entry?")) {
            const newIncome = income.filter(inc => inc.id !== id);
            setIncome(newIncome);
            localStorage.setItem('income', JSON.stringify(newIncome));
        }
    };

    const filteredIncome = useMemo(() => {
        return income.filter(incomeItem => {
            const typeMatch = filterType ? incomeItem.type === filterType : true;
            const dateMatch = filterDate ? incomeItem.date === filterDate : true;
            return typeMatch && dateMatch;
        });
    }, [income, filterType, filterDate]);

    const totalIncome = filteredIncome.reduce((acc, incomeItem) => acc + incomeItem.amount, 0);
    const incomeTypes: Income['type'][] = ["Salary", "Freelance", "Investment", "Business", "Other"];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Income</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Income
                </button>
            </div>

            {/* Summary Card */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Total Income</h2>
                        <p className="text-text-secondary">Filtered results</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-secondary p-4 rounded-lg mb-6 flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-text-primary">Filters:</h3>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight">
                    <option value="">All Types</option>
                    {incomeTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" />
                <button onClick={() => {setFilterType(''); setFilterDate('');}} className="px-8 py-2 rounded-md text-text-primary bg-gray-300 hover:bg-gray-600 transition-colors">
                    Clear
                </button>
            </div>

            <div className="bg-secondary shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-accent">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                        {filteredIncome.map((incomeItem) => (
                            <tr key={incomeItem.id} className="hover:bg-accent">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{incomeItem.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{incomeItem.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{incomeItem.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${incomeItem.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(incomeItem)} className="text-highlight hover:text-teal-300 p-2">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDeleteIncome(incomeItem.id)} className="text-red-500 hover:text-red-400 p-2 ml-2">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={incomeToEdit ? 'Edit Income' : 'Add New Income'}>
                <IncomeForm onSubmit={handleFormSubmit} onClose={handleCloseModal} incomeToEdit={incomeToEdit} />
            </Modal>
        </div>
    );
};

export default IncomePage;