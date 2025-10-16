import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  MapIcon, 
  BellAlertIcon, 
  UsersIcon, 
  LightBulbIcon, 
  DocumentChartBarIcon, 
  Cog6ToothIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Overview', icon: HomeIcon, path: '/admin' },
  { name: 'Geospatial Risk Map', icon: MapIcon, path: '/admin/risk-map' },
  { name: 'Active Alerts', icon: BellAlertIcon, path: '/admin/alerts' },
  { name: 'Manage Users', icon: UsersIcon, path: '/admin/users' },
  { name: 'AI Insights', icon: LightBulbIcon, path: '/admin/insights' },
  { name: 'Reports', icon: DocumentChartBarIcon, path: '/admin/reports' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/admin/settings' },
];

const AdminSidebar = ({ isOpen, setIsOpen }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isOpen ? 256 : 80,
        transition: { 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        }
      }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-screen"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4">
          {isOpen ? (
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              CATS Admin
            </h1>
          ) : (
            <img
              src="/government-emblem.png"
              alt="Emblem"
              className="h-8 w-8"
            />
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div className="ml-3">
                {isOpen && (
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Collapse Sidebar
                  </p>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;