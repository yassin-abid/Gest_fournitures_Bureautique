/**
 * Requests List Page - Requests Module
 * Show all supply requests
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select, Input } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { Modal } from '@components/Modal';
import { useAuth } from '@hooks/useAuth';
import { requestsService } from '@services/requestsService';
import type { SupplyRequest } from '@/types/requests';

export const RequestsListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [isRealDeleteModalOpen, setIsRealDeleteModalOpen] = useState(false);
  const [requestToRealDelete, setRequestToRealDelete] = useState<number | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await requestsService.getRequests(1, 100, selectedStatus || undefined);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedStatus]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Responsable Achats: only see approved/delivered/processed requests
      if (user?.role === 'responsable_achats' && !['approuvée', 'livrée', 'traitee'].includes(request.status)) return false;

      const matchesSearch =
        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesPriority = !selectedPriority || request.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    });
  }, [requests, searchTerm, selectedPriority, user]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'warning';
      case 'approuvée':
        return 'success';
      case 'refusée':
        return 'danger';
      case 'annulée':
        return 'warning';
      case 'livrée':
        return 'primary';
      case 'traitee':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return 'danger';
      case 'haute':
        return 'warning';
      case 'normale':
        return 'info';
      case 'basse':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'approuvée': return 'Approuvée';
      case 'refusée': return 'Refusée';
      case 'annulée': return 'Annulée';
      case 'livrée': return 'Livrée';
      case 'traitee': return 'Traitée';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'Urgente';
      case 'haute': return 'Haute';
      case 'normale': return 'Normale';
      case 'basse': return 'Basse';
      default: return priority;
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await requestsService.approveRequest(id);
      fetchRequests();
    } catch (e: any) {
      alert("Erreur lors de l'approbation: " + e.message);
    }
  };

  const handleReject = async () => {
    if (!requestToReject || !rejectReason.trim()) return;
    try {
      await requestsService.rejectRequest(requestToReject, rejectReason);
      setRejectModalOpen(false);
      setRequestToReject(null);
      setRejectReason('');
      fetchRequests();
    } catch (e: any) {
      alert("Erreur lors du rejet: " + e.message);
    }
  };

  const handleDelete = async () => {
    if (!requestToDelete) return;
    try {
      await requestsService.cancelRequest(requestToDelete);
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
      fetchRequests();
    } catch (e: any) {
      alert("Erreur lors de l'annulation: " + e.message);
    }
  };

  const handleRealDelete = async () => {
    if (!requestToRealDelete) return;
    try {
      await requestsService.deleteRequest(requestToRealDelete);
      setIsRealDeleteModalOpen(false);
      setRequestToRealDelete(null);
      fetchRequests();
    } catch (e: any) {
      alert("Erreur lors de la suppression: " + e.message);
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
      render: (value: string) => <span>{new Date(value).toLocaleDateString()}</span>
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '300px',
      render: (_value: number, row: SupplyRequest) => (
        <div className="flex items-center gap-2 flex-nowrap">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            onClick={() => navigate(`/requests/${row.id}`)}
          >
            Voir
          </Button>

          {/* Responsable Service actions */}
          {user?.role === 'responsable_service' && row.status === 'en_attente' && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle size={16} />}
                onClick={() => handleApprove(row.id)}
                title="Approuver la demande"
              >
                Approuver
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle size={16} />}
                onClick={() => {
                  setRequestToReject(row.id);
                  setRejectModalOpen(true);
                }}
                title="Refuser la demande"
              >
                Refuser
              </Button>
            </>
          )}

          {/* Responsable Achats actions */}
          {(user?.role === 'responsable_achats' || user?.role === 'admin') && (
            <>
              {row.status === 'traitee' && (
                <Badge variant="secondary">Commande en cours</Badge>
              )}
            </>
          )}

          {/* Employé pending actions (submitted) */}
          {user?.role === 'employe' && row.status === 'en_attente' && (
            <>
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle size={16} />}
                onClick={() => {
                  setRequestToDelete(row.id);
                  setIsDeleteModalOpen(true);
                }}
                title="Annuler la demande"
              >
                Annuler
              </Button>
            </>
          )}

          {/* Delete action (Admin, Responsables) */}
          {['admin', 'responsable_achats', 'responsable_service'].includes(user?.role || '') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setRequestToRealDelete(row.id);
                setIsRealDeleteModalOpen(true);
              }}
              title="Supprimer définitivement"
            >
              Supprimer
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = filteredRequests.filter((r) => r.status === 'en_attente').length;
  const approvedCount = filteredRequests.filter((r) => r.status === 'approuvée').length;
  const rejectedCount = filteredRequests.filter((r) => r.status === 'refusée').length;

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
                ? 'Consultez les demandes approuvées'
                : 'Gérez les demandes de fournitures de votre équipe'}
            </p>
          </div>
          {user?.role !== 'responsable_achats' && (
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => navigate('/requests/create')}
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
                <p className="text-sm text-neutral-600">En attente</p>
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
                <p className="text-sm text-neutral-600">Refusées</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{rejectedCount}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Alerts */}
        {pendingCount > 0 && user?.role === 'responsable_service' && (
          <Alert type="info" closable>
            Vous avez {pendingCount} demande(s) en attente nécessitant une approbation.
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
                    { value: 'en_attente', label: 'En attente' },
                    { value: 'approuvée', label: 'Approuvée' },
                    { value: 'refusée', label: 'Refusée' },
                    { value: 'annulée', label: 'Annulée' },
                    { value: 'livrée', label: 'Livrée' },
                    { value: 'traitee', label: 'Traitée' },
                  ]}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full md:w-48"
                />
                <Select
                  options={[
                    { value: '', label: 'Toutes les priorités' },
                    { value: 'urgente', label: 'Urgente' },
                    { value: 'haute', label: 'Haute' },
                    { value: 'normale', label: 'Normale' },
                    { value: 'basse', label: 'Basse' },
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
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
            ) : (
              <DataTable<SupplyRequest>
                columns={columns}
                data={filteredRequests}
                rowKey="id"
                pageSize={10}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Annuler la Demande"
        confirmText="Confirmer l'annulation"
        onConfirm={handleDelete}
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir annuler cette demande ? Cette action modifiera son statut en "Annulée".
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Refuser la Demande"
        confirmText="Confirmer le refus"
        onConfirm={handleReject}
      >
        <div className="space-y-4">
          <p className="text-neutral-700">
            Veuillez indiquer le motif du refus. Ce motif sera notifié à l'employé.
          </p>
          <Input
            label="Motif du refus (obligatoire)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: Budget insuffisant, article non justifié..."
            required
          />
        </div>
      </Modal>

      {/* Real Delete Modal */}
      <Modal
        isOpen={isRealDeleteModalOpen}
        onClose={() => setIsRealDeleteModalOpen(false)}
        title="Supprimer la Demande"
        confirmText="Supprimer définitivement"
        onConfirm={handleRealDelete}
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer définitivement cette demande ? Cette action est irréversible et supprimera toutes les données associées.
        </p>
      </Modal>
    </MainLayout>
  );
};
