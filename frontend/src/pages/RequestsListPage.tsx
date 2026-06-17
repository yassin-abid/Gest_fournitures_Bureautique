/**
 * Requests List Page - Requests Module
 * Show all supply requests
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, Send, PackageCheck, Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { Modal } from '@components/Modal';
import { useAuth } from '@hooks/useAuth';
import type { SupplyRequest } from '@/types/requests';

export const RequestsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const mockRequests: SupplyRequest[] = [
    {
      id: 'req-001',
      requestNumber: 'REQ-001',
      userId: 'usr-emp',
      userName: 'Youssef Trabelsi',
      department: 'Commercial',
      status: 'draft',
      priority: 'high',
      items: [
        {
          id: 'item-001',
          articleId: 'art-001',
          articleName: 'A4 Paper (500 sheets)',
          quantity: 10,
          unit: 'Ream',
          estimatedCost: 59.90,
          notes: 'For sales reports',
        },
      ],
      justification: 'Need for upcoming campaign',
      estimatedBudget: 500,
      createdAt: '2024-06-10',
      submittedAt: '2024-06-10',
      updatedAt: '2024-06-10',
    },
    {
      id: 'req-002',
      requestNumber: 'REQ-002',
      userId: 'usr-resp',
      userName: 'Sonia Ben Ali',
      department: 'Ressources Humaines',
      status: 'approved',
      priority: 'medium',
      items: [
        {
          id: 'item-002',
          articleId: 'art-005',
          articleName: 'Notebook (Ruled)',
          quantity: 50,
          unit: 'Pack',
          estimatedCost: 175.00,
        },
      ],
      justification: 'Training materials',
      estimatedBudget: 300,
      approvedBy: 'manager-001',
      createdAt: '2024-06-09',
      submittedAt: '2024-06-09',
      approvedAt: '2024-06-10',
      updatedAt: '2024-06-10',
    },
    {
      id: 'req-003',
      requestNumber: 'REQ-003',
      userId: 'usr-stock',
      userName: 'Mourad Gharbi',
      department: 'Logistique',
      status: 'draft',
      priority: 'low',
      items: [
        {
          id: 'item-003',
          articleId: 'art-002',
          articleName: 'Ballpoint Pen (Blue)',
          quantity: 5,
          unit: 'Box',
          estimatedCost: 62.50,
        },
      ],
      justification: 'Regular office supplies',
      createdAt: '2024-06-09',
      updatedAt: '2024-06-09',
    },
    {
      id: 'req-004',
      requestNumber: 'REQ-004',
      userId: 'usr-achats',
      userName: 'Leila Mansour',
      department: 'Achats & Finance',
      status: 'submitted',
      priority: 'urgent',
      items: [],
      justification: 'Critical supplies needed',
      createdAt: '2024-06-08',
      submittedAt: '2024-06-08',
      updatedAt: '2024-06-08',
    },
    {
      id: 'req-005',
      requestNumber: 'REQ-005',
      userId: 'usr-emp',
      userName: 'Youssef Trabelsi',
      department: 'Commercial',
      status: 'rejected',
      priority: 'low',
      items: [],
      justification: 'Not needed',
      rejectionReason: 'Budget not available for this period',
      createdAt: '2024-06-07',
      submittedAt: '2024-06-07',
      updatedAt: '2024-06-09',
    },
  ];

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((request) => {
      // Employé: only see own requests
      if (user?.role === 'employe' && request.userId !== user?.id) return false;
      // Responsable Achats: only see approved requests
      if (user?.role === 'responsable_achats' && request.status !== 'approved') return false;

      const matchesSearch =
        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = !selectedStatus || request.status === selectedStatus;
      const matchesPriority = !selectedPriority || request.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, selectedStatus, selectedPriority, user]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'submitted': return 'Soumise';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const columns = [
    {
      key: 'requestNumber' as const,
      label: 'N° Demande',
      sortable: true,
      width: '120px',
    },
    {
      key: 'userName' as const,
      label: 'Demandeur',
      sortable: true,
      render: (value: string, row: SupplyRequest) => (
        <div>
          <p className="font-medium text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-600">{row.department}</p>
        </div>
      ),
    },
    {
      key: 'items' as const,
      label: 'Résumé des articles',
      sortable: false,
      render: (items: any[]) => {
        if (!items || items.length === 0) return <span className="text-neutral-500 italic">Aucun article</span>;
        
        const firstItem = items[0];
        const summaryText = `${firstItem.quantity}x ${firstItem.articleName}`;
        
        return (
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900 truncate max-w-[200px]" title={summaryText}>
              {summaryText}
            </span>
            {items.length > 1 && (
              <span className="text-xs text-neutral-500">+{items.length - 1} article(s) de plus</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'priority' as const,
      label: 'Priorité',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={getPriorityVariant(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'createdAt' as const,
      label: 'Date',
      sortable: true,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '240px',
      render: (_value: string, row: SupplyRequest) => (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => navigate(`/requests/${row.id}`)}
          >
            Voir
          </Button>

          {/* Responsable Achats actions on approved requests */}
          {user?.role === 'responsable_achats' && row.status === 'approved' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={<Loader2 size={16} />}
                title="Marquer en cours de traitement"
              >
                En cours
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<PackageCheck size={16} />}
                title="Marquer comme livrée"
              >
                Livrée
              </Button>
            </>
          )}

          {/* Employé/Other draft actions */}
          {user?.role !== 'responsable_achats' && row.status === 'draft' && (
            <>
              <Button variant="ghost" size="sm" icon={<Edit2 size={16} />}>
                Modifier
              </Button>
              <Button variant="ghost" size="sm" icon={<Send size={16} />}>
                Soumettre
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = filteredRequests.filter((r) => r.status === 'submitted' || r.status === 'draft').length;
  const approvedCount = filteredRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = filteredRequests.filter((r) => r.status === 'rejected').length;

  return (
    <MainLayout title="Demandes de Fournitures">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              {user?.role === 'responsable_achats' ? 'Demandes Approuvées' : 'Demandes de Fournitures'}
            </h2>
            <p className="text-neutral-600 mt-2">
              {user?.role === 'responsable_achats'
                ? 'Consultez les demandes approuvées et mettez à jour leur statut de traitement'
                : 'Gérez les demandes de fournitures de votre équipe'}
            </p>
          </div>
          {user?.role !== 'responsable_achats' && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => window.location.href = '/requests/create'}
            >
              Nouvelle Demande
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Demandes Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {filteredRequests.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">En attente/Soumises</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Approuvées</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Rejetées</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Alerts */}
        {pendingCount > 0 && (
          <Alert type="info" closable>
            Vous avez {pendingCount} demande(s) en attente ou soumise(s) nécessitant une approbation.
          </Alert>
        )}

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Rechercher par n° de demande ou demandeur..."
                    onSearch={setSearchTerm}
                  />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Tous les statuts' },
                    { value: 'draft', label: 'Brouillon' },
                    { value: 'submitted', label: 'Soumise' },
                    { value: 'pending', label: 'En attente' },
                    { value: 'approved', label: 'Approuvée' },
                    { value: 'rejected', label: 'Rejetée' },
                  ]}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full md:w-48"
                />
                <Select
                  options={[
                    { value: '', label: 'Toutes les priorités' },
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'high', label: 'Haute' },
                    { value: 'medium', label: 'Moyenne' },
                    { value: 'low', label: 'Basse' },
                  ]}
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full md:w-48"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Demandes (${filteredRequests.length})`} />
          <CardBody>
            <DataTable<SupplyRequest>
              columns={columns}
              data={filteredRequests}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Supprimer la Demande"
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.
        </p>
      </Modal>
    </MainLayout>
  );
};
