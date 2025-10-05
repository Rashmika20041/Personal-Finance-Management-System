import React, { useState, useEffect } from 'react';
import type { Budget } from '../data/mockData';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'spent'> | Budget) => void;
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
      setThreshold(budgetToEdit.threshold?.toString() || '');
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
      threshold: threshold ? parseInt(threshold) : undefined,
    };

    if (budgetToEdit) {
      onSubmit({ ...budgetToEdit, ...budgetData });
    } else {
      onSubmit({ ...budgetData, spent: 0 });
    }
  };

  const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Dining Out", "Health", "Shopping", "Other"];
  const durations = ["Weekly", "Monthly", "Quarterly", "Yearly"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Budget Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required>
          <option value="" disabled>Select a category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-text-secondary">Duration</label>
        <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required>
          {durations.map(dur => <option key={dur} value={dur}>{dur}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="threshold" className="block text-sm font-medium text-text-secondary">Alert Threshold (%)</label>
        <input type="number" id="threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="e.g., 80" className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-primary bg-accent hover:bg-gray-600 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-white bg-highlight hover:bg-teal-500 transition-colors">{budgetToEdit ? 'Update' : 'Create'} Budget</button>
      </div>
    </form>
  );
};

export default BudgetForm;