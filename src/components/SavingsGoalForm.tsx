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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Goal Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="targetAmount" className="block text-sm font-medium text-text-secondary">Target Amount</label>
        <input type="number" id="targetAmount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
       <div>
        <label htmlFor="currentContribution" className="block text-sm font-medium text-text-secondary">Current Contribution</label>
        <input type="number" id="currentContribution" value={currentContribution} onChange={(e) => setCurrentContribution(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary">Deadline</label>
        <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-text-secondary">Priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="mt-1 block w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight" required>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-primary bg-accent hover:bg-gray-600 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-white bg-highlight hover:bg-teal-500 transition-colors">{goalToEdit ? 'Update' : 'Create'} Goal</button>
      </div>
    </form>
  );
};

export default SavingsGoalForm;