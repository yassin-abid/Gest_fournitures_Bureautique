/**
 * Reports Page - Reports Module
 * Overview and report generation
 */

import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import { Alert } from '@components/Alert';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  fileSize: string;
  format: string;
}

export const ReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState('2024-06-01');
  const [endDate, setEndDate] = useState('2024-06-10');
  const [reportType, setReportType] = useState('stock');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const mockGeneratedReports: GeneratedReport[] = [
    {
      id: 'rep-001',
      name: 'Rapport Mensuel de Stock - Juin 2024',
      type: 'stock',
      generatedAt: '2024-06-10 14:30',
      fileSize: '2.4 MB',
      format: 'pdf',
    },
    {
      id: 'rep-002',
      name: 'Analyse des Dépenses - T2 2024',
      type: 'spending',
      generatedAt: '2024-06-09 10:15',
      fileSize: '1.8 MB',
      format: 'excel',
    },
    {
      id: 'rep-003',
      name: 'Résumé des Demandes - Juin 2024',
      type: 'requests',
      generatedAt: '2024-06-08 16:45',
      fileSize: '0.6 MB',
      format: 'csv',
    },
    {
      id: 'rep-004',
      name: "Analyses d'Utilisation - Juin 2024",
      type: 'usage',
      generatedAt: '2024-06-07 09:20',
      fileSize: '3.2 MB',
      format: 'pdf',
    },
  ];

  const reportOptions = [
    {
      value: 'stock',
      label: 'Rapport de Stock',
      description: "Niveaux d'inventaire actuels et mouvements",
      icon: '📦',
    },
    {
      value: 'requests',
      label: 'Rapport de Demandes',
      description: "Demandes de fournitures et statut d'approbation",
      icon: '📋',
    },
    {
      value: 'orders',
      label: 'Rapport de Commandes',
      description: 'Bons de commande et statut de livraison',
      icon: '🛒',
    },
    {
      value: 'spending',
      label: 'Rapport de Dépenses',
      description: 'Analyse du budget et dépenses fournisseurs',
      icon: '💰',
    },
    {
      value: 'usage',
      label: "Rapport d'Utilisation",
      description: 'Articles les plus utilisés et utilisation par département',
      icon: '📊',
    },
  ];

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert('Veuillez sélectionner les dates de début et de fin');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(`${reportOptions.find((r) => r.value === reportType)?.label} généré avec succès !`);
    }, 2000);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return '📄';
      case 'excel':
        return '📊';
      case 'csv':
        return '📋';
      default:
        return '📎';
    }
  };

  return (
    <MainLayout title="Rapports">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Rapports</h2>
          <p className="text-neutral-600 mt-2">Générez et téléchargez divers rapports</p>
        </div>

        {/* Report Generator */}
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
                        className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          reportType === option.value
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
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
                    onChange={(e) => setExportFormat(e.target.value)}
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
              isLoading={isGenerating}
              fullWidth
            >
              Générer le Rapport
            </Button>
          </CardFooter>
        </Card>

        {/* Previously Generated Reports */}
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-4">Rapports Précédemment Générés</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockGeneratedReports.map((report) => (
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
                  <p className="text-sm text-neutral-600 mb-3">Taille : {report.fileSize}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Download size={16} />}
                    fullWidth
                  >
                    Télécharger
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <FileText size={32} className="mx-auto text-primary-600 mb-2" />
                <p className="text-sm text-neutral-600">Rapports Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockGeneratedReports.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <Download size={32} className="mx-auto text-green-600 mb-2" />
                <p className="text-sm text-neutral-600">Ce Mois-ci</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">4</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <Calendar size={32} className="mx-auto text-amber-600 mb-2" />
                <p className="text-sm text-neutral-600">Dernier Généré</p>
                <p className="text-lg font-bold text-neutral-900 mt-2">
                  {mockGeneratedReports[0]?.generatedAt.split(' ')[0]}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
