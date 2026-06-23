/**
 * Dashboard Page
 * Renders a role-specific view:
 *   - gestionnaire_stock → Advanced Stock Analytics Dashboard
 *   - all others         → Generic KPI Dashboard
 */

import { adminService } from '@services/adminService';
import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Loader } from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/authService';

/* ─────────────────────────────────────────────────────────────
   Shared Components
───────────────────────────────────────────────────────────── */
const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      const data = await authService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await authService.markNotificationAsRead(id);
      fetchNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-outline-variant flex items-center gap-2 bg-surface/50">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
        <h3 className="text-lg font-semibold text-on-surface flex-1">Notifications</h3>
        {unreadCount > 0 && (
          <span className="text-xs font-bold text-on-secondary bg-secondary px-2 py-0.5 rounded-full">{unreadCount}</span>
        )}
      </div>
      <div className="divide-y divide-outline-variant/30 flex-1 overflow-y-auto max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="p-5 text-center text-on-surface-variant text-sm">
            Aucune notification récente.
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors ${!notif.isRead ? 'bg-secondary/5 hover:bg-secondary/10' : 'hover:bg-surface-container-lowest'}`}
              onClick={() => !notif.isRead && markAsRead(notif.id)}
            >
              <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${notif.title?.toLowerCase().includes('erreur') ? 'text-red-500' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {notif.title?.toLowerCase().includes('approuvé') ? 'check_circle' : notif.title?.toLowerCase().includes('erreur') ? 'cancel' : 'notifications_active'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${!notif.isRead ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {notif.title || 'Notification'}
                </p>
                <p className={`text-sm mt-0.5 ${!notif.isRead ? 'font-medium text-on-surface' : 'text-on-surface-variant'}`}>
                  {notif.message}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-1">{new Date(notif.date).toLocaleString()}</p>
              </div>
              {!notif.isRead && <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1.5" title="Marquer comme lu" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Advanced Stock Dashboard — visible to Gestionnaire de Stock
───────────────────────────────────────────────────────────── */
const GestionnaireStockDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stockData = [
    { name: 'Papier A4 (500 feuilles)', current: 450, min: 100, max: 500, status: 'normal' },
    { name: 'Stylo Bille (Bleu)', current: 75, min: 50, max: 200, status: 'normal' },
    { name: 'Chemise Classeur (Jaune)', current: 45, min: 80, max: 300, status: 'low' },
    { name: 'Agrafeuse de Bureau', current: 8, min: 5, max: 30, status: 'critical' },
    { name: 'Ruban Adhésif (12mm)', current: 520, min: 100, max: 500, status: 'excess' },
    { name: 'Colle en Bâton', current: 65, min: 80, max: 250, status: 'low' },
    { name: 'Toner Laser HP 85A', current: 2, min: 10, max: 40, status: 'critical' },
  ];

  const consumptionData = [
    { month: 'Jan', papeterie: 35, informatique: 20, bureautique: 15 },
    { month: 'Fév', papeterie: 42, informatique: 28, bureautique: 18 },
    { month: 'Mar', papeterie: 28, informatique: 15, bureautique: 22 },
    { month: 'Avr', papeterie: 55, informatique: 35, bureautique: 30 },
    { month: 'Mai', papeterie: 70, informatique: 48, bureautique: 35 },
    { month: 'Jun', papeterie: 52, informatique: 32, bureautique: 28 },
  ];

  const maxConsumption = Math.max(
    ...consumptionData.map((d) => d.papeterie + d.informatique + d.bureautique)
  );

  const criticalItems = stockData.filter((s) => s.status === 'critical');
  const lowItems = stockData.filter((s) => s.status === 'low');
  const normalItems = stockData.filter((s) => s.status === 'normal');
  const excessItems = stockData.filter((s) => s.status === 'excess');

  const barColor = (status: string) => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'low') return 'bg-amber-500';
    if (status === 'excess') return 'bg-blue-400';
    return 'bg-emerald-500';
  };

  const statusLabel = (status: string) => {
    if (status === 'critical') return '🚨 CRITIQUE';
    if (status === 'low') return '⚠️ BAS';
    if (status === 'excess') return 'ℹ️ EXCÉDENT';
    return '✅ NORMAL';
  };

  const statusTextColor = (status: string) => {
    if (status === 'critical') return 'text-red-600';
    if (status === 'low') return 'text-amber-600';
    if (status === 'excess') return 'text-blue-600';
    return 'text-emerald-600';
  };

  const recentMovements = [
    { icon: 'arrow_upward', color: 'text-emerald-600 bg-emerald-50', article: 'Papier A4 (500 feuilles)', qty: '+100', ref: 'ORD-001', time: "Aujourd'hui 14:30" },
    { icon: 'arrow_downward', color: 'text-amber-600 bg-amber-50', article: 'Stylo Bille (Bleu)', qty: '-25', ref: 'REQ-001', time: "Aujourd'hui 11:15" },
    { icon: 'build', color: 'text-blue-600 bg-blue-50', article: 'Chemise Classeur', qty: '-5', ref: 'INV-001', time: 'Hier 16:45' },
    { icon: 'arrow_upward', color: 'text-emerald-600 bg-emerald-50', article: 'Agrafeuse de Bureau', qty: '+10', ref: 'ORD-002', time: 'Hier 10:20' },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Tableau de Bord — Gestion de Stock</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Vue analytique avancée : niveaux, consommation, alertes et tendances en temps réel.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/stock/movements')}
            className="px-4 py-2 font-button text-sm font-semibold text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            Mouvements
          </button>
          <button
            onClick={() => navigate('/requests/create')}
            className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 duration-200"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nouvelle Demande
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Total Articles</p>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <h3 className="text-4xl font-bold text-on-surface">{stockData.length}</h3>
          <p className="text-xs text-on-surface-variant mt-1">{normalItems.length} en stock normal</p>
        </div>

        <div className="bg-surface border border-red-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Critiques</p>
            <span className="material-symbols-outlined text-red-600 bg-red-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <h3 className="text-4xl font-bold text-red-700">{criticalItems.length}</h3>
          <p className="text-xs text-red-500 mt-1 font-medium">Action immédiate requise</p>
        </div>

        <div className="bg-surface border border-amber-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Stock Bas</p>
            <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
          </div>
          <h3 className="text-4xl font-bold text-amber-700">{lowItems.length}</h3>
          <p className="text-xs text-amber-600 mt-1">Réapprovisionnement conseillé</p>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Mouvements / Mois</p>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 rounded-lg text-[18px]">swap_vert</span>
          </div>
          <h3 className="text-4xl font-bold text-on-surface">47</h3>
          <div className="mt-2 flex items-center gap-1">
            <span className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-xs font-semibold">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> +8%
            </span>
            <span className="text-xs text-on-surface-variant">vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalItems.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-xl text-red-700 font-medium mt-gutter">
          <span className="material-symbols-outlined text-red-600 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <span className="flex-1">
            🚨 <strong>{criticalItems.length} article(s) en rupture critique :</strong> {criticalItems.map((i) => i.name).join(' · ')}
          </span>
          <button
            onClick={() => navigate('/stock/status')}
            className="text-sm font-bold underline hover:no-underline whitespace-nowrap"
          >
            Gérer →
          </button>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-gutter">
        {/* Stacked Bar Chart: Consumption by Category */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 soft-shadow flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-on-surface">Consommation par Catégorie</h3>
              <p className="text-sm text-on-surface-variant mt-0.5">Tendances de consommation mensuelle (unités sorties)</p>
            </div>
            <div className="flex gap-3 text-xs flex-wrap justify-end">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />Papeterie</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Informatique</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Bureautique</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-3 h-[200px] pb-5 border-b border-outline-variant/30">
            {consumptionData.map((d) => {
              const total = d.papeterie + d.informatique + d.bureautique;
              const h1 = (d.papeterie / maxConsumption) * 100;
              const h2 = (d.informatique / maxConsumption) * 100;
              const h3 = (d.bureautique / maxConsumption) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col justify-end gap-0 h-full group cursor-pointer">
                  <div className="relative w-full mt-auto" style={{ height: `${h1 + h2 + h3}%` }}>
                    {/* stacked bars */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse">
                      <div className="w-full bg-secondary rounded-t-0" style={{ height: `${(h1 / (h1 + h2 + h3)) * 100}%`, minHeight: '4px' }} />
                      <div className="w-full bg-emerald-500" style={{ height: `${(h2 / (h1 + h2 + h3)) * 100}%`, minHeight: '4px' }} />
                      <div className="w-full bg-amber-400 rounded-t-sm" style={{ height: `${(h3 / (h1 + h2 + h3)) * 100}%`, minHeight: '4px' }} />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Total: {total}
                    </div>
                  </div>
                  <span className="text-center text-[11px] text-on-surface-variant font-semibold mt-2">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart: Stock by Status */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 soft-shadow flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-on-surface">Répartition du Stock</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">Par statut actuel</p>
          </div>
          <div className="flex items-center justify-center my-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="#e5e7eb" strokeWidth="14" />
                {/* Critical */}
                <circle cx="50" cy="50" fill="none" r="40" stroke="#ef4444" strokeWidth="14"
                  strokeDasharray={`${(criticalItems.length / stockData.length) * 251} 251`}
                  strokeDashoffset="0" />
                {/* Low */}
                <circle cx="50" cy="50" fill="none" r="40" stroke="#f59e0b" strokeWidth="14"
                  strokeDasharray={`${(lowItems.length / stockData.length) * 251} 251`}
                  strokeDashoffset={`-${(criticalItems.length / stockData.length) * 251}`} />
                {/* Normal */}
                <circle cx="50" cy="50" fill="none" r="40" stroke="#10b981" strokeWidth="14"
                  strokeDasharray={`${(normalItems.length / stockData.length) * 251} 251`}
                  strokeDashoffset={`-${((criticalItems.length + lowItems.length) / stockData.length) * 251}`} />
                {/* Excess */}
                <circle cx="50" cy="50" fill="none" r="40" stroke="#60a5fa" strokeWidth="14"
                  strokeDasharray={`${(excessItems.length / stockData.length) * 251} 251`}
                  strokeDashoffset={`-${((criticalItems.length + lowItems.length + normalItems.length) / stockData.length) * 251}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-on-surface">{stockData.length}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">Articles</span>
              </div>
            </div>
          </div>
          <div className="space-y-2.5 mt-2">
            {[
              { label: 'Critique', count: criticalItems.length, color: 'bg-red-500' },
              { label: 'Stock Bas', count: lowItems.length, color: 'bg-amber-500' },
              { label: 'Normal', count: normalItems.length, color: 'bg-emerald-500' },
              { label: 'Excédentaire', count: excessItems.length, color: 'bg-blue-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-on-surface">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / stockData.length) * 100}%` }} />
                  </div>
                  <span className="font-bold text-on-surface w-4 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-gutter">
        {/* Stock Level Progress Bars */}
        <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Seuils d'Alerte — Détail</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Niveaux de stock actuels vs seuils</p>
            </div>
            <button
              onClick={() => navigate('/stock/status')}
              className="text-secondary text-sm font-semibold hover:underline"
            >
              Gérer tout →
            </button>
          </div>
          <div className="p-5 space-y-4">
            {stockData.map((item) => {
              const pct = Math.min(100, (item.current / item.max) * 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-on-surface truncate mr-2">{item.name}</span>
                    <span className="text-sm text-on-surface-variant shrink-0">{item.current} / {item.max}</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor(item.status)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                    <span>Min: {item.min}</span>
                    <span className={`font-bold ${statusTextColor(item.status)}`}>{statusLabel(item.status)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions + Recent Movements */}
        <div className="flex flex-col gap-gutter">
          {/* Quick Actions */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Actions Rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'add_box', color: 'text-secondary', hoverBorder: 'hover:border-secondary hover:bg-secondary/5', label: 'Enregistrer Entrée', path: '/stock/movements' },
                { icon: 'report_problem', color: 'text-red-500', hoverBorder: 'hover:border-red-400 hover:bg-red-50', label: 'Signaler Anomalie', path: '/stock/movements' },
                { icon: 'tune', color: 'text-amber-500', hoverBorder: 'hover:border-amber-400 hover:bg-amber-50', label: 'Ajuster Stock', path: '/stock/status' },
                { icon: 'description', color: 'text-emerald-500', hoverBorder: 'hover:border-emerald-400 hover:bg-emerald-50', label: 'Générer Rapport', path: '/reports' },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className={`flex flex-col items-center gap-2 p-4 bg-surface rounded-xl border border-outline-variant ${a.hoverBorder} transition-all group`}
                >
                  <span
                    className={`material-symbols-outlined text-[28px] ${a.color} group-hover:scale-110 transition-transform`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {a.icon}
                  </span>
                  <span className="text-xs font-semibold text-on-surface text-center">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Movements */}
          <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex-1">
            <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
              <h3 className="text-lg font-semibold text-on-surface">Derniers Mouvements</h3>
              <button onClick={() => navigate('/stock/movements')} className="text-secondary text-sm font-semibold hover:underline">
                Voir tout →
              </button>
            </div>
            <div className="divide-y divide-outline-variant/30">
              {recentMovements.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/50 transition-colors">
                  <span className={`material-symbols-outlined text-[18px] p-1.5 rounded-lg ${m.color}`}>{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{m.article}</p>
                    <p className="text-xs text-on-surface-variant">{m.ref} · {m.time}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${m.qty.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{m.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* ─────────────────────────────────────────────────────────────
   Responsable Service Dashboard — visible to Responsable de Service
───────────────────────────────────────────────────────────── */
const ResponsableServiceDashboard: React.FC = () => {
  const navigate = useNavigate();

  const pendingRequests = [
    { id: 'REQ-006', emp: 'Amira Belaid', items: 'Classeurs rigides', date: 'Aujourd\'hui' },
    { id: 'REQ-007', emp: 'Sami Haddad', items: 'Cartouches d\'encre (x2)', date: 'Hier' },
  ];

  const teamMembers = [
    { id: 'emp1', name: 'Amira Belaid', role: 'Chargée RH', requestsThisMonth: 3, lastRequest: 'En attente', avatar: 'AB' },
    { id: 'emp2', name: 'Sami Haddad', role: 'Recruteur', requestsThisMonth: 1, lastRequest: 'Approuvée', avatar: 'SH' },
    { id: 'emp3', name: 'Nadia Mansour', role: 'Assistante', requestsThisMonth: 5, lastRequest: 'Livrée', avatar: 'NM' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Tableau de Bord — Chef de Service</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Gérez les demandes de votre équipe et surveillez votre budget.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/requests')}
            className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">fact_check</span>
            Approuver les demandes
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">En attente d'approbation</p>
            <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
          </div>
          <h3 className="text-4xl font-bold text-amber-600">{pendingRequests.length}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Demandes à traiter</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Approuvées (Mois)</p>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h3 className="text-4xl font-bold text-emerald-600">14</h3>
          <p className="text-xs text-on-surface-variant mt-1">Transmises aux Achats</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-secondary/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Budget Alloué</p>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <h3 className="text-4xl font-bold text-on-surface">1.2k<span className="text-lg text-on-surface-variant ml-1">TND</span></h3>
          <div className="mt-2 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-[65%]" />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1">65% consommé ce trimestre</p>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-fixed/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Taille de l'équipe</p>
            <span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed/10 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <h3 className="text-4xl font-bold text-on-surface">{teamMembers.length}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Employés actifs</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-gutter">
        {/* Team Members List */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Mon Équipe</h3>
              <p className="text-xs text-on-surface-variant">Historique et profils de vos collaborateurs</p>
            </div>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {teamMembers.map(member => (
              <div key={member.id} className="p-5 flex items-center gap-4 hover:bg-surface-container-lowest transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed font-bold flex items-center justify-center">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-on-surface">{member.name}</h4>
                  <p className="text-xs text-on-surface-variant">{member.role}</p>
                </div>
                <div className="text-right mr-4 hidden md:block">
                  <p className="text-sm font-semibold text-on-surface">{member.requestsThisMonth}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Demandes (Mois)</p>
                </div>
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-sm text-on-surface">{member.lastRequest}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Dernier Statut</p>
                </div>
                <button 
                  onClick={() => navigate('/requests')} 
                  className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold text-secondary hover:bg-secondary/5"
                >
                  Voir historique
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals & Notifications */}
        <div className="flex flex-col gap-gutter">
          {/* Approvals */}
          <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>notification_important</span>
              <h3 className="text-sm font-semibold text-on-surface">Approbations Requises</h3>
            </div>
            <div className="p-2">
              {pendingRequests.map(req => (
                <div key={req.id} className="p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-on-surface">{req.id}</span>
                    <span className="text-[10px] text-on-surface-variant">{req.date}</span>
                  </div>
                  <p className="text-sm text-on-surface font-medium">{req.emp}</p>
                  <p className="text-xs text-on-surface-variant truncate">{req.items}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => navigate('/requests')} className="flex-1 py-1 bg-secondary text-on-secondary rounded text-xs font-semibold hover:bg-secondary/90">
                      Examiner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <NotificationsPanel />
        </div>
      </div>
    </MainLayout>
  );
};

/* ─────────────────────────────────────────────────────────────
   Employé Dashboard — visible to Employé role
───────────────────────────────────────────────────────────── */
const EmployeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myRequests = [
    { id: 'req-001', number: 'REQ-001', label: 'Papier A4 (x10 Rames)', date: '2024-06-10', status: 'submitted', statusLabel: 'Soumise', statusColor: 'text-blue-600 bg-blue-50' },
    { id: 'req-002', number: 'REQ-002', label: 'Stylos Bille Bleu (x50)', date: '2024-06-08', status: 'approved', statusLabel: 'Approuvée ✓', statusColor: 'text-emerald-700 bg-emerald-50' },
    { id: 'req-003', number: 'REQ-003', label: 'Ruban adhésif (x5)', date: '2024-06-05', status: 'rejected', statusLabel: 'Refusée ✗', statusColor: 'text-red-700 bg-red-50' },
    { id: 'req-004', number: 'REQ-004', label: 'Agrafeuse de bureau (x2)', date: '2024-05-28', status: 'delivered', statusLabel: 'Livrée ✓', statusColor: 'text-purple-700 bg-purple-50' },
  ];

  const submittedCount = myRequests.filter(r => r.status === 'submitted').length;
  const approvedCount = myRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = myRequests.filter(r => r.status === 'rejected').length;
  const deliveredCount = myRequests.filter(r => r.status === 'delivered').length;

  // unreadNotifs is handled inside NotificationsPanel, so we no longer display the banner here
  // to avoid duplication and state management here.

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Bienvenue, {user?.firstName} !</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Suivez vos demandes de fournitures et consultez leur évolution.</p>
        </div>
        <button
          onClick={() => navigate('/requests/create')}
          className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 duration-200"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle Demande
        </button>
      </div>

      {/* Notifications Banner handling removed as it is now in NotificationsPanel */}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface border border-blue-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">En cours</p>
            <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
          </div>
          <h3 className="text-4xl font-bold text-blue-700">{submittedCount}</h3>
          <p className="text-xs text-on-surface-variant mt-1">En attente d'approbation</p>
        </div>

        <div className="bg-surface border border-emerald-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Approuvées</p>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h3 className="text-4xl font-bold text-emerald-700">{approvedCount}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Validées par le service</p>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Livrées</p>
            <span className="material-symbols-outlined text-purple-600 bg-purple-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
          </div>
          <h3 className="text-4xl font-bold text-purple-700">{deliveredCount}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Reçues ce mois</p>
        </div>

        <div className="bg-surface border border-red-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Refusées</p>
            <span className="material-symbols-outlined text-red-600 bg-red-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          </div>
          <h3 className="text-4xl font-bold text-red-700">{rejectedCount}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Avec motif de refus</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-gutter">
        {/* My Requests History */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Mes Demandes Récentes</h3>
              <p className="text-xs text-on-surface-variant">Historique de vos soumissions</p>
            </div>
            <button onClick={() => navigate('/requests')} className="text-secondary text-sm font-semibold hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {myRequests.map(req => (
              <div key={req.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container-lowest transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-on-surface-variant">{req.number}</span>
                    <span className="text-[10px] text-on-surface-variant">· {req.date}</span>
                  </div>
                  <p className="text-sm font-medium text-on-surface truncate">{req.label}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${req.statusColor}`}>
                  {req.statusLabel}
                </span>
                <button onClick={() => navigate(`/requests/${req.id}`)} className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward_ios</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <NotificationsPanel />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-gutter">
        <button
          onClick={() => navigate('/requests/create')}
          className="flex items-center gap-4 p-5 bg-surface border border-outline-variant rounded-xl soft-shadow hover:border-secondary/50 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors shrink-0">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface">Nouvelle demande</h4>
            <p className="text-xs text-on-surface-variant">Soumettre un besoin en fournitures</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/requests')}
          className="flex items-center gap-4 p-5 bg-surface border border-outline-variant rounded-xl soft-shadow hover:border-secondary/50 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/20 flex items-center justify-center group-hover:bg-primary-fixed/30 transition-colors shrink-0">
            <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface">Mes demandes</h4>
            <p className="text-xs text-on-surface-variant">Consulter l'historique complet</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 p-5 bg-surface border border-outline-variant rounded-xl soft-shadow hover:border-secondary/50 hover:shadow-md transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/20 flex items-center justify-center group-hover:bg-tertiary-fixed/30 transition-colors shrink-0">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
          </div>
          <div>
            <h4 className="font-semibold text-on-surface">Mon profil</h4>
            <p className="text-xs text-on-surface-variant">Mettre à jour mes informations</p>
          </div>
        </button>
      </div>
    </MainLayout>
  );
};

/* ─────────────────────────────────────────────────────────────
   Responsable Achats Dashboard — visible to Responsable Achats role
───────────────────────────────────────────────────────────── */
const ResponsableAchatsDashboard: React.FC = () => {
  const navigate = useNavigate();

  const pendingRequests = [
    { id: 'REQ-010', dept: 'Ressources Humaines', items: 'Fournitures de bureau standard', priority: 'high', date: 'Aujourd\'hui' },
    { id: 'REQ-011', dept: 'Informatique', items: 'Écrans PC (x5)', priority: 'urgent', date: 'Hier' },
    { id: 'REQ-012', dept: 'Commercial', items: 'Cartouches d\'encre', priority: 'medium', date: 'Hier' },
  ];

  const activeOrders = [
    { id: 'ORD-042', supplier: 'Lyreco', total: '1,250 TND', status: 'pending', statusLabel: 'En attente', date: 'Aujourd\'hui' },
    { id: 'ORD-041', supplier: 'OfficePlus', total: '450 TND', status: 'shipped', statusLabel: 'Expédiée', date: '12 Juin' },
    { id: 'ORD-040', supplier: 'TechMarket', total: '3,200 TND', status: 'delivered', statusLabel: 'Livrée', date: '10 Juin' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Tableau de Bord — Achats</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Gérez les commandes fournisseurs et traitez les demandes approuvées.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/orders/create')}
            className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            Nouvelle Commande
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface border border-amber-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Demandes à Traiter</p>
            <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
          </div>
          <h3 className="text-4xl font-bold text-amber-700">{pendingRequests.length}</h3>
          <p className="text-xs text-on-surface-variant mt-1">Approuvées par les services</p>
        </div>

        <div className="bg-surface border border-blue-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Commandes en cours</p>
            <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
          </div>
          <h3 className="text-4xl font-bold text-blue-700">12</h3>
          <p className="text-xs text-on-surface-variant mt-1">Chez les fournisseurs</p>
        </div>

        <div className="bg-surface border border-emerald-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Budget Dépensé (Mois)</p>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <h3 className="text-4xl font-bold text-emerald-700">14.5k<span className="text-lg text-emerald-600/70 ml-1">TND</span></h3>
          <p className="text-xs text-on-surface-variant mt-1">+5% par rapport au mois dernier</p>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-fixed/20 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Fournisseurs Actifs</p>
            <span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed/10 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <h3 className="text-4xl font-bold text-on-surface">8</h3>
          <p className="text-xs text-on-surface-variant mt-1">Catalogue régulier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-gutter">
        {/* Demandes approuvées à traiter */}
        <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Demandes Approuvées (À traiter)</h3>
              <p className="text-xs text-on-surface-variant">Nécessitent une commande fournisseur ou déstockage</p>
            </div>
            <button onClick={() => navigate('/requests')} className="text-secondary text-sm font-semibold hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface text-sm">{req.id}</span>
                    {req.priority === 'urgent' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">Urgent</span>}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-0.5">{req.dept} • {req.items}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-on-surface-variant">{req.date}</span>
                  <button 
                    onClick={() => navigate(`/requests/${req.id}`)} 
                    className="px-3 py-1.5 bg-primary-fixed/20 text-primary-fixed-dim font-semibold rounded-lg text-xs hover:bg-primary-fixed/30 transition-colors"
                  >
                    Traiter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commandes en cours */}
        <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Commandes Récentes</h3>
              <p className="text-xs text-on-surface-variant">Suivi des livraisons fournisseurs</p>
            </div>
            <button onClick={() => navigate('/orders')} className="text-secondary text-sm font-semibold hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {activeOrders.map(order => (
              <div key={order.id} className="p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                <div>
                  <p className="font-bold text-on-surface text-sm">{order.id}</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">{order.supplier} • {order.total}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.statusLabel}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-1">{order.date}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)} 
                    className="p-1.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_forward_ios</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* ─────────────────────────────────────────────────────────────
   Admin Dashboard — visible to Administrateur
───────────────────────────────────────────────────────────── */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    adminService.getAuditLogs(1, 4).then(res => {
      const formatted = res.data.map((log: any) => {
        let type = 'info';
        let icon = 'info';
        const a = log.action.toLowerCase();
        if (a.includes('delete') || a.includes('hard')) { type = 'error'; icon = 'warning'; }
        else if (a.includes('cancel') || a.includes('reject') || a.includes('deactivate') || a.includes('update')) { type = 'warning'; icon = 'edit'; }
        else if (a.includes('approve') || a.includes('create')) { type = 'success'; icon = 'check_circle'; }
        else if (a.includes('login')) { icon = 'login'; }

        const map: Record<string, string> = {
          'create': 'Création', 'update': 'Modification', 'delete': 'Suppression', 'login': 'Connexion', 'approve': 'Approbation', 'reject': 'Rejet'
        };
        const actionName = map[log.action] || log.action;

        return {
          id: log.id,
          user: log.userName || 'Inconnu',
          action: actionName + ' - ' + (log.entity || '') + (log.entityName ? ' : ' + log.entityName : (log.entityId ? ' #' + log.entityId : '')),
          time: new Date(log.timestamp).toLocaleString(),
          type,
          icon
        };
      });
      setRecentLogs(formatted);
    }).catch(console.error);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Tableau de Bord — Administration</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">Supervision globale du système, des utilisateurs et des accès.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-surface border border-blue-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Utilisateurs Actifs</p>
            <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <h3 className="text-4xl font-bold text-blue-700">45</h3>
          <p className="text-xs text-on-surface-variant mt-1">Sur 48 comptes totaux</p>
        </div>

        <div className="bg-surface border border-emerald-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Santé du Système</p>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
          </div>
          <h3 className="text-4xl font-bold text-emerald-700">99.9<span className="text-lg text-emerald-600/70 ml-1">%</span></h3>
          <p className="text-xs text-on-surface-variant mt-1">Uptime sur 30 jours</p>
        </div>

        <div className="bg-surface border border-amber-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Alertes & Erreurs</p>
            <span className="material-symbols-outlined text-amber-600 bg-amber-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <h3 className="text-4xl font-bold text-amber-700">3</h3>
          <p className="text-xs text-on-surface-variant mt-1">Dans les dernières 24h</p>
        </div>

        <div className="bg-surface border border-purple-200 rounded-xl p-5 soft-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
          <div className="flex justify-between items-start mb-3">
            <p className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Départements</p>
            <span className="material-symbols-outlined text-purple-600 bg-purple-50 p-1.5 rounded-lg text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          </div>
          <h3 className="text-4xl font-bold text-purple-700">6</h3>
          <p className="text-xs text-on-surface-variant mt-1">Enregistrés dans l'application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-gutter">
        {/* Activité Système Récente */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center bg-surface/50">
            <div>
              <h3 className="text-lg font-semibold text-on-surface">Journaux Système Récents</h3>
              <p className="text-xs text-on-surface-variant">Dernières actions enregistrées par la plateforme</p>
            </div>
            <button onClick={() => navigate('/admin/logs')} className="text-secondary text-sm font-semibold hover:underline">
              Tous les logs →
            </button>
          </div>
          <div className="divide-y divide-outline-variant/30">
            {recentLogs.map(log => (
              <div key={log.id} className="p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    log.type === 'error' ? 'bg-red-100 text-red-600' :
                    log.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    log.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{log.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface text-sm">{log.action}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">Par : {log.user}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-gutter">
          {/* Accès Rapides */}
          <div className="bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
            <div className="p-5 border-b border-outline-variant flex items-center bg-surface/50">
              <h3 className="text-lg font-semibold text-on-surface flex-1">Accès Rapides</h3>
            </div>
            <div className="p-2 flex-1 flex flex-col gap-2">
              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-lowest transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>group_add</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-on-surface group-hover:text-secondary transition-colors">Gestion des utilisateurs</h4>
                  <p className="text-xs text-on-surface-variant">Créer ou modifier des comptes</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin/roles')}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-surface-container-lowest transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors shrink-0">
                  <span className="material-symbols-outlined text-purple-600" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-on-surface group-hover:text-secondary transition-colors">Rôles & Permissions</h4>
                  <p className="text-xs text-on-surface-variant">Ajuster les droits d'accès</p>
                </div>
              </button>
            </div>
          </div>
          
          <NotificationsPanel />
        </div>
      </div>
    </MainLayout>
  );
};

/* ─────────────────────────────────────────────────────────────
   Root Dashboard Router
───────────────────────────────────────────────────────────── */
export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Loader fullScreen />
      </MainLayout>
    );
  }

  // ── Role-specific dashboard ──
  if (user?.role === 'gestionnaire_stock') {
    return <GestionnaireStockDashboard />;
  }
  if (user?.role === 'responsable_service') {
    return <ResponsableServiceDashboard />;
  }
  if (user?.role === 'employe') {
    return <EmployeDashboard />;
  }
  if (user?.role === 'responsable_achats') {
    return <ResponsableAchatsDashboard />;
  }

  return <AdminDashboard />;
};

DashboardPage.displayName = 'DashboardPage';
