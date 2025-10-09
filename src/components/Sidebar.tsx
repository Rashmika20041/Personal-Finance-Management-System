import { NavLink } from 'react-router-dom';
import logo from '../assets/logo2.png';
import {
  ChartBarIcon,
  CreditCardIcon,
  CircleStackIcon,
  TrophyIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  BanknotesIcon,
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
  return (
    <div className="w-64 bg-gray-800 p-5 flex flex-col min-h-screen">
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-13 w-13 ml-6" />
      </div>
      <nav className="flex-1">
        <ul>
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg' : ''
                  }`
                }
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;