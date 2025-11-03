import React, { useState, useEffect } from 'react';
import type { Expense } from '../data/mockData';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  onClose: () => void;
  expenseToEdit?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onClose, expenseToEdit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setPaymentMethod(expenseToEdit.paymentMethod);
    } else {
      // Reset form for new expense
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setPaymentMethod('Credit Card');
    }
  }, [expenseToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !date) {
            alert("Please fill in all required fields.");
            return;
        }

        const expenseData = {
            amount: parseFloat(amount),
            category,
            date,
            paymentMethod,
            notes: '',
        };

        try {
            if (expenseToEdit) {
                // For editing, include the id
                await onSubmit({ ...expenseData, id: expenseToEdit.id });
            } else {
                // For creating, don't include id
                await onSubmit(expenseData);
            }
        } catch (error) {
            console.error('Error submitting expense:', error);
            alert('Failed to save expense. Please try again.');
        }
    };  const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Dining Out", "Health", "Shopping", "Other"];
  const paymentMethods = ["Credit Card", "Debit Card", "Bank Transfer", "Cash"];

  return (
    <div className="max-w-lg sm:max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm sm:text-base">Track your spending with precision</p>
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
              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base sm:text-lg font-semibold" 
              placeholder="0.00"
              required 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="flex flex-col">
          <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Category *
          </label>
          <select 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="py-2">{cat}</option>
            ))}
          </select>
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            required 
          />
        </div>

        {/* Payment Method Field */}
        <div className="flex flex-col">
          <label htmlFor="paymentMethod" className="flex items-center text-sm font-medium text-gray-600 mb-2">
            Payment Method
          </label>
          <select 
            id="paymentMethod" 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            required
          >
            {paymentMethods.map(method => (
              <option key={method} value={method} className="py-2">{method}</option>
            ))}
          </select>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            {expenseToEdit ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;