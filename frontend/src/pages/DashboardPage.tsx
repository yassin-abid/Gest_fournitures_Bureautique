/**
 * Dashboard Page
 */

import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Loader } from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <Loader fullScreen />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Tableau de bord</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Indicateurs en temps réel pour l'inventaire et les achats.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 font-button text-sm font-semibold text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Exporter le rapport
          </button>
          {user?.role !== 'responsable_achats' && (
            <button 
              className="px-4 py-2 font-button text-sm font-semibold text-on-secondary bg-secondary rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 duration-200"
              onClick={() => navigate('/requests/create')}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nouvelle Demande
            </button>
          )}
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* KPI 1 */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 soft-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-fixed/20 rounded-full blur-xl group-hover:bg-primary-fixed/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-md text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Valeur Totale du Stock</p>
            <span className="material-symbols-outlined text-primary-fixed-dim bg-primary-fixed/10 p-2 rounded-lg">account_balance_wallet</span>
          </div>
          <h3 className="font-display text-[48px] font-bold text-on-surface relative z-10 leading-tight">
            45.2k<span className="text-xl font-normal text-on-surface-variant align-top ml-1">TND</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="flex items-center text-tertiary-fixed-dim bg-tertiary-fixed/10 px-2 py-1 rounded text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +2.4%
            </span>
            <span className="text-xs text-on-surface-variant">vs mois dernier</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 soft-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-fixed/20 rounded-full blur-xl group-hover:bg-secondary-fixed/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-md text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Demandes en attente</p>
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">pending_actions</span>
          </div>
          <h3 className="font-display text-[48px] font-bold text-on-surface relative z-10 leading-tight">128</h3>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="flex items-center text-on-surface-variant bg-surface-container px-2 py-1 rounded text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-1">schedule</span> Moy. 2 jours
            </span>
            <span className="text-xs text-on-surface-variant">temps de traitement</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 soft-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary-fixed/20 rounded-full blur-xl group-hover:bg-tertiary-fixed/30 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-md text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Commandes Actives</p>
            <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-fixed/30 p-2 rounded-lg">local_shipping</span>
          </div>
          <h3 className="font-display text-[48px] font-bold text-on-surface relative z-10 leading-tight">34</h3>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="flex items-center text-tertiary-fixed-dim bg-tertiary-fixed/10 px-2 py-1 rounded text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12%
            </span>
            <span className="text-xs text-on-surface-variant">vs mois dernier</span>
          </div>
        </div>

        {/* KPI 4 (Alert) */}
        <div className="bg-surface border border-error/20 rounded-xl p-6 soft-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-error/10 rounded-full blur-xl group-hover:bg-error/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="font-label-md text-[12px] font-semibold text-error uppercase tracking-wider">Alertes de Stock Bas</p>
            <span className="material-symbols-outlined text-error bg-error/10 p-2 rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <h3 className="font-display text-[48px] font-bold text-on-surface relative z-10 leading-tight">
            14<span className="text-lg font-normal text-on-surface-variant ml-2 align-baseline">articles</span>
          </h3>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="flex items-center text-error bg-error/10 px-2 py-1 rounded text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +3
            </span>
            <span className="text-xs text-on-surface-variant">action requise</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-8">
        {/* Line Chart: Consumption */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-6 soft-shadow flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface">Consommation de fournitures</h3>
              <p className="font-body-sm text-sm text-on-surface-variant">Dépenses mensuelles par catégorie (TND)</p>
            </div>
            <select className="bg-surface-container-low border border-outline-variant text-sm rounded-lg px-3 py-1.5 focus:ring-secondary focus:border-secondary outline-none">
              <option>6 Derniers Mois</option>
              <option>Cette Année</option>
            </select>
          </div>
          <div className="flex-1 relative w-full h-full bg-surface-container-low/50 rounded-lg border border-outline-variant/50 overflow-hidden flex items-end px-4 pb-4 gap-4">
            {/* Simulated Line Chart via Bars for layout */}
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-primary-fixed rounded-t-sm h-[30%] group-hover:bg-secondary transition-colors relative mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">12k</div>
              </div>
              <span className="text-center text-xs text-on-surface-variant font-semibold">Jan</span>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-primary-fixed rounded-t-sm h-[45%] group-hover:bg-secondary transition-colors relative mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">18k</div>
              </div>
              <span className="text-center text-xs text-on-surface-variant font-semibold">Fév</span>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-primary-fixed rounded-t-sm h-[25%] group-hover:bg-secondary transition-colors relative mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">10k</div>
              </div>
              <span className="text-center text-xs text-on-surface-variant font-semibold">Mar</span>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-primary-fixed rounded-t-sm h-[60%] group-hover:bg-secondary transition-colors relative mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">24k</div>
              </div>
              <span className="text-center text-xs text-on-surface-variant font-semibold">Avr</span>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-secondary rounded-t-sm h-[80%] relative shadow-[0_0_15px_rgba(49,107,243,0.3)] mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded">32k</div>
              </div>
              <span className="text-center text-xs text-on-surface font-bold">Mai</span>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer h-full">
              <div className="w-full bg-primary-fixed rounded-t-sm h-[50%] group-hover:bg-secondary transition-colors relative mt-auto">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">20k</div>
              </div>
              <span className="text-center text-xs text-on-surface-variant font-semibold">Juin</span>
            </div>
          </div>
        </div>

        {/* Donut Chart: Requests by Dept */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 soft-shadow flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="font-headline-md text-[24px] font-semibold text-on-surface">Demandes par Département</h3>
            <p className="font-body-sm text-sm text-on-surface-variant">Répartition du mois en cours</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-[16px] border-surface-container relative flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-secondary" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="100 164" strokeDashoffset="0" strokeWidth="16"></circle>
                <circle className="text-primary-fixed" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="70 194" strokeDashoffset="-100" strokeWidth="16"></circle>
                <circle className="text-tertiary-fixed-dim" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="40 224" strokeDashoffset="-170" strokeWidth="16"></circle>
                <circle className="text-surface-variant" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="54 210" strokeDashoffset="-210" strokeWidth="16"></circle>
              </svg>
              <div className="text-center">
                <span className="block font-display text-[24px] font-bold text-on-surface leading-none">284</span>
                <span className="font-label-md text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Dmd</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-on-surface">Dpt. Info</span></div>
              <span className="font-semibold">38%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-fixed"></span><span className="text-on-surface">RH</span></div>
              <span className="font-semibold">26%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></span><span className="text-on-surface">Opérations</span></div>
              <span className="font-semibold">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl soft-shadow overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface/50 backdrop-blur-sm">
            <h3 className="font-headline-md text-[24px] font-semibold text-on-surface">Activité Récente</h3>
            <button className="text-secondary hover:text-secondary/80 font-semibold text-sm transition-colors">Voir Tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-lowest">
                  <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">ID / Article</th>
                  <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Demandeur</th>
                  <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-outline-variant/30">
                <tr className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="font-medium text-on-surface">REQ-1042</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">Ordinateurs Dell XPS 15 (x3)</div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">Sarah Connor <span className="text-on-surface-variant text-xs block">Dpt. Info</span></td>
                  <td className="py-4 px-6 text-on-surface-variant">Aujourd'hui, 10:45</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> En traitement
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="font-medium text-on-surface">REQ-1041</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">Papier A4 (x50 boîtes)</div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">John Smith <span className="text-on-surface-variant text-xs block">Opérations</span></td>
                  <td className="py-4 px-6 text-on-surface-variant">Hier, 14:20</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant border border-tertiary-fixed-dim/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant"></span> Approuvé
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="font-medium text-on-surface">REQ-1040</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">Chaises ergonomiques (x12)</div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">Emma Davis <span className="text-on-surface-variant text-xs block">RH</span></td>
                  <td className="py-4 px-6 text-on-surface-variant">24 Oct, 2023</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Livré
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="font-medium text-on-surface">ORD-5092</div>
                    <div className="text-on-surface-variant text-xs mt-0.5">Réapprovisionnement: Cartouches Toner</div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">Auto Système <span className="text-on-surface-variant text-xs block">Achats</span></td>
                  <td className="py-4 px-6 text-on-surface-variant">23 Oct, 2023</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Retardé
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts Section */}
        <div className="bg-surface border border-error/20 rounded-xl soft-shadow flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
          <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <h3 className="font-headline-md text-[24px] font-semibold text-on-surface">Rupture de stock critique</h3>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="p-3 rounded-lg border border-error/10 bg-error/5 hover:bg-error/10 transition-colors flex items-center justify-between cursor-pointer">
              <div>
                <h4 className="font-medium text-on-surface text-sm">Toner Laser HP Noir 85A</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">SKU: TNR-85A-BLK</p>
              </div>
              <div className="text-right">
                <div className="text-error font-bold text-lg">2 <span className="text-xs font-normal">restants</span></div>
                <div className="text-xs text-on-surface-variant">Min : 10</div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-error/10 bg-error/5 hover:bg-error/10 transition-colors flex items-center justify-between cursor-pointer">
              <div>
                <h4 className="font-medium text-on-surface text-sm">Marqueurs effaçables (Pack 4)</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">SKU: MRK-EX-4PK</p>
              </div>
              <div className="text-right">
                <div className="text-error font-bold text-lg">5 <span className="text-xs font-normal">restants</span></div>
                <div className="text-xs text-on-surface-variant">Min : 20</div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-error/10 bg-error/5 hover:bg-error/10 transition-colors flex items-center justify-between cursor-pointer">
              <div>
                <h4 className="font-medium text-on-surface text-sm">Grains de café (1kg, Arabica)</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">SKU: CF-ARB-1KG</p>
              </div>
              <div className="text-right">
                <div className="text-error font-bold text-lg">1 <span className="text-xs font-normal">restant</span></div>
                <div className="text-xs text-on-surface-variant">Min : 5</div>
              </div>
            </div>
          </div>
          <div className="p-4 pt-0 mt-auto">
            <button className="w-full py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container-high transition-colors text-on-surface flex justify-center items-center gap-2">
              Examiner toutes les alertes
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

DashboardPage.displayName = 'DashboardPage';
