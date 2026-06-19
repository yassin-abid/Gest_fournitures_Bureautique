/**
 * Create Order Page - Orders Module
 * Form to create new purchase order
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select, Textarea } from '@components/FormInputs';
import { ordersService } from '@services/ordersService';
import { catalogService } from '@services/catalogService';
import { requestsService } from '@services/requestsService';
import type { Supplier, Article } from '@/types/catalog';

interface OrderItemUI {
  id: string; // purely for UI mapping
  articleId: number;
  articleName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');

  const [supplierId, setSupplierId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<OrderItemUI[]>([]);
  
  const [newItemArticle, setNewItemArticle] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [suppRes, artRes] = await Promise.all([
          catalogService.getSuppliers(1, 100),
          catalogService.getArticles(1, 1000)
        ]);
        setSuppliers(suppRes.data);
        setArticles(artRes.data);

        // Si on vient d'une demande, on pré-remplit les articles
        if (requestId) {
          const reqData = await requestsService.getRequestById(Number(requestId));
          if (reqData && reqData.items) {
            const prefilledItems = reqData.items.map(item => {
              const articleInfo = artRes.data.find(a => a.id === item.articleId);
              const qty = item.approvedQuantity || item.quantity;
              const unitPrice = articleInfo?.unitPrice || 0;
              return {
                id: `item-${Date.now()}-${item.articleId}`,
                articleId: item.articleId,
                articleName: articleInfo?.name || item.articleName || 'Article Inconnu',
                quantity: qty,
                unitPrice: unitPrice,
                totalPrice: qty * unitPrice,
                notes: item.notes || ''
              };
            });
            setItems(prefilledItems);
          }
        }
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [requestId]);

  const getArticleName = (id: number) => {
    const article = articles.find((a) => a.id === id);
    return article?.name || '';
  };

  const getArticlePrice = (id: number) => {
    const article = articles.find((a) => a.id === id);
    return article?.unitPrice || 0;
  };

  const handleArticleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setNewItemArticle(id);
    if (id) {
      setNewItemPrice(getArticlePrice(Number(id)).toString());
    } else {
      setNewItemPrice('');
    }
  };

  const addItem = () => {
    if (!newItemArticle || !newItemQuantity || !newItemPrice) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const quantity = parseInt(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const totalPrice = quantity * unitPrice;

    const newItem: OrderItemUI = {
      id: `item-${Date.now()}`,
      articleId: Number(newItemArticle),
      articleName: getArticleName(Number(newItemArticle)),
      quantity,
      unitPrice,
      totalPrice,
      notes: newItemNotes,
    };

    setItems([...items, newItem]);
    setNewItemArticle('');
    setNewItemQuantity('');
    setNewItemPrice('');
    setNewItemNotes('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async () => {
    if (!supplierId) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }
    
    try {
      await ordersService.createOrder({
        requestId: requestId ? Number(requestId) : undefined,
        supplierId: Number(supplierId),
        paymentTerms,
        expectedDeliveryDate: deliveryDate || undefined,
        notes,
        items: items.map(i => ({
          articleId: i.articleId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          notes: i.notes
        }))
      });
      alert('Commande créée avec succès !');
      navigate('/orders');
    } catch (e: any) {
      const detail = (e as any)?.details ? JSON.stringify((e as any).details) : '';
      alert("Erreur : " + e.message + (detail ? '\n' + detail : ''));
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Créer un Bon de Commande">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Créer un Bon de Commande">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={20} />} onClick={() => navigate(-1)}>
            Retour
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Créer un Bon de Commande</h2>
            {requestId && (
              <p className="text-primary-600 mt-1 font-medium">Pré-remplie depuis la demande N°{requestId}</p>
            )}
            <p className="text-neutral-600 mt-2">Remplissez le formulaire ci-dessous pour créer une nouvelle commande.</p>
          </div>
        </div>

        <Card>
          <CardHeader title="Détails de la Commande" />
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Fournisseur *"
                  options={[
                    { value: '', label: 'Sélectionner un fournisseur' },
                    ...suppliers.map(s => ({ value: s.id.toString(), label: s.name }))
                  ]}
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                />
                <Input
                  label="Date de Livraison Prévue"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Conditions de Paiement"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="ex., Net 30 jours"
                />
              </div>

              <Textarea
                label="Notes"
                placeholder="Instructions particulières..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Ajouter des Articles" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Article *"
                  options={[
                    { value: '', label: 'Sélectionner un article' },
                    ...articles.map(a => ({ value: a.id.toString(), label: a.name }))
                  ]}
                  value={newItemArticle}
                  onChange={handleArticleSelect}
                />
                <Input
                  label="Quantité *"
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prix unitaire (€) *"
                  type="number"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="0.00"
                />
                <Textarea
                  label="Notes"
                  placeholder="Notes particulières..."
                  rows={1}
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                />
              </div>

              <Button variant="primary" icon={<Plus size={20} />} onClick={addItem} fullWidth>
                Ajouter l'Article
              </Button>
            </div>
          </CardBody>
        </Card>

        {items.length > 0 && (
          <Card>
            <CardHeader title={`Articles (${items.length})`} />
            <CardBody>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{item.articleName}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                        <span>Qté : {item.quantity}</span>
                        <span>Prix unitaire : {item.unitPrice.toFixed(2)} DH</span>
                        <span className="font-semibold text-neutral-900">Total : {item.totalPrice.toFixed(2)} DH</span>
                        {item.notes && <span className="italic">{item.notes}</span>}
                      </div>
                    </div>
                    <Button variant="danger" size="sm" icon={<Trash2 size={16} />} onClick={() => removeItem(item.id)} />
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Montant Total :</span>
                  <span className="text-2xl font-bold text-primary-600">{totalAmount.toFixed(2)} DH</span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardFooter>
            <Button variant="ghost" onClick={() => navigate(-1)}>Annuler</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!supplierId || items.length === 0}>
              Créer la Commande
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
