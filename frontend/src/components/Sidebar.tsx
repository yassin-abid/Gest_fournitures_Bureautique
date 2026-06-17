/**
 * Sidebar Component
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
  subItems?: { label: string; path: string }[];
}

// Role keys for clarity
const ALL_ROLES = ['admin', 'responsable_service', 'gestionnaire_stock', 'responsable_achats', 'employe'];

const navItems: NavItem[] = [
  // ─── Tableau de bord ─── visible by all
  {
    label: 'Tableau de bord',
    path: '/dashboard',
    icon: 'dashboard',
    roles: ALL_ROLES,
  },

  // ─── Catalogue ─── admin, gestionnaire de stock (consultation)
  {
    label: 'Catalogue',
    path: '/catalog',
    icon: 'inventory_2',
    roles: ['admin', 'gestionnaire_stock', 'responsable_achats'],
    subItems: [
      { label: 'Articles', path: '/catalog/articles' },
      { label: 'Catégories', path: '/catalog/categories' },
      { label: 'Fournisseurs', path: '/catalog/suppliers' },
    ],
  },

  // ─── Stock ─── admin + gestionnaire de stock uniquement
  {
    label: 'Stock',
    path: '/stock',
    icon: 'inventory',
    roles: ['admin', 'gestionnaire_stock'],
    subItems: [
      { label: 'Statut', path: '/stock/status' },
      { label: 'Mouvements', path: '/stock/movements' },
      { label: 'Alertes', path: '/stock/alerts' },
    ],
  },

  // ─── Demandes ───
  //   • Employé / Gestionnaire Stock : créer + suivre ses propres demandes
  //   • Responsable Service : approuver / refuser les demandes de son équipe
  //   • Responsable Achats : consulter les demandes approuvées
  //   • Admin : accès total
  {
    label: 'Demandes',
    path: '/requests',
    icon: 'request_quote',
    roles: ['admin', 'responsable_service', 'gestionnaire_stock', 'responsable_achats', 'employe'],
    subItems: [
      { label: 'Liste', path: '/requests' },
      { label: 'Créer', path: '/requests/create' },
    ],
  },

  // ─── Commandes ─── admin + responsable achats uniquement
  {
    label: 'Commandes',
    path: '/orders',
    icon: 'shopping_cart',
    roles: ['admin', 'responsable_achats'],
    subItems: [
      { label: 'Liste', path: '/orders' },
      { label: 'Créer', path: '/orders/create' },
    ],
  },

  // ─── Rapports & Analytique ─── admin, gestionnaire stock, responsable achats
  {
    label: 'Rapports',
    path: '/reports',
    icon: 'bar_chart',
    roles: ['admin', 'gestionnaire_stock', 'responsable_achats'],
    subItems: [
      { label: 'Général', path: '/reports' },
      { label: 'Bilan & Prévisions', path: '/reports/analytics' },
    ],
  },

  // ─── Administration ─── admin uniquement
  {
    label: 'Administration',
    path: '/admin',
    icon: 'admin_panel_settings',
    roles: ['admin'],
    subItems: [
      { label: 'Utilisateurs', path: '/admin/users' },
      { label: 'Rôles & Permissions', path: '/admin/roles' },
      { label: 'Journaux Système', path: '/admin/logs' },
      { label: 'Paramètres', path: '/admin/settings' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isNavItemVisible = (item: NavItem) => {
    if (!item.roles) return true;
    return user ? item.roles.includes(user.role) : false;
  };

  const roleLabels: Record<string, string> = {
    admin: '🛡 Administrateur',
    responsable_service: '✅ Resp. de Service',
    gestionnaire_stock: '📦 Gest. de Stock',
    responsable_achats: '🛒 Resp. Achats',
    employe: '👤 Employé',
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.filter(isNavItemVisible).map((item) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isExpanded = expandedItems.includes(item.path);

      return (
        <div key={item.path} className="flex flex-col">
          <NavLink
            to={hasSubItems ? '#' : item.path}
            onClick={hasSubItems ? (e) => toggleExpand(item.path, e) : onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ease-in-out border-l-4 shrink-0 group relative overflow-hidden ${isActive && !hasSubItems
                ? 'text-secondary border-secondary bg-secondary/10 font-bold'
                : 'text-on-primary-container/70 border-transparent hover:bg-on-primary-container/5 hover:text-on-primary-container'
              }`
            }
            title={item.label}
          >
            <span className="material-symbols-outlined shrink-0" data-icon={item.icon}>{item.icon}</span>
            <span className="sidebar-label opacity-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-300 text-body-md font-body-md font-semibold flex-1 flex justify-between items-center">
              {item.label}
              {hasSubItems && (
                <span className={`material-symbols-outlined text-[16px] transition-transform ${isExpanded ? 'rotate-90' : ''}`}>chevron_right</span>
              )}
            </span>
          </NavLink>

          {hasSubItems && isExpanded && (
            <div className="flex flex-col ml-[28px] mt-1 space-y-1 sidebar-subitems">
              {item.subItems!.filter(sub => {
                if (sub.path === '/requests/create' && user?.role === 'responsable_achats') return false;
                return true;
              }).map(sub => (
                <NavLink
                  key={sub.path}
                  to={sub.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-label opacity-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-300 px-3 py-1.5 rounded-lg text-sm ${isActive
                      ? 'text-secondary font-bold bg-secondary/5'
                      : 'text-on-primary-container/60 hover:text-on-primary-container hover:bg-on-primary-container/5'
                    }`
                  }
                >
                  {sub.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <nav
        id="sidebar"
        style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: '80px', zIndex: 50, transition: 'width 300ms ease-in-out' }}
        onMouseEnter={e => (e.currentTarget.style.width = '280px')}
        onMouseLeave={e => (e.currentTarget.style.width = '80px')}
        className="bg-primary-container border-r border-outline-variant shadow-sm flex flex-col py-6 px-4 overflow-hidden group"
      >
        {/* Mobile Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-on-primary-container hover:bg-on-primary-container/10 rounded-lg lg:hidden">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Brand Area */}
        <div className="flex items-center gap-3 mb-stack-lg px-2 h-10 shrink-0 mt-2 lg:mt-0">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          </div>
          <div className="brand-text opacity-0 hidden transition-opacity duration-300 whitespace-nowrap">
            <h1 className="font-headline-md text-headline-md font-bold text-on-primary">Hammemi Office</h1>
            <p className="font-label-md text-label-md text-on-primary-container/70">Management System</p>
          </div>
        </div>

        {/* User Info (Expanded only) */}
        {user && (
          <div className="brand-text opacity-0 hidden transition-opacity duration-300 mb-6 px-3">
            <div className="p-3 bg-on-primary-container/5 rounded-lg border border-on-primary-container/10">
              <p className="font-semibold text-on-primary text-sm truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-secondary font-medium mt-0.5">{roleLabels[user.role] ?? user.role}</p>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {renderNavItems(navItems)}
        </div>

        {/* Footer Nav */}
        <div className="mt-auto pt-4 border-t border-outline-variant/20 flex flex-col gap-1 shrink-0 pb-4">
          <a className="flex items-center px-3 py-2.5 rounded-lg text-on-primary-container/70 font-medium hover:bg-on-primary-container/5 hover:text-on-primary-container transition-all duration-200 ease-in-out border-l-4 border-transparent shrink-0 group relative overflow-hidden" href="#" title="Support">
            <span className="material-symbols-outlined shrink-0" data-icon="help">help</span>
            <span className="sidebar-label opacity-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-300 text-body-md font-body-md">Support</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2.5 rounded-lg text-error/80 font-medium hover:bg-error/10 hover:text-error transition-all duration-200 ease-in-out border-l-4 border-transparent shrink-0 group relative overflow-hidden text-left"
            title="Logout"
          >
            <span className="material-symbols-outlined shrink-0" data-icon="logout">logout</span>
            <span className="sidebar-label opacity-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-300 text-body-md font-body-md">Logout</span>
          </button>
        </div>
      </nav>

      {/* Required CSS injected globally for sidebar hover logic */}
      <style>{`
        #sidebar:hover .sidebar-label, .sidebar-subitems .sidebar-label {
            opacity: 1;
            width: auto;
            margin-left: 12px;
        }
        #sidebar:hover .sidebar-subitems .sidebar-label {
            margin-left: 0;
            width: 100%;
        }
        #sidebar:hover .brand-text {
            opacity: 1;
            display: block;
        }
        /* Hide scrollbar for sidebar */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

Sidebar.displayName = 'Sidebar';
