/**
 * System Logs Page - Admin Module
 * View system activity logs and audit trails
 */

import React, { useState, useMemo } from 'react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details: string;
}

export const SystemLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  const mockLogs: LogEntry[] = [
    {
      id: 'log-001',
      timestamp: '2024-06-11 10:45:12',
      user: 'Sonia Ben Ali',
      action: 'Approbation Demande',
      module: 'Demandes',
      severity: 'info',
      details: 'Demande REQ-002 approuvée',
    },
    {
      id: 'log-002',
      timestamp: '2024-06-11 09:30:00',
      user: 'Mourad Gharbi',
      action: 'Ajustement Stock',
      module: 'Stock',
      severity: 'warning',
      details: 'Ajustement manuel: Papier A4 (-5)',
    },
    {
      id: 'log-003',
      timestamp: '2024-06-11 08:15:22',
      user: 'Système',
      action: 'Sauvegarde',
      module: 'Système',
      severity: 'info',
      details: 'Sauvegarde automatique réussie (450MB)',
    },
    {
      id: 'log-004',
      timestamp: '2024-06-10 16:20:05',
      user: 'Karim Administrateur',
      action: 'Modification Utilisateur',
      module: 'Administration',
      severity: 'warning',
      details: 'Changement de rôle pour user-005 (Employé -> Responsable)',
    },
    {
      id: 'log-005',
      timestamp: '2024-06-10 14:10:00',
      user: 'Inconnu',
      action: 'Tentative de Connexion Échouée',
      module: 'Authentification',
      severity: 'error',
      details: '3 tentatives échouées pour resp.achats@hammemi.com',
    },
    {
      id: 'log-006',
      timestamp: '2024-06-10 11:05:45',
      user: 'Leila Mansour',
      action: 'Création Commande',
      module: 'Achats',
      severity: 'info',
      details: 'Nouvelle commande fournisseur ORD-042 (Lyreco)',
    },
  ];

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModule = !selectedModule || log.module === selectedModule;
      const matchesSeverity = !selectedSeverity || log.severity === selectedSeverity;
      return matchesSearch && matchesModule && matchesSeverity;
    });
  }, [searchTerm, selectedModule, selectedSeverity]);

  const columns = [
    {
      key: 'timestamp' as const,
      label: 'Date & Heure',
      sortable: true,
      width: '180px',
    },
    {
      key: 'severity' as const,
      label: 'Niveau',
      sortable: true,
      width: '120px',
      render: (value: string) => {
        const variantMap: Record<string, any> = {
          info: 'primary',
          warning: 'warning',
          error: 'danger',
          critical: 'danger',
        };
        const labels: Record<string, string> = {
          info: 'Info',
          warning: 'Alerte',
          error: 'Erreur',
          critical: 'Critique',
        };
        return <Badge variant={variantMap[value]}>{labels[value]}</Badge>;
      },
    },
    {
      key: 'module' as const,
      label: 'Module',
      sortable: true,
      width: '150px',
    },
    {
      key: 'user' as const,
      label: 'Utilisateur',
      sortable: true,
      width: '180px',
    },
    {
      key: 'action' as const,
      label: 'Action',
      sortable: true,
      width: '200px',
    },
    {
      key: 'details' as const,
      label: 'Détails',
      sortable: false,
    },
  ];

  return (
    <MainLayout title="Journaux Système (Logs)">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Journaux d'Activité</h2>
          <p className="text-neutral-600 mt-2">Consultez l'historique complet des actions effectuées sur le système</p>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Rechercher (utilisateur, action, détail)..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les Modules' },
                  { value: 'Authentification', label: 'Authentification' },
                  { value: 'Administration', label: 'Administration' },
                  { value: 'Stock', label: 'Stock' },
                  { value: 'Demandes', label: 'Demandes' },
                  { value: 'Achats', label: 'Achats' },
                  { value: 'Système', label: 'Système' },
                ]}
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full md:w-48"
              />
              <Select
                options={[
                  { value: '', label: 'Toutes Sévérités' },
                  { value: 'info', label: 'Info' },
                  { value: 'warning', label: 'Alerte' },
                  { value: 'error', label: 'Erreur' },
                ]}
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardBody>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader title={`Derniers événements (${filteredLogs.length})`} />
          <CardBody>
            <DataTable<LogEntry>
              columns={columns}
              data={filteredLogs}
              rowKey="id"
              pageSize={15}
            />
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};

SystemLogsPage.displayName = 'SystemLogsPage';
