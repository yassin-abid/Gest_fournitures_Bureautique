/**
 * Header Component
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../stores/uiStore';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from './Dropdown';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { notifications } = useUIStore();
  const navigate = useNavigate();
  const unreadNotifications = notifications.length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenuItems = [
    {
      label: 'Profil',
      value: 'profile',
      icon: <span className="material-symbols-outlined text-[18px]">person</span>,
    },
    ...(user?.role === 'admin'
      ? [
          {
            label: 'Paramètres',
            value: 'settings',
            icon: <span className="material-symbols-outlined text-[18px]">settings</span>,
          },
        ]
      : []),
    {
      label: '',
      value: 'divider',
      divider: true,
    },
    {
      label: 'Déconnexion',
      value: 'logout',
      icon: <span className="material-symbols-outlined text-[18px]">logout</span>,
    },
  ];

  const handleUserMenuSelect = (value: string | number) => {
    if (value === 'logout') {
      handleLogout();
    } else if (value === 'profile') {
      navigate('/profile');
    } else if (value === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <header
      style={{ position: 'fixed', top: 0, left: '80px', right: 0, height: '72px', zIndex: 40 }}
      className="bg-surface/80 backdrop-blur-md text-on-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-4 md:px-8"
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-container-high rounded-lg transition-colors md:hidden text-on-surface-variant"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Global Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input 
              className="w-full h-10 pl-10 pr-16 bg-surface-container-low border border-outline-variant rounded-full text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" 
              placeholder="Recherche globale..." 
              type="text"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-outline font-label-md text-label-md">
              <span className="px-1.5 py-0.5 border border-outline-variant rounded bg-surface-container">Cmd</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative">
          <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-surface"></span>
          )}
        </button>
        
        <div className="w-px h-6 bg-outline-variant mx-1 sm:mx-2 hidden sm:block"></div>
        
        {user && (
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 hover:bg-surface-container-high p-1 pr-3 rounded-full transition-colors border border-outline-variant cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center text-sm font-semibold text-on-surface">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-on-surface truncate max-w-[100px]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant hidden sm:block">expand_more</span>
              </div>
            }
            items={userMenuItems}
            onSelect={handleUserMenuSelect}
            align="right"
          />
        )}
      </div>
    </header>
  );
};

Header.displayName = 'Header';
