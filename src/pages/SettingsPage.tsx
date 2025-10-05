import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, SunIcon, MoonIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
    const [currency, setCurrency] = useState('USD');
    // Defaulting to 'dark' as per our app's design
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        // This logic would apply the theme to the whole app
        if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, [theme]);
    
    const handleExport = () => {
        // In a real app, you would serialize your local DB data here
        const dummyData = {
            expenses: [
                { id: 1, date: "2025-09-28", category: "Groceries", amount: 75.50 }
            ],
            budgets: [
                { id: 1, name: "Monthly Groceries", amount: 400, spent: 120.70 }
            ],
            savingsGoals: [
                 { id: 1, name: "New Laptop", targetAmount: 1500, currentContribution: 750 }
            ]
        };
        const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert("Backup exported successfully!");
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // In a real app, you'd parse this file and update your state/DB
            console.log("Importing file:", file.name);
            alert(`Successfully imported ${file.name}.`);
        }
    };

    const triggerImport = () => {
        document.getElementById('import-input')?.click();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Settings & Backup</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Data Management Section */}
                <div className="bg-secondary shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Data Management</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Local Backup (SQLite)</h3>
                            <p className="text-sm text-text-secondary mb-3">Export your local data to a file or import a previous backup.</p>
                            <div className="flex space-x-4">
                                <button onClick={handleExport} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">
                                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                    Export Backup
                                </button>
                                <button onClick={triggerImport} className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors">
                                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                                    Import Backup
                                </button>
                                <input type="file" id="import-input" className="hidden" accept=".json" onChange={handleImport} />
                            </div>
                        </div>
                        <div className="border-t border-accent my-4"></div>
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Central Backup (Oracle DB)</h3>
                             <div className="flex items-start text-sm text-text-secondary mt-2 bg-accent p-3 rounded-lg">
                                <InformationCircleIcon className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-highlight"/>
                                <span>
                                    Our central database is automatically backed up daily. Data is retained for 30 days, ensuring your information is always safe and recoverable. No manual action is needed.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-secondary shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Preferences</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="currency" className="block text-lg font-semibold text-text-primary mb-2">Currency</label>
                            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-accent border-transparent rounded-md py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-highlight">
                                <option value="USD">USD - United States Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                                <option value="INR">INR - Indian Rupee</option>
                            </select>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">Theme</h3>
                            <div className="flex items-center space-x-4 bg-accent p-2 rounded-full">
                                <button onClick={() => setTheme('light')} className={`flex-1 flex items-center justify-center py-2 rounded-full transition-colors ${theme === 'light' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>
                                    <SunIcon className="h-5 w-5 mr-2" /> Light
                                </button>
                                <button onClick={() => setTheme('dark')} className={`flex-1 flex items-center justify-center py-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>
                                    <MoonIcon className="h-5 w-5 mr-2" /> Dark
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-2">Note: Theme switching requires a `tailwind.config.js` update to enable class-based dark mode.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;