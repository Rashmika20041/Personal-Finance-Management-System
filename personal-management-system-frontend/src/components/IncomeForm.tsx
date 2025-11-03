import React, { useState, useEffect } from 'react';

interface Income {
  _id?: string;
  amount: number;
  source: string;
  date: string;
  description?: string;
}

interface IncomeFormProps {
  onSubmit: (income: Omit<Income, '_id'> & { _id?: string }) => void;
  onClose: () => void;
  incomeToEdit?: Income | null;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onSubmit, onClose, incomeToEdit }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (incomeToEdit) {
      setAmount(incomeToEdit.amount.toString());
      setSource(incomeToEdit.source);
      setDate(incomeToEdit.date);
      setDescription(incomeToEdit.description || '');
    } else {
      // Reset form for new income
      setAmount('');
      setSource('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setDescription('');
    }
  }, [incomeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !source || !date) {
        alert("Please fill in all required fields.");
        return;
    }
    const incomeData = {
      amount: parseFloat(amount),
      source,
      date,
      description: description || undefined,
    };

    if (incomeToEdit?._id) {
      onSubmit({ ...incomeData, _id: incomeToEdit._id });
    } else {
      onSubmit(incomeData);
    }
  };

  return (
    <div className="max-w-lg sm:max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm sm:text-base">Track your income sources</p>
        </div>

        <div className="flex flex-col">
          <label htmlFor="amount" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base sm:text-lg font-semibold"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Source Field */}
        <div className="flex flex-col">
          <label htmlFor="source" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Source *
          </label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="e.g., Software Engineer Salary"
            required
          />
        </div>

        {/* Date Field */}
        <div className="flex flex-col">
          <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            required
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col">
          <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Additional notes about this income"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            {incomeToEdit ? 'Update Income' : 'Add Income'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;