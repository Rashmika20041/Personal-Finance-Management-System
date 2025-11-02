import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo2.png';
import { apiService } from '../utils/apiService';
import {
  ChartBarIcon,
  CreditCardIcon,
  CircleStackIcon,
  TrophyIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Income', href: '/income', icon: BanknotesIcon },
  { name: 'Expenses', href: '/expenses', icon: CreditCardIcon },
  { name: 'Budgets', href: '/budgets', icon: CircleStackIcon },
  { name: 'Savings Goals', href: '/savings', icon: TrophyIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Synchronization', href: '/sync', icon: ArrowPathIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  return (
    <div className="w-54 sm:w-48 lg:w-62 bg-gray-800 p-3 flex flex-col min-h-screen">
      <div className="flex items-center justify-center mb-6">
        <div className="relative group mt-2">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

          {/* Main circular border */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
            <div className="bg-gray-800 p-1.5 rounded-full">
              <NavLink to="/">
                <img src={logo} alt="Personal Finance Manager" className="h-10 w-10 rounded-full" />
              </NavLink>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <nav className="flex-1">
        <ul>
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 text-sm ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : ''
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-2 pb-2 border-t border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center w-full px-4 py-2 my-1 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group text-sm border border-transparent hover:border-red-500/30"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2 group-hover:animate-pulse" />
          <span className="font-medium truncate">Logout</span>
        </button>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl transform animate-scale-in border border-gray-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <ArrowRightOnRectangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to logout? You'll need to sign in again to access your account.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    apiService.logout();
                    window.location.href = '/login';
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;