/**
 * Orders List Page - Orders Module
 * Show all purchase orders
 */

import React, { useState, useMemo } from 'react';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import { Modal } from '@components/Modal';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@/types/requests';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const mockOrders: Order[] = [
    {
      id: 'ord-001',
      orderNumber: 'ORD-001',
      supplierId: 'sup-001',
      supplierName: 'Office Pro',
      status: 'pending',
      items: [
        {
          id: 'item-001',
          articleId: 'art-001',
          articleName: 'A4 Paper (500 sheets)',
          quantity: 20,
          unit: 'Ream',
          unitPrice: 5.99,
          totalPrice: 119.80,
        },
      ],
      totalAmount: 500.00,
      paymentTerms: 'Net 30',
      expectedDeliveryDate: '2024-06-20',
      notes: 'Urgent order',
      createdAt: '2024-06-10',
      updatedAt: '2024-06-10',
    },
    {
      id: 'ord-002',
      orderNumber: 'ORD-002',
      supplierId: 'sup-002',
      supplierName: 'Supplies Plus',
      status: 'confirmed',
      items: [
        {
          id: 'item-002',
          articleId: 'art-002',
          articleName: 'Ballpoint Pen (Blue)',
          quantity: 10,
          unit: 'Box',
          unitPrice: 12.50,
          totalPrice: 125.00,
        },
      ],
      totalAmount: 350.00,
      paymentTerms: 'Net 45',
      expectedDeliveryDate: '2024-06-22',
      invoiceNumber: 'INV-2024-001',
      createdAt: '2024-06-09',
      updatedAt: '2024-06-10',
    },
    {
      id: 'ord-003',
      orderNumber: 'ORD-003',
      supplierId: 'sup-003',
      supplierName: 'Tech Store',
      status: 'shipped',
      items: [],
      totalAmount: 1200.00,
      expectedDeliveryDate: '2024-06-18',
      createdAt: '2024-06-08',
      updatedAt: '2024-06-09',
    },
    {
      id: 'ord-004',
      orderNumber: 'ORD-004',
      supplierId: 'sup-001',
      supplierName: 'Office Pro',
      status: 'delivered',
      items: [],
      totalAmount: 650.00,
      actualDeliveryDate: '2024-06-09',
      createdAt: '2024-06-05',
      updatedAt: '2024-06-09',
    },
  ];

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = !selectedStatus || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

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
      case 'cancelled':
        return 'danger';
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

  const columns = [
    {
      key: 'orderNumber' as const,
      label: 'N° Commande',
      sortable: true,
      width: '120px',
    },
    {
      key: 'supplierName' as const,
      label: 'Fournisseur',
      sortable: true,
    },
    {
      key: 'items' as const,
      label: 'Articles',
      sortable: false,
      width: '80px',
      render: (value: any[]) => (
        <span className="font-medium text-neutral-900">{value?.length || 0}</span>
      ),
    },
    {
      key: 'totalAmount' as const,
      label: 'Montant Total',
      sortable: true,
      render: (value: number) => <span className="font-semibold text-neutral-900">€{value.toFixed(2)}</span>,
    },
    {
      key: 'expectedDeliveryDate' as const,
      label: 'Livraison Prévue',
      sortable: true,
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '140px',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)}>
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '180px',
      render: (_value: string, row: Order) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
            Voir
          </Button>
          {row.status === 'pending' && (
            <>
              <Button variant="ghost" size="sm" icon={<Edit2 size={16} />}>
                Modifier
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

  const pendingCount = filteredOrders.filter((o) => o.status === 'pending').length;
  const confirmedCount = filteredOrders.filter((o) => o.status === 'confirmed').length;
  const shippedCount = filteredOrders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = filteredOrders.filter((o) => o.status === 'delivered').length;

  return (
    <MainLayout title="Bons de Commande">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Bons de Commande</h2>
            <p className="text-neutral-600 mt-2">Suivez et gérez vos bons de commande</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => navigate('/orders/create')}
          >
            Nouvelle Commande
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Commandes Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {filteredOrders.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">En attente</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Confirmées</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{confirmedCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Expédiées</p>
                <p className="text-2xl font-bold text-secondary-600 mt-2">{shippedCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Livrées</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{deliveredCount}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Alerts */}
        {pendingCount > 0 && (
          <Alert type="info" closable>
            Vous avez {pendingCount} commande(s) en attente. Vérifiez et confirmez quand vous êtes prêt.
          </Alert>
        )}

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Rechercher par n° de commande ou fournisseur..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'confirmed', label: 'Confirmée' },
                  { value: 'shipped', label: 'Expédiée' },
                  { value: 'delivered', label: 'Livrée' },
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
          <CardHeader title={`Commandes (${filteredOrders.length})`} />
          <CardBody>
            <DataTable<Order>
              columns={columns}
              data={filteredOrders}
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
        title="Supprimer la Commande"
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
        </p>
      </Modal>
    </MainLayout>
  );
};
