import React from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SettingsPage = () => {
    
    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication required');
                return;
            }

            const response = await fetch('http://localhost:5000/api/settings/export', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                alert("Backup exported successfully!");
            } else {
                alert('Failed to export backup');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting backup');
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication required');
                return;
            }

            const text = await file.text();
            const data = JSON.parse(text);

            const response = await fetch('http://localhost:5000/api/settings/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                // Optionally refresh data or navigate
            } else {
                alert('Failed to import backup');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Error importing backup');
        }
    };

    const triggerImport = () => {
        document.getElementById('import-input')?.click();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Settings & Backup</h1>

            <div className="grid grid-cols-1 gap-8">
                {/* Data Management Section */}
                <div className="bg-secondary shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Data Management</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Local Backup (Mongo DB)</h3>
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
            </div>
        </div>
    );
};

export default SettingsPage;