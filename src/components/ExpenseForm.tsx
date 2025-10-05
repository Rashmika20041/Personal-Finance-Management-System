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
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setPaymentMethod(expenseToEdit.paymentMethod);
      setNotes(expenseToEdit.notes);
    } else {
      // Reset form for new expense
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setPaymentMethod('Credit Card');
      setNotes('');
    }
  }, [expenseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
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
      notes,
    };

    if (expenseToEdit) {
      onSubmit({ ...expenseData, id: expenseToEdit.id });
    } else {
      onSubmit(expenseData);
    }
  };

  const categories = ["Groceries", "Utilities", "Transport", "Entertainment", "Dining Out", "Health", "Shopping", "Other"];
  const paymentMethods = ["Credit Card", "Debit Card", "Bank Transfer", "Cash"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-text-secondary">Payment Method</label>
        <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required>
            {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">Notes</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight"></textarea>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-primary bg-accent hover:bg-gray-600 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-white bg-highlight hover:bg-teal-500 transition-colors">{expenseToEdit ? 'Update' : 'Add'} Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;