const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/AnalyticsPage.tsx', 'utf8');

// Replace everything from the top down to `const CRITICAL_STOCK = ...`
const replacement = `
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
`;

// we just find everything before `return (` inside AnalyticsPage and replace it
const startIndex = content.indexOf("import React, { useState } from 'react';");
const returnIndex = content.indexOf('return (', content.indexOf('export const AnalyticsPage'));

if (startIndex !== -1 && returnIndex !== -1) {
  content = content.substring(0, startIndex) + replacement.trim() + '\n' + content.substring(returnIndex + 8);
  
  // also fix MONTHLY_DATA usages which are now monthlyData (camelCase)
  content = content.replace(/MONTHLY_DATA/g, 'monthlyData');
  content = content.replace(/CATEGORY_SPENDING/g, 'categorySpending');
  content = content.replace(/DEPARTMENT_SPENDING/g, 'departmentSpending');
  content = content.replace(/AI_FORECASTS/g, 'aiForecasts');
  content = content.replace(/AUTO_SUGGESTIONS/g, 'autoSuggestions');
  content = content.replace(/CRITICAL_STOCK/g, 'criticalStock');
  
  fs.writeFileSync('frontend/src/pages/AnalyticsPage.tsx', content);
  console.log("AnalyticsPage updated!");
} else {
  console.log("Could not find start or return index");
}
