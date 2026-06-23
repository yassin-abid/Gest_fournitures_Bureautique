const fs = require('fs');

const replacement = `
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import { Alert } from '@components/Alert';
import { exportReport, ReportConfig } from '@utils/reportGenerator';
import { catalogService } from '@services/catalogService';
import { ordersService } from '@services/ordersService';
import { requestsService } from '@services/requestsService';
import { analyticsService } from '@services/analyticsService';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  fileSize: string;
  format: string;
}

export const ReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('stock');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('generatedReports');
    if (saved) {
      try {
        setGeneratedReports(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveReportHistory = (report: Omit<GeneratedReport, 'id'>) => {
    const newReport: GeneratedReport = {
      ...report,
      id: \`rep-\${Date.now()}\`
    };
    const updated = [newReport, ...generatedReports].slice(0, 10); // Keep last 10
    setGeneratedReports(updated);
    localStorage.setItem('generatedReports', JSON.stringify(updated));
  };

  const reportOptions = [
    { value: 'stock', label: 'Rapport de Stock', description: "Niveaux d'inventaire actuels", icon: '📦' },
    { value: 'requests', label: 'Rapport de Demandes', description: "Demandes de fournitures", icon: '📋' },
    { value: 'orders', label: 'Rapport de Commandes', description: 'Bons de commande', icon: '🛒' },
    { value: 'spending', label: 'Rapport de Dépenses', description: 'Analyse du budget par service', icon: '💰' },
  ];

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Veuillez sélectionner les dates de début et de fin');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let config: ReportConfig | null = null;
      
      if (reportType === 'stock') {
        const res = await catalogService.getArticles(1, 1000);
        config = {
          title: 'Rapport d\\'État du Stock',
          filename: \`stock_report_\${new Date().getTime()}\`,
          columns: ['Référence', 'Désignation', 'Catégorie', 'Stock Actuel', 'Seuil Min', 'Prix Unitaire'],
          data: res.data.map(a => [
            a.code,
            a.name,
            a.category?.name || '-',
            a.quantity.toString(),
            a.minStock.toString(),
            a.unitPrice?.toString() || '0'
          ])
        };
      } 
      else if (reportType === 'orders') {
        const res = await ordersService.getOrders(1, 1000);
        config = {
          title: 'Rapport des Commandes',
          filename: \`orders_report_\${new Date().getTime()}\`,
          columns: ['N° Commande', 'Date', 'Fournisseur', 'Statut', 'Acheteur'],
          data: res.data.map(o => [
            o.orderNumber,
            new Date(o.orderDate).toLocaleDateString('fr-FR'),
            o.supplier?.name || '-',
            o.status,
            o.buyer?.lastName + ' ' + o.buyer?.firstName
          ])
        };
      }
      else if (reportType === 'requests') {
        const res = await requestsService.getRequests(1, 1000);
        config = {
          title: 'Rapport des Demandes Internes',
          filename: \`requests_report_\${new Date().getTime()}\`,
          columns: ['N° Demande', 'Date', 'Demandeur', 'Service', 'Statut'],
          data: res.data.map(r => [
            r.requestNumber,
            new Date(r.requestDate).toLocaleDateString('fr-FR'),
            r.requester?.lastName + ' ' + r.requester?.firstName,
            r.service?.name || '-',
            r.status
          ])
        };
      }
      else if (reportType === 'spending') {
        const res = await analyticsService.getDashboardData('year');
        config = {
          title: 'Rapport des Dépenses par Service',
          filename: \`spending_report_\${new Date().getTime()}\`,
          columns: ['Service', 'Montant Total (DA)', 'Pourcentage'],
          data: res.data.departmentSpending.map(d => [
            d.name,
            d.amount.toString(),
            d.percentage.toString() + '%'
          ])
        };
      }

      if (config) {
        exportReport(exportFormat, config);
        saveReportHistory({
          name: config.title,
          type: reportType,
          generatedAt: new Date().toLocaleString('fr-FR'),
          fileSize: exportFormat === 'pdf' ? '~150 KB' : '~15 KB',
          format: exportFormat
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération', error);
      alert('Une erreur est survenue lors de la génération.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'csv': return '📋';
      default: return '📎';
    }
  };

  return (
    <MainLayout title="Rapports">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Rapports</h2>
          <p className="text-neutral-600 mt-2">Générez et exportez vos rapports (PDF, Excel, CSV)</p>
        </div>

        <Card>
          <CardHeader title="Générer un Nouveau Rapport" />
          <CardBody>
            <div className="space-y-6">
              <Alert type="info">
                Sélectionnez un type de rapport, une plage de dates et un format d'exportation pour générer un nouveau rapport.
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Type de Rapport *
                  </label>
                  <div className="space-y-2">
                    {reportOptions.map((option) => (
                      <label
                        key={option.value}
                        className={\`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all \${
                          reportType === option.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }\`}
                      >
                        <input
                          type="radio"
                          name="report-type"
                          value={option.value}
                          checked={reportType === option.value}
                          onChange={(e) => setReportType(e.target.value)}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-neutral-900">
                            {option.icon} {option.label}
                          </p>
                          <p className="text-sm text-neutral-600">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Plage de Dates *
                    </label>
                    <div className="space-y-2">
                      <Input
                        label="Du"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input
                        label="Au"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <Select
                    label="Format d'Exportation"
                    options={[
                      { value: 'pdf', label: 'PDF' },
                      { value: 'excel', label: 'Excel (XLSX)' },
                      { value: 'csv', label: 'CSV' },
                    ]}
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              icon={<BarChart3 size={20} />}
              onClick={handleGenerateReport}
              disabled={isGenerating}
              fullWidth
            >
              {isGenerating ? 'Génération...' : 'Générer le Rapport'}
            </Button>
          </CardFooter>
        </Card>

        {generatedReports.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Historique de vos rapports (Local)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedReports.map((report) => (
                <Card key={report.id} hover>
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{getFormatIcon(report.format)}</span>
                        <div>
                          <h4 className="font-semibold text-neutral-900">{report.name}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{report.generatedAt}</p>
                        </div>
                      </div>
                      <Badge variant="info">{report.format.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">Taille estimée : {report.fileSize}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
`;

fs.writeFileSync('frontend/src/pages/ReportsPage.tsx', replacement.trim() + '\n');
console.log("ReportsPage.tsx completely rewritten!");
