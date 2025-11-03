import React, { useState, useEffect } from 'react';
import type { Budget } from '../data/mockData';

interface BudgetFormProps {
  onSubmit: (budget: any) => void;
  onClose: () => void;
  budgetToEdit?: Budget | null;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, onClose, budgetToEdit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('Monthly');
  const [threshold, setThreshold] = useState('');

  useEffect(() => {
    if (budgetToEdit) {
      setName(budgetToEdit.name);
      setCategory(budgetToEdit.category);
      setAmount(budgetToEdit.amount.toString());
      setDuration(budgetToEdit.duration);
      setThreshold(budgetToEdit.threshold?.toString() || '80');
    } else {
      setName('');
      setCategory('');
      setAmount('');
      setDuration('Monthly');
      setThreshold('80');
    }
  }, [budgetToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category || !duration) {
      alert("Please fill in all required fields.");
      return;
    }
    const budgetData = {
      name,
      category,
      amount: parseFloat(amount),
      duration,
      threshold: threshold ? parseInt(threshold) : 80,
    };

    onSubmit(budgetData);
  };

  const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Dining Out", "Health", "Shopping", "Other"];
  const durations = ["Weekly", "Monthly", "Quarterly", "Yearly"];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-2">Budget Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="amount" className="text-sm font-medium text-gray-600 mb-2">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="category" className="text-sm font-medium text-gray-600 mb-2">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          <option value="" disabled>Select a category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="duration" className="text-sm font-medium text-gray-600 mb-2">Duration</label>
        <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="threshold" className="text-sm font-medium text-gray-600 mb-2">Alert Threshold (%)</label>
        <input type="number" id="threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="e.g., 80" className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700">{budgetToEdit ? 'Update' : 'Create'} Budget</button>
      </div>
    </form>
  );
};

export default BudgetForm;