import { useState, useMemo, useEffect } from 'react';
import Modal from '../components/Modal';
import IncomeForm from '../components/IncomeForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Income {
  _id: string;
  amount: number;
  source: string;
  date: string;
  description?: string;
}

const IncomePage = () => {
    const [income, setIncome] = useState<Income[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
    const [filterSource, setFilterSource] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = 'http://localhost:5000/api/income';

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Fetch incomes from backend
    useEffect(() => {
        const fetchIncomes = async () => {
            const token = getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch incomes');
                }

                const data = await response.json();
                setIncome(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIncomes();
    }, []);

    const handleOpenModal = (incomeItem?: Income) => {
        setIncomeToEdit(incomeItem || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIncomeToEdit(null);
    };

    const handleFormSubmit = async (incomeData: Omit<Income, '_id'> & { _id?: string }) => {
        const token = getToken();
        if (!token) return;

        const method = incomeData._id ? 'PUT' : 'POST';
        const url = incomeData._id ? `${API_URL}/${incomeData._id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(incomeData),
            });

            if (!response.ok) {
                throw new Error('Failed to save income');
            }

            const savedIncome = await response.json();

            if (method === 'POST') {
                setIncome(prev => [savedIncome, ...prev]);
            } else {
                setIncome(prev => prev.map(inc => inc._id === savedIncome._id ? savedIncome : inc));
            }

            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteIncome = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this income entry?")) {
            return;
        }

        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete income');
            }

            setIncome(prev => prev.filter(inc => inc._id !== id));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredIncome = useMemo(() => {
        return income.filter(incomeItem => {
            const sourceMatch = filterSource ? incomeItem.source.toLowerCase().includes(filterSource.toLowerCase()) : true;
            const dateMatch = filterDate ? incomeItem.date === filterDate : true;
            return sourceMatch && dateMatch;
        });
    }, [income, filterSource, filterDate]);

    const totalIncome = filteredIncome.reduce((acc, incomeItem) => acc + incomeItem.amount, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading income data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
                <input 
                    type="text" 
                    placeholder="Filter by source" 
                    value={filterSource} 
                    onChange={e => setFilterSource(e.target.value)} 
                    className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" 
                />
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-accent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" />
                <button onClick={() => {setFilterSource(''); setFilterDate('');}} className="px-8 py-2 rounded-md text-text-primary bg-gray-300 hover:bg-gray-600 transition-colors">
                    Clear
                </button>
            </div>

            <div className="bg-secondary shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-accent">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                        {filteredIncome.map((incomeItem) => (
                            <tr key={incomeItem._id} className="hover:bg-accent">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{new Date(incomeItem.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{incomeItem.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${incomeItem.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(incomeItem)} className="text-highlight hover:text-teal-300 p-2">
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleDeleteIncome(incomeItem._id)} className="text-red-500 hover:text-red-400 p-2 ml-2">
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