/**
 * Request Details Page - Requests Module
 * Show request details with approval history
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Loader2, Package, ShoppingCart } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Textarea } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { useAuth } from '@hooks/useAuth';
import { requestsService } from '@services/requestsService';
import type { SupplyRequest, RequestItem } from '@/types/requests';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState<SupplyRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequest = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await requestsService.getRequestById(Number(id));
      setRequest(data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement de la demande');
      navigate('/requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const itemColumns = [
    {
      key: 'articleName' as const,
      label: 'Article',
      sortable: false,
    },
    {
      key: 'quantity' as const,
      label: 'Quantité',
      sortable: false,
      render: (value: number, row: RequestItem) => (
        <span>
          {value} {row.unit || 'unité(s)'}
        </span>
      ),
    },
    {
      key: 'notes' as const,
      label: 'Notes',
      sortable: false,
      render: (value: string) => <span className="text-neutral-600">{value || '-'}</span>,
    },
  ];

  const handleApprove = async () => {
    if (!id) return;
    try {
      await requestsService.approveRequest(Number(id));
      setIsApproveModalOpen(false);
      fetchRequest();
    } catch (err: any) {
      alert("Erreur lors de l'approbation: " + err.message);
    }
  };

  const handleDeliver = async () => {
    if (!id) return;
    try {
      await requestsService.deliverRequest(Number(id));
      setIsDeliverModalOpen(false);
      fetchRequest();
    } catch (err: any) {
      alert("Erreur lors de la livraison: " + err.message);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }
    try {
      await requestsService.rejectRequest(Number(id), rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason('');
      fetchRequest();
    } catch (err: any) {
      alert("Erreur lors du rejet: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Détails de la demande">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      </MainLayout>
    );
  }

  if (!request) return null;

  const canApproveReject = request.status === 'en_attente' && (user?.role === 'responsable_service' || user?.role === 'admin');
  const canDeliver = request.status === 'approuvée' && (user?.role === 'gestionnaire_stock' || user?.role === 'responsable_achats' || user?.role === 'admin');
  
  const hasInsufficientStock = request.items.some(item => {
    // @ts-ignore - article is populated by the backend even though the frontend type might not explicitly declare it
    const available = item.article?.quantity || 0;
    return available < item.quantity;
  });

  const postDeliveryCritical = request.status === 'livrée' ? request.items.filter(item => {
    // @ts-ignore
    const available = item.article?.quantity || 0;
    // @ts-ignore
    const minStock = item.article?.minStock || 0;
    return available <= minStock;
  }) : [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'en_attente': return 'warning';
      case 'approuvée': return 'success';
      case 'refusée': return 'danger';
      case 'annulée': return 'warning';
      case 'livrée': return 'primary';
      case 'traitee': return 'secondary';
      default: return 'info';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'danger';
      case 'haute': return 'warning';
      case 'normale': return 'info';
      case 'basse': return 'success';
      default: return 'primary';
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

  return (
    <MainLayout title={`Demande ${request.requestNumber}`}>
      <div className="space-y-6">
        {postDeliveryCritical.length > 0 && (
          <Alert type="warning" closable>
            <strong>Attention :</strong> Suite à cette livraison, le stock de certains articles est devenu critique : 
            <ul className="list-disc ml-5 mt-1">
              {postDeliveryCritical.map(item => (
                // @ts-ignore
                <li key={item.id}>{item.articleName} (Restant: {item.article?.quantity})</li>
              ))}
            </ul>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/orders/create`)}
              >
                Commander ces articles
              </Button>
            </div>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/requests')}
          >
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Demande {request.requestNumber}
            </h2>
            <p className="text-neutral-600 mt-2">Affichez et gérez les détails de la demande</p>
          </div>
        </div>

        {/* Request Header Card */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-600">Statut</p>
                <Badge
                  variant={getStatusVariant(request.status)}
                  className="mt-2"
                >
                  {getStatusLabel(request.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Priorité</p>
                <Badge
                  variant={getPriorityVariant(request.priority)}
                  className="mt-2"
                >
                  {getPriorityLabel(request.priority)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Demandeur</p>
                <p className="font-semibold text-neutral-900 mt-1">{request.userName}</p>
                <p className="text-sm text-neutral-600">{request.department}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Date de création</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Justification & Rejection Reason */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader title="Justification" />
            <CardBody>
              <p className="text-neutral-700">{request.justification || 'Aucune justification fournie.'}</p>
            </CardBody>
          </Card>
          
          {request.status === 'refusée' && request.rejectionReason && (
            <Card>
              <CardHeader title="Motif du rejet" />
              <CardBody>
                <Alert type="error">
                  {request.rejectionReason}
                </Alert>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Items */}
        <Card>
          <CardHeader title={`Articles (${request.items.length})`} />
          <CardBody>
            <DataTable<RequestItem>
              columns={itemColumns}
              data={request.items}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>

        {/* Actions */}
        {canApproveReject && (
          <Card>
            <CardFooter className="flex gap-4">
              <Button
                variant="danger"
                icon={<X size={20} />}
                onClick={() => setIsRejectModalOpen(true)}
              >
                Rejeter la Demande
              </Button>
              <Button
                variant="primary"
                icon={<Check size={20} />}
                onClick={() => setIsApproveModalOpen(true)}
              >
                Approuver la Demande
              </Button>
            </CardFooter>
          </Card>
        )}

        {canDeliver && (
          <Card>
            <CardFooter className="flex flex-col items-start gap-4">
              {hasInsufficientStock && (
                <Alert type="warning" className="w-full">
                  <strong>Stock insuffisant :</strong> Au moins un article de cette demande n'a pas la quantité requise en stock. Vous devez vous réapprovisionner avant de pouvoir livrer.
                </Alert>
              )}
              
              {!hasInsufficientStock && (
                request.items.some(item => {
                  const available = (item as any).article?.quantity || 0;
                  const min = (item as any).article?.minStock || 0;
                  return (available - item.quantity) <= min;
                })
              ) && (
                <Alert type="info" className="w-full">
                  <strong>Suggestion d'approvisionnement :</strong> La livraison de cette demande entraînera le passage du stock de certains articles sous leur seuil minimum. Vous pouvez livrer la demande, mais il est conseillé de créer une commande pour rester dans la zone verte.
                </Alert>
              )}

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  icon={<Package size={20} />}
                  onClick={() => setIsDeliverModalOpen(true)}
                  disabled={hasInsufficientStock}
                  title={hasInsufficientStock ? 'Stock insuffisant pour livrer' : ''}
                >
                  Livrer la Demande
                </Button>
                {(hasInsufficientStock || request.items.some(item => ((item as any).article?.quantity || 0) - item.quantity <= ((item as any).article?.minStock || 0))) && (
                  <Button
                    variant="outline"
                    icon={<ShoppingCart size={20} />}
                    onClick={() => navigate(`/orders/create?requestId=${request.id}`)}
                  >
                    Créer une commande
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approuver la Demande"
        onConfirm={handleApprove}
        confirmText="Approuver"
      >
        <div className="space-y-4">
          <Alert type="success">
            Cela approuvera la demande. Le stock sera déduit ultérieurement lors de la livraison.
          </Alert>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Numéro de Demande</p>
            <p className="font-semibold text-neutral-900">{request.requestNumber}</p>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        title="Rejeter la Demande"
        onConfirm={handleReject}
        confirmText="Rejeter"
      >
        <div className="space-y-4">
          <Alert type="warning">
            Veuillez fournir une raison pour le rejet de cette demande.
          </Alert>
          <Textarea
            label="Raison du Rejet"
            placeholder="Expliquez pourquoi cette demande est refusée..."
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
      </Modal>
      {/* Deliver Modal */}
      <Modal
        isOpen={isDeliverModalOpen}
        onClose={() => setIsDeliverModalOpen(false)}
        title="Livrer la Demande"
        onConfirm={handleDeliver}
        confirmText="Livrer"
      >
        <div className="space-y-4">
          <Alert type="success">
            Cela déduira les quantités du stock et marquera la demande comme livrée.
          </Alert>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Numéro de Demande</p>
            <p className="font-semibold text-neutral-900">{request.requestNumber}</p>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};
