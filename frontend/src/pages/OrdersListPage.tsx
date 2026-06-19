import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Eye, Loader2, Link2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Modal } from '@components/Modal';
import { useAuth } from '@hooks/useAuth';
import { Alert } from '@components/Alert';
import { useNavigate } from 'react-router-dom';
import { ordersService } from '@services/ordersService';
import type { Order } from '@/types/requests';

export const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await ordersService.getOrders(1, 100, selectedStatus || undefined);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'warning';
      case 'confirmée':
        return 'info';
      case 'expédiée':
        return 'secondary';
      case 'livrée':
        return 'success';
      case 'partielle':
        return 'warning';
      case 'annulée':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'confirmée': return 'Confirmée';
      case 'expédiée': return 'Expédiée';
      case 'livrée': return 'Livrée';
      case 'partielle': return 'Partielle';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'orderNumber' as const,
      label: 'N° Commande',
      sortable: true,
      width: '130px',
    },
    {
      key: 'supplierName' as const,
      label: 'Fournisseur',
      sortable: true,
    },
    {
      key: 'requestNumber' as const,
      label: 'Demande Traitée',
      sortable: false,
      width: '160px',
      render: (_value: string, row: Order) => (
        row.requestNumber ? (
          <div
            className="flex items-center gap-1 text-primary-600 cursor-pointer hover:underline"
            onClick={() => navigate(`/requests/${row.requestId}`)}
          >
            <Link2 size={14} />
            <span className="text-sm font-medium">Demande N° {row.requestNumber}</span>
          </div>
        ) : (
          <span className="text-neutral-400 text-sm italic">—</span>
        )
      ),
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
      key: 'expectedDeliveryDate' as const,
      label: 'Livraison Prévue',
      sortable: true,
      render: (value: string) => <span>{value ? new Date(value).toLocaleDateString() : '-'}</span>
    },
    {
      key: 'status' as const,
      label: 'Statut Livraison',
      sortable: true,
      width: '150px',
      render: (value: string) => (
        <div className="flex flex-col gap-1">
          <Badge variant={getStatusVariant(value)}>
            {getStatusLabel(value)}
          </Badge>
          {value === 'livrée' && (
            <span className="text-xs text-green-600 font-medium">✓ Confirmée par resp.</span>
          )}
        </div>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '120px',
      render: (_value: number, row: Order) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Eye size={16} />} onClick={() => navigate(`/orders/${row.id}`)}>
            Voir
          </Button>
          {(user?.role === 'admin' || user?.role === 'responsable_achats') && (
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => {
                setOrderToDelete(row.id);
                setIsDeleteModalOpen(true);
              }}
            >
              Supprimer
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = filteredOrders.filter((o) => o.status === 'en_attente').length;
  const confirmedCount = filteredOrders.filter((o) => o.status === 'confirmée').length;
  const shippedCount = filteredOrders.filter((o) => o.status === 'expédiée').length;
  const deliveredCount = filteredOrders.filter((o) => o.status === 'livrée').length;

  return (
    <MainLayout title="Bons de Commande">
      <div className="space-y-6">
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

        {pendingCount > 0 && (
          <Alert type="info" closable>
            Vous avez {pendingCount} commande(s) en attente. Vérifiez et confirmez quand vous êtes prêt.
          </Alert>
        )}

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
                  { value: 'en_attente', label: 'En attente' },
                  { value: 'confirmée', label: 'Confirmée' },
                  { value: 'expédiée', label: 'Expédiée' },
                  { value: 'partielle', label: 'Partielle' },
                  { value: 'livrée', label: 'Livrée' },
                  { value: 'annulée', label: 'Annulée' },
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`Commandes (${filteredOrders.length})`} />
          <CardBody>
            {isLoading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" size={32} /></div>
            ) : (
              <DataTable<Order>
                columns={columns}
                data={filteredOrders}
                rowKey="id"
                pageSize={10}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Supprimer la Commande"
        confirmText="Supprimer définitivement"
        onConfirm={async () => {
          if (!orderToDelete) return;
          try {
            await ordersService.deleteOrder(orderToDelete);
            setIsDeleteModalOpen(false);
            setOrderToDelete(null);
            fetchOrders();
          } catch (e: any) {
            alert("Erreur lors de la suppression : " + e.message);
          }
        }}
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.
        </p>
      </Modal>
    </MainLayout>
  );
};
