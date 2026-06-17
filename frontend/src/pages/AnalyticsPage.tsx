/**
 * Analytics Page - Reports Module
 * Display spending and usage analytics
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, ShoppingCart } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';

export const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const mockTopSuppliers = [
    {
      id: 'sup-001',
      name: 'Office Pro',
      amount: 15240.50,
      orderCount: 12,
      percentage: 32,
    },
    {
      id: 'sup-002',
      name: 'Supplies Plus',
      amount: 12350.75,
      orderCount: 8,
      percentage: 26,
    },
    {
      id: 'sup-003',
      name: 'Tech Store',
      amount: 10120.00,
      orderCount: 6,
      percentage: 21,
    },
    {
      id: 'sup-004',
      name: 'Global Imports',
      amount: 9890.25,
      orderCount: 4,
      percentage: 21,
    },
  ];

  const mockTopArticles = [
    {
      id: 'art-001',
      name: 'A4 Paper (500 sheets)',
      quantity: 450,
      spending: 2694.50,
      trend: 'up',
    },
    {
      id: 'art-002',
      name: 'Ballpoint Pen (Blue)',
      quantity: 325,
      spending: 4062.50,
      trend: 'stable',
    },
    {
      id: 'art-003',
      name: 'File Folder (Yellow)',
      quantity: 280,
      spending: 2450.00,
      trend: 'down',
    },
    {
      id: 'art-004',
      name: 'Stapler (Desktop)',
      quantity: 45,
      spending: 1125.00,
      trend: 'up',
    },
    {
      id: 'art-005',
      name: 'Notebook (Ruled)',
      quantity: 500,
      spending: 1750.00,
      trend: 'stable',
    },
  ];

  const mockAnalytics = {
    month: {
      totalSpending: 47226.50,
      orderCount: 30,
      requestCount: 25,
      averageOrderValue: 1574.22,
      topSuppliers: mockTopSuppliers,
    },
  };

  const stats = mockAnalytics[selectedPeriod as keyof typeof mockAnalytics] || mockAnalytics.month;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up')
      return <TrendingUp size={20} className="text-green-600" />;
    if (trend === 'down')
      return <TrendingDown size={20} className="text-red-600" />;
    return <Target size={20} className="text-neutral-600" />;
  };

  return (
    <MainLayout title="Analyses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Analyses</h2>
            <p className="text-neutral-600 mt-2">Affichez les analyses de dépenses et d'utilisation</p>
          </div>
          <Select
            options={[
              { value: 'week', label: 'Cette Semaine' },
              { value: 'month', label: 'Ce Mois-ci' },
              { value: 'quarter', label: 'Ce Trimestre' },
              { value: 'year', label: 'Cette Année' },
            ]}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div>
                <p className="text-sm text-neutral-600">Dépenses Totales</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">
                  €{stats.totalSpending.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-xs text-green-600 font-medium">+12.5% par rapport à la dernière période</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div>
                <p className="text-sm text-neutral-600">Commandes Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {stats.orderCount}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ShoppingCart size={16} className="text-secondary-600" />
                  <span className="text-xs text-neutral-600">bons de commande</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div>
                <p className="text-sm text-neutral-600">Demandes Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {stats.requestCount}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-neutral-600">demandes de fournitures</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div>
                <p className="text-sm text-neutral-600">Valeur Moyenne des Commandes</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  €{stats.averageOrderValue.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-xs text-green-600 font-medium">augmentation de +5.2%</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Top Suppliers */}
        <Card>
          <CardHeader title="Meilleurs Fournisseurs par Dépenses" />
          <CardBody>
            <div className="space-y-4">
              {stats.topSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center justify-between pb-4 border-b border-neutral-200 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-neutral-900">{supplier.name}</h4>
                      <Badge variant="info">{supplier.orderCount} commandes</Badge>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${supplier.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-neutral-600">{supplier.percentage}% du total</span>
                      <span className="font-semibold text-neutral-900">
                        €{supplier.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader title="Articles les Plus Utilisés" />
          <CardBody>
            <div className="space-y-4">
              {mockTopArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getTrendIcon(article.trend)}</span>
                      <div>
                        <h4 className="font-semibold text-neutral-900">{article.name}</h4>
                        <p className="text-sm text-neutral-600">Qté : {article.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">€{article.spending.toFixed(2)}</p>
                    <Badge
                      variant={
                        article.trend === 'up'
                          ? 'success'
                          : article.trend === 'down'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {article.trend === 'up' ? 'En hausse' : article.trend === 'down' ? 'En baisse' : 'Stable'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Department Spending */}
        <Card>
          <CardHeader title="Dépenses par Département" />
          <CardBody>
            <div className="space-y-4">
              {[
                { name: 'Ventes', amount: 12500, percentage: 26 },
                { name: 'RH', amount: 9800, percentage: 21 },
                { name: 'Finance', amount: 8750, percentage: 19 },
                { name: 'Informatique', amount: 10200, percentage: 22 },
                { name: 'Opérations', amount: 5976.50, percentage: 12 },
              ].map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{dept.name}</h4>
                      <span className="text-sm font-semibold text-neutral-900">
                        €{dept.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-secondary-600 h-2 rounded-full"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">{dept.percentage}% du total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};
