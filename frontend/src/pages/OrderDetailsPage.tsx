import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, CheckCircle, Loader2, XCircle, Package, Home } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Alert } from '@components/Alert';
import { ordersService } from '@services/ordersService';
import type { Order, OrderItem } from '@/types/requests';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await ordersService.getOrderById(Number(id));
      setOrder(data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement de la commande');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const itemColumns = [
    {
      key: 'articleName' as const,
      label: 'Article',
      sortable: false,
    },
    {
      key: 'quantity' as const,
      label: 'Qté Cmd',
      sortable: false,
      render: (_value: number, row: OrderItem) => (
        <span>{row.quantity} {row.unit || ''}</span>
      ),
    },
    {
      key: 'unitPrice' as const,
      label: 'Prix unitaire',
      sortable: false,
      render: (value: number) => <span>{value.toFixed(2)} DH</span>,
    },
    {
      key: 'quantity' as const,
      label: 'Prix Total',
      sortable: false,
      render: (_value: number, row: OrderItem) => <span className="font-semibold">{(row.quantity * row.unitPrice).toFixed(2)} DH</span>,
    },
    {
      key: 'receivedQuantity' as const,
      label: 'Reçue',
      sortable: false,
      render: (_value: number, row: OrderItem) => {
        const received = row.receivedQuantity || 0;
        return (
          <span className={received >= row.quantity ? 'text-green-600 font-medium' : 'text-amber-600'}>
            {received} {row.unit || ''}
          </span>
        );
      },
    },
  ];

  const handleConfirm = async () => {
    if (!order) return;
    try {
      await ordersService.confirmOrder(order.id);
      setIsConfirmModalOpen(false);
      fetchOrder();
    } catch (e: any) {
      alert("Erreur: " + e.message);
    }
  };

  const handleShip = async () => {
    if (!order) return;
    try {
      await ordersService.shipOrder(order.id, 'TRACKING-001'); // fake tracking
      setIsShipModalOpen(false);
      fetchOrder();
    } catch (e: any) {
      alert("Erreur: " + e.message);
    }
  };

  const handleReceive = async () => {
    if (!order) return;
    try {
      // Pour l'instant on reçoit la totalité manquante
      const itemsToReceive = order.items.map(item => ({
        itemId: item.id,
        quantity: item.quantity - (item.receivedQuantity || 0)
      })).filter(i => i.quantity > 0);

      await ordersService.receiveDelivery(order.id, itemsToReceive);
      setIsReceiveModalOpen(false);
      fetchOrder();
    } catch (e: any) {
      alert("Erreur: " + e.message);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      await ordersService.cancelOrder(order.id, 'Annulée par l\'utilisateur');
      setIsCancelModalOpen(false);
      fetchOrder();
    } catch (e: any) {
      alert("Erreur: " + e.message);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'en_attente': return 'warning';
      case 'confirmée': return 'info';
      case 'expédiée': return 'secondary';
      case 'livrée': return 'success';
      case 'partielle': return 'warning';
      case 'annulée': return 'danger';
      default: return 'primary';
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

  if (isLoading || !order) {
    return (
      <MainLayout title="Détails de la Commande">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      </MainLayout>
    );
  }

  const totalAmount = order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const steps = [
    { id: 'en_attente', label: 'Créée', icon: <Package size={24} /> },
    { id: 'confirmée', label: 'Confirmée', icon: <CheckCircle size={24} /> },
    { id: 'expédiée', label: 'Expédiée', icon: <Truck size={24} /> },
    { id: 'livrée', label: order.status === 'partielle' ? 'Partielle' : 'Livrée', icon: <Home size={24} /> }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'en_attente': return 0;
      case 'confirmée': return 1;
      case 'expédiée': return 2;
      case 'partielle': return 3;
      case 'livrée': return 3;
      default: return -1;
    }
  };

  const currentStepIndex = getStepIndex(order.status);

  return (
    <MainLayout title={`Commande ${order.orderNumber}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={20} />} onClick={() => navigate('/orders')}>
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Commande {order.orderNumber}
            </h2>
            <p className="text-neutral-600 mt-2">Affichez et gérez les détails de la commande</p>
          </div>
        </div>

        {/* Order Progress Stepper */}
        {order.status !== 'annulée' ? (
          <Card>
            <CardBody>
              <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto py-4">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 z-0 rounded"></div>
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 z-0 transition-all duration-500 rounded"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                {steps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-primary-500 border-white text-white shadow-md' 
                            : 'bg-white border-neutral-200 text-neutral-400'
                        } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                      >
                        {step.icon}
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-primary-700' : 'text-neutral-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Alert type="error">
            Cette commande a été annulée. Elle ne fera l'objet d'aucune livraison.
          </Alert>
        )}

        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-600">Statut</p>
                <Badge variant={getStatusVariant(order.status)} className="mt-2">
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Fournisseur</p>
                <p className="font-semibold text-neutral-900 mt-1">{order.supplierName}</p>
              </div>

              {order.requestNumber && (
                <div>
                  <p className="text-sm text-neutral-600">Demande Originelle</p>
                  <p className="font-semibold text-primary-600 mt-1 cursor-pointer hover:underline" onClick={() => navigate(`/requests/${order.requestId}`)}>
                    Demande N° {order.requestNumber}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-neutral-600">Date de création</p>
                <p className="font-semibold text-neutral-900 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-600">Livraison Prévue</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={`Articles (${order.items.length})`} />
          <CardBody>
            <DataTable<OrderItem>
              columns={itemColumns}
              data={order.items}
              rowKey="id"
              pageSize={10}
            />

            <div className="border-t border-neutral-200 mt-6 pt-6">
              <div className="flex items-center justify-end">
                <div>
                  <p className="text-sm text-neutral-600 text-right">Montant Total :</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    {totalAmount.toFixed(2)} DH
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader title="Notes" />
            <CardBody>
              <p className="text-neutral-700">{order.notes}</p>
            </CardBody>
          </Card>
        )}

        {['en_attente', 'confirmée', 'expédiée', 'partielle'].includes(order.status) && (
          <Card>
            <CardFooter>
              {order.status === 'en_attente' && (
                <>
                  <Button variant="danger" icon={<XCircle size={20} />} onClick={() => setIsCancelModalOpen(true)} className="mr-auto">
                    Annuler la Commande
                  </Button>
                  <Button variant="primary" icon={<CheckCircle size={20} />} onClick={() => setIsConfirmModalOpen(true)}>
                    Confirmer la Commande
                  </Button>
                </>
              )}
              {order.status === 'confirmée' && (
                <Button variant="primary" icon={<Truck size={20} />} onClick={() => setIsShipModalOpen(true)}>
                  Marquer comme Expédiée
                </Button>
              )}
              {(order.status === 'expédiée' || order.status === 'partielle') && (
                <Button variant="primary" icon={<CheckCircle size={20} />} onClick={() => setIsReceiveModalOpen(true)}>
                  Recevoir la Livraison (Totalité)
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirmer la Commande" onConfirm={handleConfirm} confirmText="Confirmer">
        <Alert type="info">Cela confirmera la commande auprès du fournisseur.</Alert>
      </Modal>

      <Modal isOpen={isShipModalOpen} onClose={() => setIsShipModalOpen(false)} title="Marquer comme Expédiée" onConfirm={handleShip} confirmText="Confirmer l'Expédition">
        <Alert type="info">Cela marquera la commande comme expédiée.</Alert>
      </Modal>

      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)} title="Recevoir la Livraison" onConfirm={handleReceive} confirmText="Confirmer la Réception">
        <Alert type="success">Cela enregistrera la réception de tous les articles manquants et mettra à jour le stock.</Alert>
      </Modal>

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Annuler la Commande" onConfirm={handleCancel} confirmText="Annuler">
        <Alert type="error">Êtes-vous sûr de vouloir annuler cette commande ?</Alert>
      </Modal>
    </MainLayout>
  );
};
