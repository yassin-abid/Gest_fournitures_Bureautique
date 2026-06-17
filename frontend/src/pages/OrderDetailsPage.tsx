/**
 * Order Details Page - Orders Module
 * Show order details with items and actions
 */

import React, { useState } from 'react';
import { ArrowLeft, Download, Truck, CheckCircle } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Alert } from '@components/Alert';
import type { Order, OrderItem } from '@/types/requests';

export const OrderDetailsPage: React.FC = () => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const mockOrder: Order = {
    id: 'ord-001',
    orderNumber: 'ORD-001',
    supplierId: 'sup-001',
    supplierName: 'Office Pro',
    status: 'confirmed',
    items: [
      {
        id: 'item-001',
        articleId: 'art-001',
        articleName: 'A4 Paper (500 sheets)',
        quantity: 20,
        unit: 'Ream',
        unitPrice: 5.99,
        totalPrice: 119.80,
        receivedQuantity: 20,
        invoiceNumber: 'INV-2024-001',
      },
      {
        id: 'item-002',
        articleId: 'art-002',
        articleName: 'Ballpoint Pen (Blue)',
        quantity: 10,
        unit: 'Box',
        unitPrice: 12.50,
        totalPrice: 125.00,
        receivedQuantity: 10,
      },
      {
        id: 'item-003',
        articleId: 'art-003',
        articleName: 'File Folder (Yellow)',
        quantity: 15,
        unit: 'Pack',
        unitPrice: 8.75,
        totalPrice: 131.25,
      },
    ],
    totalAmount: 500.00,
    paymentTerms: 'Net 30',
    expectedDeliveryDate: '2024-06-20',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-06-10',
    notes: 'Urgent order',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-10',
  };

  const itemColumns = [
    {
      key: 'articleName' as const,
      label: 'Article',
      sortable: false,
    },
    {
      key: 'quantity' as const,
      label: 'Quantité Commandée',
      sortable: false,
      render: (value: number, row: OrderItem) => (
        <span>
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'unitPrice' as const,
      label: 'Prix unitaire',
      sortable: false,
      render: (value: number) => <span>€{value.toFixed(2)}</span>,
    },
    {
      key: 'totalPrice' as const,
      label: 'Prix Total',
      sortable: false,
      render: (value: number) => <span className="font-semibold">€{value.toFixed(2)}</span>,
    },
    {
      key: 'receivedQuantity' as const,
      label: 'Reçue',
      sortable: false,
      render: (value: number, row: OrderItem) => (
        <span className={value === row.quantity ? 'text-green-600 font-medium' : 'text-amber-600'}>
          {value || 0} {row.unit}
        </span>
      ),
    },
  ];

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    alert('Commande confirmée avec succès');
  };

  const handleShip = () => {
    setIsShipModalOpen(false);
    alert('Commande marquée comme expédiée');
  };

  const handleReceive = () => {
    setIsReceiveModalOpen(false);
    alert('Livraison reçue');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <MainLayout title={`Commande ${mockOrder.orderNumber}`}>
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
              Commande {mockOrder.orderNumber}
            </h2>
            <p className="text-neutral-600 mt-2">Affichez et gérez les détails de la commande</p>
          </div>
        </div>

        {/* Order Header Card */}
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-600">Statut</p>
                <Badge variant={getStatusVariant(mockOrder.status)} className="mt-2">
                  {getStatusLabel(mockOrder.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Fournisseur</p>
                <p className="font-semibold text-neutral-900 mt-1">{mockOrder.supplierName}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Conditions de Paiement</p>
                <p className="font-semibold text-neutral-900 mt-1">{mockOrder.paymentTerms}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Livraison Prévue</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {mockOrder.expectedDeliveryDate}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader title={`Articles (${mockOrder.items.length})`} />
          <CardBody>
            <DataTable<OrderItem>
              columns={itemColumns}
              data={mockOrder.items}
              rowKey="id"
              pageSize={10}
            />

            <div className="border-t border-neutral-200 mt-6 pt-6">
              <div className="flex items-center justify-end">
                <div>
                  <p className="text-sm text-neutral-600">Montant Total :</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    €{mockOrder.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Invoice Information */}
        {mockOrder.invoiceNumber && (
          <Card>
            <CardHeader title="Informations de Facture" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-600">Numéro de Facture</p>
                  <p className="font-semibold text-neutral-900 mt-1">{mockOrder.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Date de Facture</p>
                  <p className="font-semibold text-neutral-900 mt-1">{mockOrder.invoiceDate}</p>
                </div>
              </div>
              <Button
                variant="outline"
                icon={<Download size={20} />}
                className="mt-4"
              >
                Télécharger la Facture
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Order Notes */}
        {mockOrder.notes && (
          <Card>
            <CardHeader title="Notes" />
            <CardBody>
              <p className="text-neutral-700">{mockOrder.notes}</p>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        {(mockOrder.status === 'pending' || mockOrder.status === 'confirmed' || mockOrder.status === 'shipped') && (
          <Card>
            <CardFooter>
              {mockOrder.status === 'pending' && (
                <Button
                  variant="primary"
                  icon={<CheckCircle size={20} />}
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  Confirmer la Commande
                </Button>
              )}
              {mockOrder.status === 'confirmed' && (
                <Button
                  variant="primary"
                  icon={<Truck size={20} />}
                  onClick={() => setIsShipModalOpen(true)}
                >
                  Marquer comme Expédiée
                </Button>
              )}
              {mockOrder.status === 'shipped' && (
                <Button
                  variant="primary"
                  icon={<CheckCircle size={20} />}
                  onClick={() => setIsReceiveModalOpen(true)}
                >
                  Recevoir la Livraison
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmer la Commande"
        onConfirm={handleConfirm}
        confirmText="Confirmer"
      >
        <Alert type="info">
          Cela confirmera la commande auprès du fournisseur.
        </Alert>
        <div className="mt-4 bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600">Numéro de Commande</p>
          <p className="font-semibold text-neutral-900">{mockOrder.orderNumber}</p>
        </div>
      </Modal>

      {/* Ship Modal */}
      <Modal
        isOpen={isShipModalOpen}
        onClose={() => setIsShipModalOpen(false)}
        title="Marquer comme Expédiée"
        onConfirm={handleShip}
        confirmText="Confirmer l'Expédition"
      >
        <Alert type="info">
          Cela marquera la commande comme expédiée et vous informera des informations de suivi de livraison.
        </Alert>
        <div className="mt-4 space-y-3">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-neutral-600">Livraison Prévue</p>
            <p className="font-semibold text-neutral-900">
              {mockOrder.expectedDeliveryDate}
            </p>
          </div>
        </div>
      </Modal>

      {/* Receive Modal */}
      <Modal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        title="Recevoir la Livraison"
        onConfirm={handleReceive}
        confirmText="Confirmer la Réception"
      >
        <Alert type="success">
          Veuillez confirmer que tous les articles ont été reçus et inspectés.
        </Alert>
        <div className="mt-4 bg-neutral-50 p-4 rounded-lg">
          <p className="text-sm text-neutral-600">Numéro de Commande</p>
          <p className="font-semibold text-neutral-900">{mockOrder.orderNumber}</p>
          <p className="text-sm text-neutral-600 mt-3">Total d'Articles</p>
          <p className="font-semibold text-neutral-900">{mockOrder.items.length}</p>
        </div>
      </Modal>
    </MainLayout>
  );
};
