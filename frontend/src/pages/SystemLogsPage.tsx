/**
 * System Logs Page - Admin Module
 * View system activity logs and audit trails
 */

import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '@services/adminService';
import type { AuditLog } from '@/types/admin';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';



export const SystemLogsPage: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminService.getAuditLogs(1, 100);
        setLogs(res.data);
      } catch (err) {
        console.error("Erreur de chargement des logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);


  const formatDetails = (details: string | null) => {
    if (!details) return <span className="text-neutral-400 italic">Aucun détail</span>;
    try {
      const parsed = JSON.parse(details);
      if (typeof parsed === 'object' && parsed !== null) {
        
        if (parsed.oldValues || parsed.newValues) {
          return (
            <div className="flex flex-col gap-2 text-xs">
              {parsed.oldValues && Object.keys(parsed.oldValues).length > 0 && (
                <div className="bg-red-50 text-red-800 p-2 rounded border border-red-100">
                  <div className="font-bold mb-1 border-b border-red-200 pb-1">Avant modification :</div>
                  {Object.entries(parsed.oldValues).map(([k, v]) => {
                    if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
                    const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
                    return <div key={k}><span className="font-semibold">{k}:</span> <span>{valStr}</span></div>;
                  })}
                </div>
              )}
              {parsed.newValues && Object.keys(parsed.newValues).length > 0 && (
                <div className="bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100">
                  <div className="font-bold mb-1 border-b border-emerald-200 pb-1">Après modification :</div>
                  {Object.entries(parsed.newValues).map(([k, v]) => {
                    if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
                    const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
                    return <div key={k}><span className="font-semibold">{k}:</span> <span>{valStr}</span></div>;
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-1 text-xs bg-surface-container-lowest p-2 rounded border border-outline-variant">
            {Object.entries(parsed).map(([k, v]) => {
              if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
              const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
              return <div key={k}><span className="font-semibold text-neutral-700">{k}:</span> <span className="text-neutral-600">{valStr}</span></div>;
            })}
          </div>
        );
      }
      return details;
    } catch {
      return details;
    }
  };

  const formatAction = (action: string) => {
    const map: Record<string, string> = {
      'create': 'Création',
      'update': 'Modification',
      'delete': 'Suppression',
      'login': 'Connexion',
      'logout': 'Déconnexion',
      'approve': 'Approbation',
      'reject': 'Rejet',
      'cancel': 'Annulation',
      'submit': 'Soumission',
      'confirm': 'Confirmation',
      'ship': 'Expédition',
      'receive': 'Réception',
    };
    return map[action] || action;
  };
  
  const formatEntity = (entity: string) => {
    const map: Record<string, string> = {
      'User': 'Utilisateur',
      'SupplyRequest': 'Demande',
      'Order': 'Commande',
      'StockAdjustment': 'Stock',
      'Settings': 'Paramètres',
    };
    return map[entity] || entity;
  };

  const getSeverity = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('hard')) return 'error';
    if (a.includes('cancel') || a.includes('reject') || a.includes('deactivate') || a.includes('update')) return 'warning';
    return 'info';
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logUser = log.userName || 'Inconnu';
      const logAction = log.action || '';
      const logDetails = log.details || '';
      
      const matchesSearch =
        logUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logDetails.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesModule = !selectedModule || log.entity === selectedModule;
      
      const severity = getSeverity(logAction);
      const matchesSeverity = !selectedSeverity || severity === selectedSeverity;
      
      return matchesSearch && matchesModule && matchesSeverity;
    });
  }, [logs, searchTerm, selectedModule, selectedSeverity]);

  const columns = [
    {
      key: 'timestamp' as const,
      label: 'Date & Heure',
      sortable: true,
      width: '180px',
    },
    {
      key: 'action' as const,
      label: 'Niveau',
      sortable: true,
      width: '120px',
      render: (value: string) => {
        const severity = getSeverity(value);
        const variantMap: Record<string, any> = {
          info: 'primary',
          warning: 'warning',
          error: 'danger',
        };
        const labels: Record<string, string> = {
          info: 'Info',
          warning: 'Alerte',
          error: 'Erreur',
        };
        return <Badge variant={variantMap[severity]}>{labels[severity]}</Badge>;
      },
    },
    {
      key: 'entity' as const,
      render: (val: string) => formatEntity(val),
      label: 'Module',
      sortable: true,
      width: '150px',
    },
    {
      key: 'userName' as const,
      label: 'Utilisateur',
      sortable: true,
      width: '180px',
    },
    {
      key: 'action' as const,
      render: (val: string) => formatAction(val),
      label: 'Action',
      sortable: true,
      width: '200px',
    },
    {
      key: 'details' as const,
      label: 'Détails',
      sortable: false,
      render: (val: string) => formatDetails(val),
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
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : (
              <DataTable<AuditLog>
              columns={columns}
              data={filteredLogs}
              rowKey="id"
              pageSize={15}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};

SystemLogsPage.displayName = 'SystemLogsPage';
