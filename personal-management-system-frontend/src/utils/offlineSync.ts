import type { Expense } from '../data/mockData';

const getLocalExpenses = (): Expense[] => {
    const localData = localStorage.getItem('expenses');
    return localData ? JSON.parse(localData) : [];
};

const setLocalExpenses = (expenses: Expense[]) => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
};

const getSyncQueue = (): Expense[] => {
    const queueData = localStorage.getItem('sync_queue');
    return queueData ? JSON.parse(queueData) : [];
};

const addToSyncQueue = (expense: Expense) => {
    const queue = getSyncQueue();
    queue.push(expense);
    localStorage.setItem('sync_queue', JSON.stringify(queue));
};

const clearSyncQueue = () => {
    localStorage.removeItem('sync_queue');
};

export { getLocalExpenses, setLocalExpenses, getSyncQueue, addToSyncQueue, clearSyncQueue };
