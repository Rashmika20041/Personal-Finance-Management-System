import { useState, useEffect } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface SyncStatusData {
    totalIncomes: number;
    syncedIncomes: number;
    unsyncedIncomes: number;
    deletionPendingIncomes: number;
    totalExpenses: number;
    syncedExpenses: number;
    unsyncedExpenses: number;
    deletionPendingExpenses: number;
    totalSavingsGoals: number;
    syncedSavingsGoals: number;
    unsyncedSavingsGoals: number;
    deletionPendingSavingsGoals: number;
    totalBudgets: number;
    syncedBudgets: number;
    unsyncedBudgets: number;
    deletionPendingBudgets: number;
    totalRecords: number;
    syncedRecords: number;
    syncPercentage: string;
    totalDeletionPending: number;
}

const SynchronizationPage = () => {
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatusData, setSyncStatusData] = useState<SyncStatusData | null>(null);
    const [syncResult, setSyncResult] = useState<any>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Load initial sync status
        loadSyncStatus();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadSyncStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/sync/status', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSyncStatusData(data);
            }
        } catch (error) {
            console.error('Error loading sync status:', error);
        }
    };

    const handleSync = async () => {
        if (!isOnline) {
            setSyncStatus('error');
            setSyncResult({ message: 'No internet connection available' });
            return;
        }

        setSyncStatus('syncing');
        setSyncResult(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setSyncStatus('error');
                setSyncResult({ message: 'Authentication required' });
                return;
            }

            const response = await fetch('http://localhost:5000/api/sync/all', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSyncStatus('success');
                setSyncResult(result);
                setLastSyncTime(new Date());
                // Reload sync status after successful sync
                await loadSyncStatus();
            } else {
                setSyncStatus('error');
                setSyncResult(result);
            }
        } catch (error) {
            console.error('Sync error:', error);
            setSyncStatus('error');
            setSyncResult({ message: 'Network error occurred during sync' });
        }
    };

    const renderStatus = () => {
        switch (syncStatus) {
            case 'syncing':
                return (
                    <div className="flex items-center text-yellow-400">
                        <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                        <span>Syncing data...</span>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center text-green-400">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span>{syncResult?.message || 'Synchronization successful!'}</span>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex items-center text-red-500">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span>{syncResult?.message || 'An error occurred during sync.'}</span>
                    </div>
                );
            default:
                return (
                     <div className="flex items-center text-text-secondary">
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                        <span>Ready to sync.</span>
                    </div>
                );
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Synchronization</h1>

            <div className="bg-secondary shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    {syncStatusData && syncStatusData.totalDeletionPending > 0 && (syncStatusData.unsyncedIncomes + syncStatusData.unsyncedExpenses + syncStatusData.unsyncedSavingsGoals + syncStatusData.unsyncedBudgets) === 0 && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                            <ExclamationTriangleIcon className="h-6 w-6 mr-3 text-red-500" />
                            <div>
                                <p className="font-semibold">Pending Deletions</p>
                                <p>You have {syncStatusData.totalDeletionPending} item(s) marked for deletion. Click "Sync Now" to remove them from the central database.</p>
                            </div>
                        </div>
                    )}
                    <h2 className="text-xl font-bold text-text-primary mb-2">Sync Local & Central Databases</h2>
                    <p className="text-text-secondary mb-6">
                        Keep your data up-to-date across all your devices by syncing with the central server.
                    </p>
                    
                    <button 
                        onClick={handleSync}
                        disabled={syncStatus === 'syncing'}
                        className="flex items-center justify-center bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-accent disabled:cursor-not-allowed w-64 h-14"
                    >
                        {syncStatus !== 'syncing' && <ArrowPathIcon className="h-6 w-6 mr-3" />}
                        {syncStatus === 'syncing' ? 'Please wait...' : 'Sync Now'}
                    </button>

                    <div className="mt-6 h-6 text-sm">
                        {renderStatus()}
                    </div>
                </div>

                {syncStatusData && (
                    <div className="mt-8 border-t border-accent pt-6">
                        <h3 className="text-lg font-semibold text-center text-text-primary mb-4">Sync Status</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                                <p className="text-text-secondary">Incomes</p>
                                <p className="font-semibold text-text-primary">
                                    {syncStatusData.syncedIncomes}/{syncStatusData.totalIncomes} synced
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-text-secondary">Expenses</p>
                                <p className="font-semibold text-text-primary">
                                    {syncStatusData.syncedExpenses}/{syncStatusData.totalExpenses} synced
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-text-secondary">Savings Goals</p>
                                <p className="font-semibold text-text-primary">
                                    {syncStatusData.syncedSavingsGoals}/{syncStatusData.totalSavingsGoals} synced
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-text-secondary">Budgets</p>
                                <p className="font-semibold text-text-primary">
                                    {syncStatusData.syncedBudgets}/{syncStatusData.totalBudgets} synced
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-lg font-semibold text-text-primary">
                                Overall Progress: {syncStatusData.syncPercentage}%
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-center mt-8 border-t border-accent pt-4">
                    <p className="text-sm text-text-secondary">
                        Last successful sync: 
                        <span className="font-semibold text-text-primary ml-2">
                            {lastSyncTime ? lastSyncTime.toLocaleString() : 'Never'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SynchronizationPage;
