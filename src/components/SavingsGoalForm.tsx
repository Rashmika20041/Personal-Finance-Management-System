import React, { useState, useEffect } from 'react';
import type { SavingsGoal } from '../data/mockData';

interface SavingsGoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, 'id'> | SavingsGoal) => void;
  onClose: () => void;
  goalToEdit?: SavingsGoal | null;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ onSubmit, onClose, goalToEdit }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentContribution, setCurrentContribution] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetAmount(goalToEdit.targetAmount.toString());
      setCurrentContribution(goalToEdit.currentContribution.toString());
      setDeadline(goalToEdit.deadline);
      setPriority(goalToEdit.priority);
    } else {
      // Reset form
      setName('');
      setTargetAmount('');
      setCurrentContribution('0');
      setDeadline('');
      setPriority('Medium');
    }
  }, [goalToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) {
        alert("Please fill in all required fields.");
        return;
    }
    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentContribution: parseFloat(currentContribution),
      deadline,
      priority,
    };

    if (goalToEdit) {
      onSubmit({ ...goalToEdit, ...goalData });
    } else {
      onSubmit(goalData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-2">Goal Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="targetAmount" className="text-sm font-medium text-gray-600 mb-2">Target Amount</label>
        <input type="number" id="targetAmount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
       <div className="flex flex-col">
        <label htmlFor="currentContribution" className="text-sm font-medium text-gray-600 mb-2">Current Contribution</label>
        <input type="number" id="currentContribution" value={currentContribution} onChange={(e) => setCurrentContribution(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="deadline" className="text-sm font-medium text-gray-600 mb-2">Deadline</label>
        <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="flex flex-col">
        <label htmlFor="priority" className="text-sm font-medium text-gray-600 mb-2">Priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="bg-gray-50 border border-gray-300 rounded px-4 py-3 text-gray-900 w-full box-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700">{goalToEdit ? 'Update' : 'Create'} Goal</button>
      </div>
    </form>
  );
};

export default SavingsGoalForm;