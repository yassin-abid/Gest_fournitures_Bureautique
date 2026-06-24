/**
 * Stock Alerts Page - Stock Module
 * Manage stock alerts and warnings
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Zap, Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Modal } from '@components/Modal';
import type { StockAlert } from '@/types/stock';
import { stockService } from '@services/stockService';

export const StockAlertsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlertType, setSelectedAlertType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);

  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await stockService.getAlerts(1, 1000, '');
      setAlerts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch = (alert.articleName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = !selectedAlertType || alert.alertType === selectedAlertType;
      const matchesStatus = !selectedStatus || alert.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedAlertType, selectedStatus, alerts]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low':
        return <AlertTriangle size={16} />;
      case 'high':
        return <Zap size={16} />;
      case 'critical':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'low':
        return 'warning';
      case 'high':
        return 'info';
      case 'critical':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case 'low': return 'Stock Bas';
      case 'high': return 'Stock Élevé';
      case 'critical': return 'Critique';
      default: return type;
    }
  };

  const columns = [
    {
      key: 'articleName' as const,
      label: 'Article',
      sortable: true,
    },
    {
      key: 'currentStock' as const,
      label: 'Current Stock',
      sortable: true,
      width: '120px',
      render: (value: number, row: StockAlert) => (
        <div>
          <p className="font-medium text-neutral-900">{value}</p>
          <p className="text-xs text-neutral-600">Min: {row.minStock}, Max: {row.maxStock}</p>
        </div>
      ),
    },
    {
      key: 'alertType' as const,
      label: 'Type d\'Alerte',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={getAlertVariant(value)} size="md">
          {getAlertIcon(value)}
          <span className="ml-1">
            {getAlertLabel(value)}
          </span>
        </Badge>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'danger' : 'success'}>
          {value === 'active' ? 'Active' : 'Résolue'}
        </Badge>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Créé le',
      sortable: true,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '150px',
      render: (_value: string, row: StockAlert) => (
        <Button
          variant={row.status === 'active' ? 'primary' : 'ghost'}
          size="sm"
          disabled={row.status === 'resolved'}
          onClick={() => {
            setSelectedAlert(row);
            setIsResolveModalOpen(true);
          }}
        >
          {row.status === 'active' ? 'Résoudre' : 'Résolue'}
        </Button>
      ),
    },
  ];

  const activeAlerts = filteredAlerts.filter((a) => a.status === 'active').length;
  const resolvedAlerts = filteredAlerts.filter((a) => a.status === 'resolved').length;
  const criticalAlerts = filteredAlerts.filter((a) => a.alertType === 'critical').length;

  const handleResolveAlert = async () => {
    if (!selectedAlert) return;
    try {
      await stockService.resolveAlert(selectedAlert.id);
      fetchAlerts();
      setIsResolveModalOpen(false);
      setSelectedAlert(null);
    } catch (e: any) {
      console.error(e);
      alert("Erreur lors de la résolution de l'alerte: " + e.message);
    }
  };

  return (
    <MainLayout title="Alertes de Stock">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Alertes de Stock</h2>
          <p className="text-neutral-600 mt-2">Gérez les alertes et avertissements de stock</p>
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Alertes Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {filteredAlerts.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-2">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <p className="text-sm text-neutral-600">Actives</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{activeAlerts}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <p className="text-sm text-neutral-600">Résolues</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{resolvedAlerts}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 mb-2">
                  <Zap size={20} className="text-orange-600" />
                </div>
                <p className="text-sm text-neutral-600">Critiques</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{criticalAlerts}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Rechercher par nom d'article..."
                    onSearch={setSearchTerm}
                  />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Tous les types' },
                    { value: 'low', label: 'Stock Bas' },
                    { value: 'high', label: 'Stock Élevé' },
                    { value: 'critical', label: 'Critique' },
                  ]}
                  value={selectedAlertType}
                  onChange={(e) => setSelectedAlertType(e.target.value)}
                  className="w-full md:w-48"
                />
                <Select
                  options={[
                    { value: '', label: 'Tous les statuts' },
                    { value: 'active', label: 'Active' },
                    { value: 'resolved', label: 'Résolue' },
                  ]}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full md:w-48"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Alertes (${filteredAlerts.length})`} />
          <CardBody>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
                <p className="text-neutral-600">Aucune alerte à afficher</p>
              </div>
            ) : (
              <DataTable<StockAlert>
                columns={columns}
                data={filteredAlerts}
                rowKey="id"
                pageSize={10}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Resolve Modal */}
      {selectedAlert && (
        <Modal
          isOpen={isResolveModalOpen}
          onClose={() => {
            setIsResolveModalOpen(false);
            setSelectedAlert(null);
          }}
          title="Résoudre l'alerte"
          onConfirm={handleResolveAlert}
          confirmText="Marquer comme résolue"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {selectedAlert.articleName}
              </h3>
              <Badge variant={getAlertVariant(selectedAlert.alertType)} className="mt-2">
                {getAlertIcon(selectedAlert.alertType)}
                <span className="ml-1">
                  {getAlertLabel(selectedAlert.alertType)}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm text-neutral-600">Actuel</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {selectedAlert.currentStock}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Min</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {selectedAlert.minStock}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Max</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {selectedAlert.maxStock}
                </p>
              </div>
            </div>

            <p className="text-neutral-700">
              Êtes-vous sûr de vouloir marquer cette alerte comme résolue ? Vous pourrez créer une nouvelle alerte plus tard si nécessaire.
            </p>
          </div>
        </Modal>
      )}
    </MainLayout>
  );
};
