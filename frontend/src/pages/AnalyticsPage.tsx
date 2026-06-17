/**
 * Analytics Page — Bilan & Prévisions (Responsable Achats)
 * Financial dashboard, purchase history, AI forecasts, suggestions, critical stock alerts
 */

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Target, Download,
  Brain, AlertTriangle, ShoppingCart, Lightbulb,
  BarChart2, FileSpreadsheet, FileText,
} from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';

// ── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: 'Jan', amount: 8200, orders: 12 },
  { month: 'Fév', amount: 9500, orders: 14 },
  { month: 'Mar', amount: 7800, orders: 10 },
  { month: 'Avr', amount: 11200, orders: 16 },
  { month: 'Mai', amount: 10400, orders: 15 },
  { month: 'Jun', amount: 12600, orders: 18 },
  { month: 'Juil', amount: 9800, orders: 13 },
  { month: 'Aoû', amount: 8700, orders: 11 },
  { month: 'Sep', amount: 13100, orders: 19 },
  { month: 'Oct', amount: 11900, orders: 17 },
  { month: 'Nov', amount: 14200, orders: 20 },
  { month: 'Déc', amount: 15800, orders: 22 },
];

const CATEGORY_SPENDING = [
  { name: 'Papeterie', amount: 28400, percentage: 34, color: 'bg-secondary' },
  { name: 'Informatique', amount: 22100, percentage: 27, color: 'bg-primary' },
  { name: 'Mobilier', amount: 16500, percentage: 20, color: 'bg-green-500' },
  { name: 'Hygiène', amount: 9800, percentage: 12, color: 'bg-amber-500' },
  { name: 'Divers', amount: 6300, percentage: 7, color: 'bg-red-400' },
];

const DEPARTMENT_SPENDING = [
  { name: 'Commercial', amount: 12500, percentage: 26 },
  { name: 'Ressources Humaines', amount: 9800, percentage: 21 },
  { name: 'Finance', amount: 8750, percentage: 19 },
  { name: 'Informatique', amount: 10200, percentage: 22 },
  { name: 'Logistique', amount: 5976, percentage: 12 },
];

const AI_FORECASTS = [
  { article: 'Papier A4 (500 feuilles)', currentStock: 45, threshold: 50, forecast1m: 120, forecast3m: 360, trend: 'up', confidence: 92 },
  { article: 'Stylos Bille Bleu', currentStock: 80, threshold: 30, forecast1m: 50, forecast3m: 150, trend: 'stable', confidence: 87 },
  { article: 'Classeurs (Jaune)', currentStock: 12, threshold: 20, forecast1m: 35, forecast3m: 90, trend: 'up', confidence: 95 },
  { article: 'Cartouche Imprimante HP', currentStock: 6, threshold: 10, forecast1m: 15, forecast3m: 42, trend: 'up', confidence: 89 },
];

const AUTO_SUGGESTIONS = [
  { article: 'Papier A4 (500 feuilles)', suggestedQty: 200, reason: 'Consommation historique élevée + mois de rentrée', urgency: 'urgent' },
  { article: 'Cartouche HP 302 Noir', suggestedQty: 20, reason: 'Stock critique (6 unités restantes)', urgency: 'high' },
  { article: 'Classeurs (Jaune)', suggestedQty: 50, reason: 'Prévision IA : besoin dans 2 semaines', urgency: 'medium' },
  { article: 'Post-it 76×76mm', suggestedQty: 30, reason: 'Demandes répétées sur 3 mois consécutifs', urgency: 'low' },
];

const CRITICAL_STOCK = [
  { article: 'Classeurs (Jaune)', stock: 12, threshold: 20, supplier: 'Office Pro' },
  { article: 'Cartouche HP 302 Noir', stock: 6, threshold: 10, supplier: 'Tech Store' },
  { article: 'Scotch Transparent 19mm', stock: 4, threshold: 15, supplier: 'Supplies Plus' },
];

// ── Component ────────────────────────────────────────────────────────────────

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('year');

  const maxAmount = Math.max(...MONTHLY_DATA.map((d) => d.amount));
  const totalSpending = MONTHLY_DATA.reduce((s, d) => s + d.amount, 0);
  const totalOrders = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-amber-500" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-green-500" />;
    return <Target size={16} className="text-blue-500" />;
  };

  const urgencyVariant = (u: string) =>
    u === 'urgent' ? 'danger' : u === 'high' ? 'warning' : u === 'medium' ? 'info' : 'success';

  const urgencyLabel = (u: string) =>
    u === 'urgent' ? 'Urgent' : u === 'high' ? 'Haute' : u === 'medium' ? 'Moyenne' : 'Basse';

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
            <Button variant="outline" icon={<FileText size={18} />}>PDF</Button>
            <Button variant="outline" icon={<FileSpreadsheet size={18} />}>Excel</Button>
          </div>
        </div>

        {/* ── Critical stock alert ── */}
        {CRITICAL_STOCK.length > 0 && (
          <Alert type="warning" closable={false}>
            <span className="font-semibold">{CRITICAL_STOCK.length} article(s)</span> ont atteint le seuil critique de stock — une commande rapide est recommandée.
          </Alert>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Dépenses Totales', value: `${totalSpending.toLocaleString('fr-FR')} DA`, icon: <BarChart2 size={22} />, color: 'text-secondary' },
            { label: 'Commandes Passées', value: totalOrders, icon: <ShoppingCart size={22} />, color: 'text-primary' },
            { label: 'Valeur Moy. Commande', value: `${Math.round(totalSpending / totalOrders).toLocaleString('fr-FR')} DA`, icon: <TrendingUp size={22} />, color: 'text-green-600' },
            { label: 'Articles en Stock Critique', value: CRITICAL_STOCK.length, icon: <AlertTriangle size={22} />, color: 'text-red-500' },
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
              {MONTHLY_DATA.map((d) => {
                const pct = Math.round((d.amount / maxAmount) * 100);
                return (
                  <div key={d.month} className="flex flex-col items-center gap-1 flex-1 min-w-[36px] group">
                    <span className="text-[10px] text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      {(d.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-secondary rounded-t-sm transition-all duration-500 hover:bg-primary cursor-pointer"
                      style={{ height: `${pct}%`, minHeight: '4px' }}
                      title={`${d.month}: ${d.amount.toLocaleString('fr-FR')} DA — ${d.orders} commandes`}
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
                {CATEGORY_SPENDING.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-neutral-900">{c.name}</span>
                      <span className="text-neutral-600">{c.amount.toLocaleString('fr-FR')} DA — {c.percentage}%</span>
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
                {DEPARTMENT_SPENDING.map((d) => (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-neutral-900">{d.name}</span>
                      <span className="text-neutral-600">{d.amount.toLocaleString('fr-FR')} DA — {d.percentage}%</span>
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
                  {AI_FORECASTS.map((f, i) => (
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
              {AUTO_SUGGESTIONS.map((s, i) => (
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
            action={<Badge variant="danger">{CRITICAL_STOCK.length} articles</Badge>}
          />
          <CardBody>
            <div className="space-y-3">
              {CRITICAL_STOCK.map((item, i) => (
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
                <Button variant="outline" icon={<FileText size={18} />} onClick={() => alert('Export PDF en cours...')}>
                  Exporter en PDF
                </Button>
                <Button variant="primary" icon={<Download size={18} />} onClick={() => alert('Export Excel en cours...')}>
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
