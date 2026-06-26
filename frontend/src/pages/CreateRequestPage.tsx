/**
 * Create Request Page - Requests Module
 * Form to create new supply request
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select, Textarea } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import { requestsService } from '@services/requestsService';
import { catalogService } from '@services/catalogService';
import type { RequestPriority } from '@/types/requests';
import type { Article } from '@/types/catalog';

interface FormItem {
  id: string; // local temporary id
  articleId: number;
  articleName: string;
  quantity: number;
  estimatedCost: number;
  notes: string;
}

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [priority, setPriority] = useState<RequestPriority>('normale');
  const [justification, setJustification] = useState('');
  const [items, setItems] = useState<FormItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  
  const [newItemArticle, setNewItemArticle] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch available articles
    const fetchArticles = async () => {
      try {
        const res = await catalogService.getArticles(1, 500); // Fetch a lot to populate dropdown
        setArticles(res.data);
      } catch (err) {
        console.error('Error fetching articles', err);
      }
    };
    fetchArticles();
  }, []);

  const getArticle = (articleId: number) => {
    return articles.find((a) => Number(a.id) === articleId);
  };

  const addItem = () => {
    if (!newItemArticle || !newItemQuantity) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const articleId = Number(newItemArticle);
    const article = getArticle(articleId);
    if (!article) return;

    const quantity = parseInt(newItemQuantity);
    const estimatedCost = (article.unitPrice || 0) * quantity;

    const newItem: FormItem = {
      id: `item-${Date.now()}`,
      articleId,
      articleName: article.name,
      quantity,
      estimatedCost,
      notes: newItemNotes,
    };

    setItems([...items, newItem]);
    setNewItemArticle('');
    setNewItemQuantity('');
    setNewItemNotes('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalEstimatedCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);

  const handleSubmit = async () => {
    if (!justification.trim()) {
      alert('Veuillez fournir une justification');
      return;
    }
    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestsService.createRequest({
        priority,
        justification,
        items: items.map(i => ({
          articleId: i.articleId,
          quantity: i.quantity,
          notes: i.notes,
        })),
      });
      alert('Demande soumise avec succès');
      navigate('/requests');
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const articleOptions = [
    { value: '', label: 'Sélectionner un article' },
    ...articles.map(a => ({ value: a.id.toString(), label: `${a.name} - ${(a.unitPrice || 0).toFixed(2)} TND` }))
  ];

  return (
    <MainLayout title="Créer une Demande de Fournitures">
      <div className="space-y-6">
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
                    { value: 'urgente', label: 'Urgente' },
                    { value: 'haute', label: 'Haute' },
                    { value: 'normale', label: 'Normale' },
                    { value: 'basse', label: 'Basse' },
                  ]}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as RequestPriority)}
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
                  options={articleOptions}
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
                <Textarea
                  label="Notes"
                  placeholder="Notes particulières pour cet article..."
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
                        <span>Coût Est. : {item.estimatedCost.toFixed(2)} TND</span>
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
                    {totalEstimatedCost.toFixed(2)} TND
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardFooter>
            <Button variant="ghost" onClick={() => navigate('/requests')}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={items.length === 0 || !justification.trim() || isSubmitting}
            >
              Soumettre la Demande
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
