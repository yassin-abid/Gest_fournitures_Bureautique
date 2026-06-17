/**
 * Stock Movements Page - Stock Module
 * Track stock in/out and adjustments — Enhanced for Gestionnaire de Stock
 */

import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Wrench, Plus, AlertTriangle, CheckCircle, FileDown } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select, Input, Textarea } from '@components/FormInputs';
import { Modal } from '@components/Modal';
import type { StockMovement } from '@/types/stock';

type ModalMode = 'entree' | 'anomalie' | null;

export const StockMovementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formArticle, setFormArticle] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formRef, setFormRef] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const articleOptions = [
    { value: 'Papier A4 (500 feuilles)', label: 'Papier A4 (500 feuilles)' },
    { value: 'Stylo Bille (Bleu)', label: 'Stylo Bille (Bleu)' },
    { value: 'Chemise Classeur (Jaune)', label: 'Chemise Classeur (Jaune)' },
    { value: 'Agrafeuse de Bureau', label: 'Agrafeuse de Bureau' },
    { value: 'Ruban Adhésif (12mm)', label: 'Ruban Adhésif (12mm)' },
    { value: 'Colle en Bâton', label: 'Colle en Bâton' },
    { value: 'Toner Laser HP 85A', label: 'Toner Laser HP 85A' },
  ];

  const [mockMovements, setMockMovements] = useState<StockMovement[]>([
    { id: 'mov-001', articleId: 'art-001', articleName: 'Papier A4 (500 feuilles)', movementType: 'in', quantity: 100, reference: 'ORD-001', reason: 'Bon de Commande', notes: 'Livraison reçue de Office Pro', userId: 'user-001', userName: 'Mourad Gharbi', createdAt: '2024-06-10 14:30' },
    { id: 'mov-002', articleId: 'art-002', articleName: 'Stylo Bille (Bleu)', movementType: 'out', quantity: 25, reference: 'REQ-001', reason: 'Demande de Fournitures', notes: 'Distribué au Dpt. Commercial', userId: 'user-002', userName: 'Mourad Gharbi', createdAt: '2024-06-10 11:15' },
    { id: 'mov-003', articleId: 'art-003', articleName: 'Chemise Classeur (Jaune)', movementType: 'adjustment', quantity: -5, reference: 'INV-001', reason: 'Inventaire', notes: 'Endommagé lors de la manutention', userId: 'user-003', userName: 'Mourad Gharbi', createdAt: '2024-06-09 16:45' },
    { id: 'mov-004', articleId: 'art-004', articleName: 'Agrafeuse de Bureau', movementType: 'in', quantity: 10, reference: 'ORD-002', reason: 'Bon de Commande', notes: 'Réapprovisionnement fournisseur', userId: 'user-001', userName: 'Mourad Gharbi', createdAt: '2024-06-09 10:20' },
    { id: 'mov-005', articleId: 'art-007', articleName: 'Toner Laser HP 85A', movementType: 'adjustment', quantity: -3, reference: 'ANOM-001', reason: 'Anomalie — Casse', notes: 'Cartouches défectueuses à la réception', userId: 'user-003', userName: 'Mourad Gharbi', createdAt: '2024-06-08 13:00' },
    { id: 'mov-006', articleId: 'art-001', articleName: 'Papier A4 (500 feuilles)', movementType: 'adjustment', quantity: 3, reference: 'ADJ-001', reason: 'Correction d\'inventaire', notes: 'Stock trouvé lors de l\'audit', userId: 'user-003', userName: 'Mourad Gharbi', createdAt: '2024-06-07 09:30' },
  ]);

  const filteredMovements = useMemo(() => {
    return mockMovements.filter((movement) => {
      const matchesSearch =
        (movement.articleName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (movement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = !selectedType || movement.movementType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType, mockMovements]);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in': return <ArrowUp size={14} />;
      case 'out': return <ArrowDown size={14} />;
      case 'adjustment': return <Wrench size={14} />;
      default: return null;
    }
  };

  const getMovementVariant = (type: string) => {
    switch (type) {
      case 'in': return 'success';
      case 'out': return 'warning';
      case 'adjustment': return 'info';
      default: return 'primary';
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'in': return 'Entrée';
      case 'out': return 'Sortie';
      case 'adjustment': return 'Ajustement';
      default: return type;
    }
  };

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setFormArticle('');
    setFormQty('');
    setFormRef('');
    setFormReason('');
    setFormNotes('');
  };

  const handleConfirm = () => {
    if (!formArticle || !formQty) { alert('Veuillez remplir tous les champs obligatoires'); return; }
    const qty = parseInt(formQty);
    if (isNaN(qty) || qty <= 0) { alert('Quantité invalide'); return; }

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      articleId: `art-${Date.now()}`,
      articleName: formArticle,
      movementType: modalMode === 'entree' ? 'in' : 'adjustment',
      quantity: modalMode === 'entree' ? qty : -qty,
      reference: formRef || `${modalMode === 'entree' ? 'REC' : 'ANOM'}-${Date.now()}`,
      reason: formReason || (modalMode === 'entree' ? 'Réception de commande' : 'Anomalie signalée'),
      notes: formNotes,
      userId: 'usr-stock',
      userName: 'Mourad Gharbi',
      createdAt: new Date().toLocaleString('fr-FR'),
    };

    setMockMovements(prev => [newMovement, ...prev]);
    const msg = modalMode === 'entree' ? 'Entrée de stock enregistrée' : 'Anomalie signalée';
    setSuccessMessage(`✅ ${msg} avec succès pour "${formArticle}".`);
    setTimeout(() => setSuccessMessage(''), 4000);
    setModalMode(null);
  };

  const handleExport = (format: string) => {
    setSuccessMessage(`✅ Export ${format.toUpperCase()} de l'historique des mouvements généré avec succès.`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const columns = [
    { key: 'articleName' as const, label: 'Article', sortable: true },
    {
      key: 'movementType' as const,
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={getMovementVariant(value)} size="md">
          {getMovementIcon(value)}
          <span className="ml-1">{getMovementLabel(value)}</span>
        </Badge>
      ),
    },
    {
      key: 'quantity' as const,
      label: 'Quantité',
      sortable: true,
      width: '100px',
      render: (value: number) => (
        <span className={`font-bold ${value < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {value > 0 ? '+' : ''}{value}
        </span>
      ),
    },
    { key: 'reference' as const, label: 'Référence', sortable: true },
    { key: 'reason' as const, label: 'Raison', sortable: false },
    { key: 'userName' as const, label: 'Utilisateur', sortable: true },
    { key: 'createdAt' as const, label: 'Date & Heure', sortable: true },
  ];

  const inCount = filteredMovements.filter((m) => m.movementType === 'in').length;
  const outCount = filteredMovements.filter((m) => m.movementType === 'out').length;
  const adjustmentCount = filteredMovements.filter((m) => m.movementType === 'adjustment').length;

  return (
    <MainLayout title="Mouvements de Stock">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Mouvements de Stock</h2>
            <p className="text-neutral-600 mt-2">Enregistrez les entrées, signalez les anomalies et consultez l'historique complet</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => openModal('entree')}>
              Enregistrer une Entrée
            </Button>
            <Button variant="danger" icon={<AlertTriangle size={18} />} onClick={() => openModal('anomalie')}>
              Signaler une Anomalie
            </Button>
          </div>
        </div>

        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-medium">
            <CheckCircle size={20} className="text-green-600 shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-5 text-center">
            <p className="text-sm text-on-surface-variant font-medium">Total</p>
            <p className="text-3xl font-bold text-on-surface mt-1">{filteredMovements.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-1">
              <ArrowUp size={20} className="text-green-600" />
            </div>
            <p className="text-sm text-green-700 font-medium">Entrées</p>
            <p className="text-2xl font-bold text-green-700">{inCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-1">
              <ArrowDown size={20} className="text-amber-600" />
            </div>
            <p className="text-sm text-amber-700 font-medium">Sorties</p>
            <p className="text-2xl font-bold text-amber-700">{outCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-1">
              <Wrench size={20} className="text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 font-medium">Ajustements</p>
            <p className="text-2xl font-bold text-blue-700">{adjustmentCount}</p>
          </div>
        </div>

        {/* Export Bar */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-900">Exporter l'Historique des Mouvements</p>
                <p className="text-sm text-neutral-500">Générez un rapport PDF ou Excel de l'historique complet</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={<FileDown size={16} />} onClick={() => handleExport('pdf')}>
                  Export PDF
                </Button>
                <Button variant="secondary" size="sm" icon={<FileDown size={16} />} onClick={() => handleExport('excel')}>
                  Export Excel
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput placeholder="Rechercher par article ou référence..." onSearch={setSearchTerm} />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Tous les types' },
                    { value: 'in', label: 'Entrée de Stock' },
                    { value: 'out', label: 'Sortie de Stock' },
                    { value: 'adjustment', label: 'Ajustement / Anomalie' },
                  ]}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full md:w-48"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date de début</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date de fin</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Historique des Mouvements (${filteredMovements.length})`} />
          <CardBody>
            <DataTable<StockMovement>
              columns={columns}
              data={filteredMovements}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>

      {/* Entry Modal */}
      {modalMode === 'entree' && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title="📦 Enregistrer une Entrée de Stock"
          onConfirm={handleConfirm}
          confirmText="Enregistrer l'entrée"
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">Enregistrez la réception d'une commande ou d'un réapprovisionnement.</p>
            <Select
              label="Article *"
              options={[{ value: '', label: 'Sélectionner un article...' }, ...articleOptions]}
              value={formArticle}
              onChange={(e) => setFormArticle(e.target.value)}
            />
            <Input label="Quantité reçue *" type="number" min="1" placeholder="ex: 50" value={formQty} onChange={(e) => setFormQty(e.target.value)} />
            <Input label="Référence bon de commande" placeholder="ex: ORD-012" value={formRef} onChange={(e) => setFormRef(e.target.value)} />
            <Textarea label="Notes (optionnel)" rows={2} placeholder="Livraison reçue de..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>
        </Modal>
      )}

      {/* Anomaly Modal */}
      {modalMode === 'anomalie' && (
        <Modal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title="⚠️ Signaler une Anomalie de Stock"
          onConfirm={handleConfirm}
          confirmText="Signaler l'anomalie"
        >
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ Cette action créera un mouvement d'ajustement négatif et un rapport d'anomalie.
            </div>
            <Select
              label="Article concerné *"
              options={[{ value: '', label: 'Sélectionner un article...' }, ...articleOptions]}
              value={formArticle}
              onChange={(e) => setFormArticle(e.target.value)}
            />
            <Input label="Quantité concernée *" type="number" min="1" placeholder="Nombre d'articles perdus/cassés" value={formQty} onChange={(e) => setFormQty(e.target.value)} />
            <Select
              label="Type d'anomalie *"
              options={[
                { value: '', label: 'Sélectionner...' },
                { value: 'Perte / Vol', label: 'Perte / Vol' },
                { value: 'Casse / Dommage', label: 'Casse / Dommage' },
                { value: 'Péremption', label: 'Péremption' },
                { value: "Erreur d'inventaire", label: "Erreur d'inventaire" },
              ]}
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
            />
            <Textarea label="Description de l'anomalie *" rows={3} placeholder="Décrivez l'anomalie constatée..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
          </div>
        </Modal>
      )}
    </MainLayout>
  );
};
