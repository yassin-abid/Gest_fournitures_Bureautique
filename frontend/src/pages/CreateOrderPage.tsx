/**
 * Create Order Page - Orders Module
 * Form to create new purchase order
 */

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select, Textarea } from '@components/FormInputs';

interface OrderItem {
  id: string;
  articleId: string;
  articleName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

export const CreateOrderPage: React.FC = () => {
  const [supplier, setSupplier] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [newItemArticle, setNewItemArticle] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const mockSuppliers = [
    { value: 'sup-001', label: 'Office Pro' },
    { value: 'sup-002', label: 'Supplies Plus' },
    { value: 'sup-003', label: 'Tech Store' },
  ];

  const mockArticles = [
    { value: 'art-001', label: 'A4 Paper (500 sheets) - €5.99' },
    { value: 'art-002', label: 'Ballpoint Pen (Blue) - €12.50' },
    { value: 'art-003', label: 'File Folder (Yellow) - €8.75' },
    { value: 'art-004', label: 'Stapler (Desktop) - €25.00' },
    { value: 'art-005', label: 'Notebook (Ruled) - €3.50' },
  ];

  const getArticleName = (articleId: string) => {
    const article = mockArticles.find((a) => a.value === articleId);
    return article?.label?.split(' - ')[0] || '';
  };

  const addItem = () => {
    if (!newItemArticle || !newItemQuantity || !newItemPrice) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const quantity = parseInt(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const totalPrice = quantity * unitPrice;

    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      articleId: newItemArticle,
      articleName: getArticleName(newItemArticle),
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

  const handleSaveDraft = () => {
    alert('Commande enregistrée comme brouillon');
  };

  const handleSubmit = () => {
    if (!supplier) {
      alert('Veuillez sélectionner un fournisseur');
      return;
    }
    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }
    alert('Commande créée avec succès');
  };

  return (
    <MainLayout title="Créer un Bon de Commande">
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
            <h2 className="text-3xl font-bold text-neutral-900">Créer un Bon de Commande</h2>
            <p className="text-neutral-600 mt-2">Remplissez le formulaire ci-dessous pour créer une nouvelle commande</p>
          </div>
        </div>

        {/* Order Form */}
        <Card>
          <CardHeader title="Détails de la Commande" />
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Fournisseur *"
                  options={[{ value: '', label: 'Sélectionner un fournisseur' }, ...mockSuppliers]}
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
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

        {/* Add Items Section */}
        <Card>
          <CardHeader title="Ajouter des Articles" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Article *"
                  options={[{ value: '', label: 'Sélectionner un article' }, ...mockArticles]}
                  value={newItemArticle}
                  onChange={(e) => setNewItemArticle(e.target.value)}
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

              <Button
                variant="primary"
                icon={<Plus size={20} />}
                onClick={addItem}
                fullWidth
              >
                Ajouter l'Article
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Items List */}
        {items.length > 0 && (
          <Card>
            <CardHeader title={`Articles (${items.length})`} />
            <CardBody>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{item.articleName}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-neutral-600">
                        <span>Qté : {item.quantity}</span>
                        <span>Prix unitaire : €{item.unitPrice.toFixed(2)}</span>
                        <span className="font-semibold text-neutral-900">
                          Total : €{item.totalPrice.toFixed(2)}
                        </span>
                        {item.notes && <span className="italic">{item.notes}</span>}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeItem(item.id)}
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Montant Total :</span>
                  <span className="text-2xl font-bold text-primary-600">
                    €{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardFooter>
            <Button variant="ghost" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft}>
              Enregistrer comme Brouillon
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!supplier || items.length === 0}
            >
              Créer la Commande
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
