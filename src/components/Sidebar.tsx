import { NavLink } from 'react-router-dom';
import logo from '../assets/logo1.png';
import {
  ChartBarIcon,
  CreditCardIcon,
  CircleStackIcon,
  TrophyIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Expenses', href: '/expenses', icon: CreditCardIcon },
  { name: 'Budgets', href: '/budgets', icon: CircleStackIcon },
  { name: 'Savings Goals', href: '/savings', icon: TrophyIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Synchronization', href: '/sync', icon: ArrowPathIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-secondary p-5 flex flex-col">
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-15 w-25 ml-3" />
      </div>
      <nav className="flex-1">
        <ul>
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 my-1 rounded-md text-text-secondary hover:bg-accent hover:text-text-primary transition-colors ${
                    isActive ? 'bg-highlight text-white' : ''
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