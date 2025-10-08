import { useState, useEffect } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getSyncQueue, clearSyncQueue } from '../utils/offlineSync';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'conflict' | 'error';

const SynchronizationPage = () => {
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date('2025-10-05T09:55:18Z'));
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (syncStatus !== 'syncing') {
                handleSync();
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial sync on component mount if online
        if (navigator.onLine && syncStatus === 'idle') {
            handleSync();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncStatus]);

    const handleSync = () => {
        setSyncStatus('syncing');
        
        // Simulate a network request
        setTimeout(() => {
            const syncQueue = getSyncQueue();
            if (syncQueue.length > 0) {
                console.log('Syncing queued data:', syncQueue);
                // Here you would typically send the data to your central server
                // For now, we'll just clear the queue
                clearSyncQueue();
            }

            // Randomly resolve to success or conflict for demonstration
            if (Math.random() > 0.5) {
                setSyncStatus('success');
                setLastSyncTime(new Date());
            } else {
                setSyncStatus('conflict');
            }
        }, 2000);
    };

    const handleConflictResolution = (choice: 'local' | 'central') => {
        console.log(`User chose to keep ${choice} data.`);
        setSyncStatus('syncing');
        // Simulate resolving the conflict
        setTimeout(() => {
            setSyncStatus('success');
            setLastSyncTime(new Date());
        }, 1500);
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
                        <span>Synchronization successful!</span>
                    </div>
                );
            case 'conflict':
                return (
                    <div className="flex items-center text-red-500">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span>Conflict detected! Please resolve.</span>
                    </div>
                );
            case 'error':
                 return (
                    <div className="flex items-center text-red-500">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span>An error occurred during sync.</span>
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

                {syncStatus === 'conflict' && (
                    <div className="mt-8 border-t border-accent pt-6">
                        <h3 className="text-lg font-semibold text-center text-red-400 mb-4">Conflict Resolution</h3>
                        <p className="text-center text-text-secondary mb-6">
                            The data on your local device is different from the data on the server. Choose which version to keep.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => handleConflictResolution('local')} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition-colors">
                                Keep Local Data
                            </button>
                            <button onClick={() => handleConflictResolution('central')} className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition-colors">
                                Keep Central Data
                            </button>
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
