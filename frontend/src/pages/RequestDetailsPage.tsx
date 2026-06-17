/**
 * Request Details Page - Requests Module
 * Show request details with approval history
 */

import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Textarea } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { useAuth } from '@hooks/useAuth';
import type { SupplyRequest, RequestItem } from '@/types/requests';

export const RequestDetailsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const mockRequest: SupplyRequest = {
    id: 'req-001',
    requestNumber: 'REQ-001',
    userId: 'user-001',
    userName: 'John Smith',
    department: 'Sales',
    status: 'submitted',
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
      {
        id: 'item-002',
        articleId: 'art-002',
        articleName: 'Ballpoint Pen (Blue)',
        quantity: 5,
        unit: 'Box',
        estimatedCost: 62.50,
        notes: 'Team use',
      },
    ],
    justification: 'Need for upcoming campaign and daily operations',
    estimatedBudget: 200,
    createdAt: '2024-06-10',
    submittedAt: '2024-06-10',
    updatedAt: '2024-06-10',
  };

  const approvalHistory = [
    {
      id: '1',
      action: 'Créé',
      user: 'John Smith',
      role: 'Demandeur',
      date: '2024-06-10 10:00',
      status: 'info' as const,
    },
    {
      id: '2',
      action: 'Soumise',
      user: 'John Smith',
      role: 'Demandeur',
      date: '2024-06-10 10:15',
      status: 'info' as const,
    },
  ];

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
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'estimatedCost' as const,
      label: 'Coût Estimé',
      sortable: false,
      render: (value: number) => <span>€{value.toFixed(2)}</span>,
    },
    {
      key: 'notes' as const,
      label: 'Notes',
      sortable: false,
      render: (value: string) => <span className="text-neutral-600">{value || '-'}</span>,
    },
  ];

  const totalEstimatedCost = mockRequest.items.reduce(
    (sum, item) => sum + (item.estimatedCost || 0),
    0
  );

  const handleApprove = () => {
    setIsApproveModalOpen(false);
    alert('Demande approuvée avec succès');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }
    setIsRejectModalOpen(false);
    setRejectionReason('');
    alert('Demande rejetée avec succès');
  };

  const canApproveReject = mockRequest.status === 'submitted' && hasPermission('approve_requests');

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

  return (
    <MainLayout title={`Demande ${mockRequest.requestNumber}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} />}
            onClick={() => window.history.back()}
          >
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Demande {mockRequest.requestNumber}
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
                  variant={
                    mockRequest.status === 'submitted'
                      ? 'info'
                      : mockRequest.status === 'approved'
                      ? 'success'
                      : 'warning'
                  }
                  className="mt-2"
                >
                  {getStatusLabel(mockRequest.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Priorité</p>
                <Badge
                  variant={
                    mockRequest.priority === 'urgent'
                      ? 'danger'
                      : mockRequest.priority === 'high'
                      ? 'warning'
                      : 'info'
                  }
                  className="mt-2"
                >
                  {getPriorityLabel(mockRequest.priority)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Demandeur</p>
                <p className="font-semibold text-neutral-900 mt-1">{mockRequest.userName}</p>
                <p className="text-sm text-neutral-600">{mockRequest.department}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Date de soumission</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {mockRequest.submittedAt || mockRequest.createdAt}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Justification */}
        <Card>
          <CardHeader title="Justification" />
          <CardBody>
            <p className="text-neutral-700">{mockRequest.justification}</p>
          </CardBody>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader title={`Articles (${mockRequest.items.length})`} />
          <CardBody>
            <DataTable<RequestItem>
              columns={itemColumns}
              data={mockRequest.items}
              rowKey="id"
              pageSize={10}
            />

            <div className="border-t border-neutral-200 mt-6 pt-6">
              <div className="flex items-center justify-end">
                <div>
                  <p className="text-sm text-neutral-600">Budget Estimé Total :</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    €{totalEstimatedCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Approval History */}
        <Card>
          <CardHeader title="Historique d'Approbation" />
          <CardBody>
            <div className="space-y-4">
              {approvalHistory.map((entry) => (
                <div key={entry.id} className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {entry.action.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{entry.action}</p>
                    <p className="text-sm text-neutral-600">
                      par {entry.user} ({entry.role})
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        {canApproveReject && (
          <Card>
            <CardFooter>
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
            Cela approuvera la demande et ajoutera les articles à la file d'attente des bons de commande.
          </Alert>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Numéro de Demande</p>
            <p className="font-semibold text-neutral-900">{mockRequest.requestNumber}</p>
          </div>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Coût Estimé Total</p>
            <p className="font-semibold text-neutral-900">
              €{totalEstimatedCost.toFixed(2)}
            </p>
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
            placeholder="Expliquez pourquoi cette demande est rejetée..."
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
      </Modal>
    </MainLayout>
  );
};
