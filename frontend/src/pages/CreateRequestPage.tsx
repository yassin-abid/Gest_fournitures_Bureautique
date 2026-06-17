/**
 * Create Request Page - Requests Module
 * Form to create new supply request
 */

import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select, Textarea } from '@components/FormInputs';
import { Badge } from '@components/Badge';

interface RequestItem {
  id: string;
  articleId: string;
  articleName: string;
  quantity: number;
  estimatedCost: number;
  notes: string;
}

export const CreateRequestPage: React.FC = () => {
  const [priority, setPriority] = useState('medium');
  const [justification, setJustification] = useState('');
  const [items, setItems] = useState<RequestItem[]>([]);
  const [newItemArticle, setNewItemArticle] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

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
    if (!newItemArticle || !newItemQuantity) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newItem: RequestItem = {
      id: `item-${Date.now()}`,
      articleId: newItemArticle,
      articleName: getArticleName(newItemArticle),
      quantity: parseInt(newItemQuantity),
      estimatedCost: parseFloat(newItemCost) || 0,
      notes: newItemNotes,
    };

    setItems([...items, newItem]);
    setNewItemArticle('');
    setNewItemQuantity('');
    setNewItemCost('');
    setNewItemNotes('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalEstimatedCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);

  const handleSaveDraft = () => {
    alert('Demande enregistrée comme brouillon');
  };

  const handleSubmit = () => {
    if (!justification.trim()) {
      alert('Veuillez fournir une justification');
      return;
    }
    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }
    alert('Demande soumise avec succès');
  };

  return (
    <MainLayout title="Créer une Demande de Fournitures">
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
            <h2 className="text-3xl font-bold text-neutral-900">Créer une Demande de Fournitures</h2>
            <p className="text-neutral-600 mt-2">Remplissez le formulaire ci-dessous pour créer une nouvelle demande</p>
          </div>
        </div>

        {/* Request Form */}
        <Card>
          <CardHeader title="Détails de la Demande" />
          <CardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Priorité"
                  options={[
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'high', label: 'Haute' },
                    { value: 'medium', label: 'Moyenne' },
                    { value: 'low', label: 'Basse' },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                />
                <div className="pt-6">
                  <Badge variant="info">
                    Priorité : {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Badge>
                </div>
              </div>

              <Textarea
                label="Justification *"
                placeholder="Expliquez pourquoi vous avez besoin de ces fournitures..."
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
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
                  label="Coût Estimé (€)"
                  type="number"
                  step="0.01"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
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
                        <span>Coût Est. : €{item.estimatedCost.toFixed(2)}</span>
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
                  <span className="font-semibold text-neutral-900">Coût Estimé Total :</span>
                  <span className="text-2xl font-bold text-primary-600">
                    €{totalEstimatedCost.toFixed(2)}
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
              disabled={items.length === 0 || !justification.trim()}
            >
              Soumettre la Demande
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
