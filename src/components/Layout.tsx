import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-scroll bg-white">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;