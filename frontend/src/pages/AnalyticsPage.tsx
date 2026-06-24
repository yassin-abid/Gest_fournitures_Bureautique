/**
 * Analytics Page — Bilan & Prévisions (Responsable Achats)
 * Financial dashboard, purchase history, AI forecasts, suggestions, critical stock alerts
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Target, Download,
  Brain, AlertTriangle, ShoppingCart, Lightbulb,
  BarChart2, FileSpreadsheet, FileText, Loader2
} from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { analyticsService, DashboardData } from '@services/analyticsService';
import { exportReport, ReportConfig } from '@utils/reportGenerator';

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('year');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await analyticsService.getDashboardData(period);
        setData(res.data);
      } catch (err) {
        console.error('Erreur de chargement analytiques', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-amber-500" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-green-500" />;
    return <Target size={16} className="text-blue-500" />;
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!data) return;
    
    const combinedData: any[][] = [];
    
    // Section 1: Dépenses
    combinedData.push(['--- DÉPENSES MENSUELLES ---', '', '']);
    combinedData.push(['Mois', 'Dépenses (DT)', 'Nombre de Commandes']);
    data.monthlyData.forEach(d => combinedData.push([d.month, d.amount.toString(), d.orders.toString()]));
    combinedData.push(['', '', '']);
    
    // Section 2: Catégories
    combinedData.push(['--- DÉPENSES PAR CATÉGORIE ---', '', '']);
    combinedData.push(['Catégorie', 'Dépenses (DT)', 'Pourcentage']);
    data.categorySpending.forEach(c => combinedData.push([c.name, c.amount.toString(), `${c.percentage}%`]));
    combinedData.push(['', '', '']);
    
    // Section 3: Services
    combinedData.push(['--- DÉPENSES PAR SERVICE ---', '', '']);
    combinedData.push(['Service', 'Dépenses (DT)', 'Pourcentage']);
    data.departmentSpending.forEach(d => combinedData.push([d.name, d.amount.toString(), `${d.percentage}%`]));
    combinedData.push(['', '', '']);
    
    // Section 4: Alertes
    combinedData.push(['--- ALERTES STOCK ---', '', '']);
    combinedData.push(['Article', 'Stock Actuel', 'Seuil Minimum']);
    data.criticalStock.forEach(c => combinedData.push([c.article, c.stock.toString(), c.threshold.toString()]));
    combinedData.push(['', '', '']);
    
    // Section 5: Prévisions IA
    combinedData.push(['--- PRÉVISIONS IA (1 MOIS) ---', '', '']);
    combinedData.push(['Article', 'Besoin Prévu', 'Confiance']);
    data.aiForecasts.forEach(f => combinedData.push([f.article, f.forecast1m.toString(), `${f.confidence}%`]));

    const config: ReportConfig = {
      title: `Bilan Complet et Prévisions`,
      filename: `bilan_complet_${new Date().getTime()}`,
      columns: ['Section', 'Détail 1', 'Détail 2'],
      data: combinedData
    };

    try {
      exportReport(format, config);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'export");
    }
  };

  const urgencyVariant = (u: string) =>
    u === 'urgent' ? 'danger' : u === 'high' ? 'warning' : u === 'medium' ? 'info' : 'success';

  const urgencyLabel = (u: string) =>
    u === 'urgent' ? 'Urgent' : u === 'high' ? 'Haute' : u === 'medium' ? 'Moyenne' : 'Basse';

  if (isLoading || !data) {
    return (
      <MainLayout title="Bilan & Prévisions">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </MainLayout>
    );
  }

  const { monthlyData, categorySpending, departmentSpending, aiForecasts, autoSuggestions, criticalStock } = data;
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
  const totalSpending = monthlyData.reduce((s, d) => s + d.amount, 0);
  const totalOrders = monthlyData.reduce((s, d) => s + d.orders, 0);

  return (

    <MainLayout title="Bilan & Prévisions">
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Bilan & Prévisions</h2>
            <p className="text-neutral-600 mt-1">Tableau de bord financier des achats et prévisions IA</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              options={[
                { value: 'year', label: '12 derniers mois' },
                { value: 'half', label: '6 derniers mois' },
                { value: 'quarter', label: 'Trimestre' },
              ]}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-48"
            />
            <Button variant="outline" icon={<FileText size={18} />} onClick={() => handleExport('pdf')}>PDF</Button>
            <Button variant="outline" icon={<FileSpreadsheet size={18} />} onClick={() => handleExport('excel')}>Excel</Button>
          </div>
        </div>

        {/* ── Critical stock alert ── */}
        {criticalStock.length > 0 && (
          <Alert type="warning" closable={false}>
            <span className="font-semibold">{criticalStock.length} article(s)</span> ont atteint le seuil critique de stock — une commande rapide est recommandée.
          </Alert>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Dépenses Totales', value: `${totalSpending.toLocaleString('fr-FR')} DT`, icon: <BarChart2 size={22} />, color: 'text-secondary' },
            { label: 'Commandes Passées', value: totalOrders, icon: <ShoppingCart size={22} />, color: 'text-primary' },
            { label: 'Valeur Moy. Commande', value: `${Math.round(totalSpending / totalOrders).toLocaleString('fr-FR')} DT`, icon: <TrendingUp size={22} />, color: 'text-green-600' },
            { label: 'Articles en Stock Critique', value: criticalStock.length, icon: <AlertTriangle size={22} />, color: 'text-red-500' },
          ].map((kpi, i) => (
            <Card key={i}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <span className={`${kpi.color} opacity-60`}>{kpi.icon}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* ── Monthly bar chart ── */}
        <Card>
          <CardHeader title="Évolution mensuelle des achats" />
          <CardBody>
            <div className="flex items-end gap-2 h-48 w-full overflow-x-auto pb-2">
              {monthlyData.map((d) => {
                const pct = Math.round((d.amount / maxAmount) * 100);
                return (
                  <div key={d.month} className="flex flex-col items-center gap-1 flex-1 min-w-[36px] group">
                    <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      {(d.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-secondary rounded-t-sm transition-all duration-500 hover:bg-primary cursor-pointer"
                      style={{ height: `${pct}%`, minHeight: '4px' }}
                      title={`${d.month}: ${d.amount.toLocaleString('fr-FR')} DT — ${d.orders} commandes`}
                    />
                    <span className="text-[10px] text-neutral-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* ── Category + Department spending ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Dépenses par Catégorie" />
            <CardBody>
              <div className="space-y-3">
                {categorySpending.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-neutral-900">{c.name}</span>
                      <span className="text-neutral-600">{c.amount.toLocaleString('fr-FR')} DT — {c.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className={`${c.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${c.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Dépenses par Service" />
            <CardBody>
              <div className="space-y-3">
                {departmentSpending.map((d) => (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-neutral-900">{d.name}</span>
                      <span className="text-neutral-600">{d.amount.toLocaleString('fr-FR')} DT — {d.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${d.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── AI Forecast module ── */}
        <Card>
          <CardHeader
            title="Module IA — Prévisions des Besoins (1 à 3 mois)"
            action={
              <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                <Brain size={18} />
                <span>Analyse IA active</span>
              </div>
            }
          />
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-100">
                    <th className="pb-3 font-medium">Article</th>
                    <th className="pb-3 font-medium text-center">Stock actuel</th>
                    <th className="pb-3 font-medium text-center">Seuil</th>
                    <th className="pb-3 font-medium text-center">Besoin 1 mois</th>
                    <th className="pb-3 font-medium text-center">Besoin 3 mois</th>
                    <th className="pb-3 font-medium text-center">Tendance</th>
                    <th className="pb-3 font-medium text-center">Confiance IA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {aiForecasts.map((f, i) => (
                    <tr key={i} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 font-medium text-neutral-900">{f.article}</td>
                      <td className="py-3 text-center">
                        <span className={f.currentStock <= f.threshold ? 'text-red-600 font-bold' : 'text-neutral-700'}>
                          {f.currentStock}
                        </span>
                      </td>
                      <td className="py-3 text-center text-neutral-500">{f.threshold}</td>
                      <td className="py-3 text-center font-semibold text-primary">{f.forecast1m}</td>
                      <td className="py-3 text-center font-semibold text-secondary">{f.forecast3m}</td>
                      <td className="py-3 text-center">{getTrendIcon(f.trend)}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-12 bg-neutral-100 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${f.confidence}%` }} />
                          </div>
                          <span className="text-xs text-neutral-500">{f.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* ── Auto suggestions ── */}
        <Card>
          <CardHeader
            title="Suggestions Automatiques de Commande"
            action={<Lightbulb size={18} className="text-amber-500" />}
          />
          <CardBody>
            <div className="space-y-3">
              {autoSuggestions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral-900">{s.article}</p>
                      <Badge variant={urgencyVariant(s.urgency)} size="sm">{urgencyLabel(s.urgency)}</Badge>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{s.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Qté suggérée</p>
                      <p className="font-bold text-lg text-primary">{s.suggestedQty}</p>
                    </div>
                    <Button variant="secondary" size="sm" icon={<ShoppingCart size={14} />}>
                      Commander
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* ── Critical stock alerts ── */}
        <Card>
          <CardHeader
            title="Alertes Stock Critique"
            action={<Badge variant="danger">{criticalStock.length} articles</Badge>}
          />
          <CardBody>
            <div className="space-y-3">
              {criticalStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900">{item.article}</p>
                      <p className="text-xs text-neutral-500">Fournisseur : {item.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Stock / Seuil</p>
                      <p className="font-bold text-red-600">{item.stock} / {item.threshold}</p>
                    </div>
                    <Button variant="danger" size="sm" icon={<ShoppingCart size={14} />}>
                      Commander
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* ── Export footer ── */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-900">Exporter le bilan complet</p>
                <p className="text-sm text-neutral-500">Rapport de tous les achats, dépenses et prévisions pour la direction</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" icon={<FileText size={18} />} onClick={() => handleExport('pdf')}>
                  Exporter en PDF
                </Button>
                <Button variant="primary" icon={<Download size={18} />} onClick={() => handleExport('excel')}>
                  Exporter en Excel
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </MainLayout>
  );
};
