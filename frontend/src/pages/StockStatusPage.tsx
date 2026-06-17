/**
 * Stock Status Page - Stock Module
 * Monitor stock levels with status indicators
 * Enhanced for Gestionnaire de Stock role
 */

import React, { useState, useMemo } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Package, Plus, ArrowDownCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select, Input, Textarea } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { Modal } from '@components/Modal';
import type { StockStatus } from '@/types/stock';

type ModalMode = 'ajuster' | 'entree' | 'anomalie' | null;

export const StockStatusPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<StockStatus | null>(null);
  const [formQty, setFormQty] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formRef, setFormRef] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [mockStockData, setMockStockData] = useState<StockStatus[]>([
    { id: 'stock-001', articleId: 'art-001', code: 'OFF-001', name: 'Papier A4 (500 feuilles)', currentStock: 450, minStock: 100, maxStock: 500, unit: 'Rame', status: 'normal', lastMovement: '2024-06-10 14:30', updatedAt: '2024-06-10' },
    { id: 'stock-002', articleId: 'art-002', code: 'PEN-001', name: 'Stylo Bille (Bleu)', currentStock: 75, minStock: 50, maxStock: 200, unit: 'Boîte', status: 'normal', lastMovement: '2024-06-09 10:15', updatedAt: '2024-06-09' },
    { id: 'stock-003', articleId: 'art-003', code: 'FOLDER-001', name: 'Chemise Classeur (Jaune)', currentStock: 45, minStock: 80, maxStock: 300, unit: 'Pack', status: 'low', lastMovement: '2024-06-08 09:45', updatedAt: '2024-06-08' },
    { id: 'stock-004', articleId: 'art-004', code: 'STAPLER-001', name: 'Agrafeuse de Bureau', currentStock: 8, minStock: 5, maxStock: 30, unit: 'Pièce', status: 'critical', lastMovement: '2024-06-07 16:20', updatedAt: '2024-06-07' },
    { id: 'stock-005', articleId: 'art-005', code: 'TAPE-001', name: 'Ruban Adhésif (12mm)', currentStock: 520, minStock: 100, maxStock: 500, unit: 'Rouleau', status: 'excess', lastMovement: '2024-06-06 11:00', updatedAt: '2024-06-06' },
    { id: 'stock-006', articleId: 'art-006', code: 'GLUE-001', name: 'Colle en Bâton', currentStock: 65, minStock: 80, maxStock: 250, unit: 'Boîte', status: 'low', lastMovement: '2024-06-05 13:30', updatedAt: '2024-06-05' },
    { id: 'stock-007', articleId: 'art-007', code: 'TONER-001', name: 'Toner Laser HP 85A', currentStock: 2, minStock: 10, maxStock: 40, unit: 'Cartouche', status: 'critical', lastMovement: '2024-06-04 08:00', updatedAt: '2024-06-04' },
  ]);

  const filteredStock = useMemo(() => {
    return mockStockData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus, mockStockData]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'low': return 'warning';
      case 'critical': return 'danger';
      case 'excess': return 'info';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <Package size={14} />;
      case 'low': return <TrendingDown size={14} />;
      case 'critical': return <AlertTriangle size={14} />;
      case 'excess': return <TrendingUp size={14} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Stock Bas';
      case 'critical': return 'Critique';
      case 'excess': return 'Excédentaire';
      default: return status;
    }
  };

  const openModal = (mode: ModalMode, item: StockStatus) => {
    setSelectedItem(item);
    setModalMode(mode);
    setFormQty('');
    setFormReason('');
    setFormNotes('');
    setFormRef('');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const computeNewStatus = (qty: number, min: number, max: number): StockStatus['status'] => {
    if (qty <= 0) return 'critical';
    if (qty < min) return qty < min * 0.5 ? 'critical' : 'low';
    if (qty > max) return 'excess';
    return 'normal';
  };

  const handleConfirmModal = () => {
    if (!selectedItem || !formQty) return;
    const qty = parseInt(formQty);
    if (isNaN(qty) || qty <= 0) { alert('Quantité invalide'); return; }

    setMockStockData(prev => prev.map(item => {
      if (item.id !== selectedItem.id) return item;
      let newStock = item.currentStock;
      if (modalMode === 'entree') newStock += qty;
      else if (modalMode === 'ajuster') newStock = qty;
      else if (modalMode === 'anomalie') newStock = Math.max(0, item.currentStock - qty);
      const newStatus = computeNewStatus(newStock, item.minStock, item.maxStock);
      return { ...item, currentStock: newStock, status: newStatus, lastMovement: new Date().toLocaleString('fr-FR'), updatedAt: new Date().toISOString().split('T')[0] };
    }));

    const labels: Record<NonNullable<ModalMode>, string> = { entree: 'Entrée de stock enregistrée', ajuster: 'Stock ajusté', anomalie: 'Anomalie signalée' };
    setSuccessMessage(`✅ ${labels[modalMode!]} avec succès pour "${selectedItem.name}".`);
    setTimeout(() => setSuccessMessage(''), 4000);
    closeModal();
  };

  const modalTitles: Record<NonNullable<ModalMode>, string> = {
    entree: '📦 Enregistrer une Entrée de Stock',
    ajuster: '⚖️ Ajuster le Niveau de Stock',
    anomalie: '⚠️ Signaler une Anomalie de Stock',
  };

  const columns = [
    { key: 'code' as const, label: 'Code', sortable: true, width: '90px' },
    { key: 'name' as const, label: 'Article', sortable: true },
    {
      key: 'currentStock' as const,
      label: 'Stock Actuel',
      sortable: true,
      render: (value: number, row: StockStatus) => (
        <div>
          <p className="font-bold text-neutral-900">{value} <span className="font-normal text-neutral-500 text-xs">{row.unit}</span></p>
          <div className="mt-1 h-1.5 w-24 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${row.status === 'critical' || row.status === 'low' ? 'bg-red-500' : row.status === 'excess' ? 'bg-blue-400' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (value / row.maxStock) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Min: {row.minStock} / Max: {row.maxStock}</p>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '140px',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)} size="md">
          {getStatusIcon(value)}
          <span className="ml-1">{getStatusLabel(value)}</span>
        </Badge>
      ),
    },
    { key: 'lastMovement' as const, label: 'Dernier Mouvement', sortable: true },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '280px',
      render: (_value: string, row: StockStatus) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => openModal('entree', row)}>
            Entrée
          </Button>
          <Button variant="secondary" size="sm" icon={<ArrowDownCircle size={14} />} onClick={() => openModal('ajuster', row)}>
            Ajuster
          </Button>
          <Button variant="danger" size="sm" icon={<AlertCircle size={14} />} onClick={() => openModal('anomalie', row)}>
            Anomalie
          </Button>
        </div>
      ),
    },
  ];

  const criticalCount = mockStockData.filter((s) => s.status === 'critical').length;
  const lowCount = mockStockData.filter((s) => s.status === 'low').length;
  const excessCount = mockStockData.filter((s) => s.status === 'excess').length;
  const normalCount = mockStockData.filter((s) => s.status === 'normal').length;

  return (
    <MainLayout title="État du Stock">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">État du Stock</h2>
            <p className="text-neutral-600 mt-2">Surveillez, mettez à jour et signalez les niveaux de stock en temps réel</p>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-medium">
            <CheckCircle size={20} className="text-green-600 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-red-100 mb-2">
              <AlertTriangle size={22} className="text-red-600" />
            </div>
            <p className="text-sm text-red-700 font-medium">Critique</p>
            <p className="text-3xl font-bold text-red-700 mt-1">{criticalCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 mb-2">
              <TrendingDown size={22} className="text-amber-600" />
            </div>
            <p className="text-sm text-amber-700 font-medium">Stock Bas</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">{lowCount}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-green-100 mb-2">
              <Package size={22} className="text-green-600" />
            </div>
            <p className="text-sm text-green-700 font-medium">Normal</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{normalCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 mb-2">
              <TrendingUp size={22} className="text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 font-medium">Excédentaire</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{excessCount}</p>
          </div>
        </div>

        {/* Alerts */}
        {criticalCount > 0 && (
          <Alert type="error" closable>
            🚨 {criticalCount} article(s) en stock critique ! Action immédiate requise.
          </Alert>
        )}
        {lowCount > 0 && (
          <Alert type="warning" closable>
            ⚠️ {lowCount} article(s) en dessous du seuil minimum. Prévoyez un réapprovisionnement.
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput placeholder="Rechercher par nom d'article ou code..." onSearch={setSearchTerm} />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'low', label: 'Stock Bas' },
                  { value: 'critical', label: 'Critique' },
                  { value: 'excess', label: 'Excédentaire' },
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Articles en Stock (${filteredStock.length})`} />
          <CardBody>
            <DataTable<StockStatus>
              columns={columns}
              data={filteredStock}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>

      {/* Action Modal */}
      {selectedItem && modalMode && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalTitles[modalMode]}
          onConfirm={handleConfirmModal}
          confirmText={modalMode === 'entree' ? 'Enregistrer l\'entrée' : modalMode === 'ajuster' ? 'Appliquer' : 'Signaler l\'anomalie'}
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <p className="font-semibold text-neutral-900">{selectedItem.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                <span>Stock actuel : <strong className="text-neutral-900">{selectedItem.currentStock} {selectedItem.unit}</strong></span>
                <span>Min : {selectedItem.minStock}</span>
                <span>Max : {selectedItem.maxStock}</span>
              </div>
            </div>

            {modalMode === 'entree' && (
              <>
                <Input
                  label="Quantité reçue *"
                  type="number"
                  min="1"
                  placeholder="ex: 50"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                />
                <Input
                  label="Référence bon de commande"
                  placeholder="ex: ORD-012"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                />
                <Textarea
                  label="Notes (optionnel)"
                  rows={2}
                  placeholder="Livraison reçue de..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </>
            )}

            {modalMode === 'ajuster' && (
              <>
                <Input
                  label="Nouveau niveau de stock *"
                  type="number"
                  min="0"
                  placeholder="Saisir le stock réel après inventaire"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                />
                <Select
                  label="Raison de l'ajustement *"
                  options={[
                    { value: '', label: 'Sélectionner...' },
                    { value: 'inventaire', label: 'Inventaire physique' },
                    { value: 'correction', label: 'Correction d\'erreur' },
                    { value: 'reception', label: 'Réception partielle' },
                  ]}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                />
                <Textarea
                  label="Notes"
                  rows={2}
                  placeholder="Raison de cet ajustement..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </>
            )}

            {modalMode === 'anomalie' && (
              <>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  ⚠️ Cette action va réduire le stock de la quantité indiquée et créer un signalement d'anomalie.
                </div>
                <Input
                  label="Quantité concernée *"
                  type="number"
                  min="1"
                  placeholder="Nombre d'articles perdus/cassés"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                />
                <Select
                  label="Type d'anomalie *"
                  options={[
                    { value: '', label: 'Sélectionner...' },
                    { value: 'perte', label: 'Perte / Vol' },
                    { value: 'casse', label: 'Casse / Dommage' },
                    { value: 'peremption', label: 'Péremption' },
                    { value: 'erreur', label: 'Erreur d\'inventaire' },
                  ]}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                />
                <Textarea
                  label="Description de l'anomalie *"
                  rows={3}
                  placeholder="Décrivez l'anomalie constatée..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                />
              </>
            )}
          </div>
        </Modal>
      )}
    </MainLayout>
  );
};
