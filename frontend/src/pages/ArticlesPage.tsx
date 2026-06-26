/**
 * Articles Page - Catalog Module
 * Shows list of articles with search, filter, and CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Alert } from '@components/Alert';
import { Input, Select, Textarea } from '@components/FormInputs';
import type { Article, Category, Supplier } from '@/types/catalog';
import { catalogService } from '@/services/catalogService';

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedSupplier, setSelectedSupplier] = useState<number | ''>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    categoryId: 0,
    supplierId: 0,
    unit: '',
    unitPrice: 0,
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    status: 'active' as 'active' | 'inactive',
  });

  const fetchData = async () => {
    try {
      const [articlesData, categoriesData, suppliersData] = await Promise.all([
        catalogService.getArticles(1, 100),
        catalogService.getCategories(),
        catalogService.getSuppliers(1, 100),
      ]);
      setArticles(articlesData.data);
      setCategories(categoriesData);
      setSuppliers(suppliersData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      (article.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || article.categoryId === Number(selectedCategory);
    const matchesSupplier = selectedSupplier === '' || article.supplierId === Number(selectedSupplier);
    return matchesSearch && matchesCategory && matchesSupplier;
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      categoryId: 0,
      supplierId: 0,
      unit: '',
      unitPrice: 0,
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      status: 'active',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      code: article.code || '',
      name: article.name || '',
      description: article.description || '',
      categoryId: article.categoryId || 0,
      supplierId: article.supplierId || 0,
      unit: article.unit || '',
      unitPrice: article.unitPrice || 0,
      quantity: article.quantity || 0,
      minStock: article.minStock || 0,
      maxStock: article.maxStock || 0,
      status: article.status || 'active',
    });
    setIsEditModalOpen(true);
  };

  const handleCreateArticle = async () => {
    if (!formData.name || !formData.code || !formData.categoryId) {
      alert("Veuillez remplir les champs obligatoires (Code, Nom, Catégorie).");
      return;
    }
    try {
      await catalogService.createArticle(formData);
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleEditArticle = async () => {
    if (!selectedArticle) return;
    try {
      await catalogService.updateArticle(selectedArticle.id, formData);
      setIsEditModalOpen(false);
      setSelectedArticle(null);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    try {
      await catalogService.deleteArticle(selectedArticle.id);
      setIsDeleting(false);
      setSelectedArticle(null);
      fetchData();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const columns = [
    {
      key: 'code' as const,
      label: 'Code',
      sortable: true,
      width: '100px',
    },
    {
      key: 'name' as const,
      label: 'Nom',
      sortable: true,
      render: (value: string, row: Article) => (
        <div>
          <p className="font-medium text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-600">{row.categoryName}</p>
        </div>
      ),
    },
    {
      key: 'supplierName' as const,
      label: 'Fournisseur',
      sortable: true,
    },
    {
      key: 'unitPrice' as const,
      label: 'Prix Unitaire',
      sortable: true,
      render: (value: number) => `${(value || 0).toFixed(2)} TND`,
    },
    {
      key: 'quantity' as const,
      label: 'Stock Actuel',
      sortable: true,
      render: (value: number, row: Article) => (
        <span className={value < row.minStock ? 'text-red-600 font-medium' : 'text-neutral-900'}>
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      render: (_value: number, row: Article) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 size={16} />}
            onClick={() => openEditModal(row)}
          />
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => {
              setSelectedArticle(row);
              setIsDeleting(true);
            }}
          />
        </div>
      ),
    },
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
  ];

  const supplierOptions = [
    { value: '', label: 'Tous les fournisseurs' },
    ...suppliers.map(s => ({ value: s.id.toString(), label: s.name }))
  ];

  return (
    <MainLayout title="Articles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Articles</h2>
            <p className="text-neutral-600 mt-2">Gérez votre catalogue de fournitures de bureau</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={openCreateModal}
          >
            Ajouter un Article
          </Button>
        </div>

        {/* Alert */}
        {filteredArticles.some((a) => a.quantity < a.minStock) && (
          <Alert type="warning" closable>
            Certains articles sont en dessous du stock minimum. Vérifiez l'état du stock.
          </Alert>
        )}

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Rechercher des articles par nom ou code..."
                    onSearch={setSearchTerm}
                  />
                </div>
                <Select
                  options={categoryOptions}
                  value={selectedCategory.toString()}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : '')}
                  className="w-full md:w-48"
                />
                <Select
                  options={supplierOptions}
                  value={selectedSupplier.toString()}
                  onChange={(e) => setSelectedSupplier(e.target.value ? Number(e.target.value) : '')}
                  className="w-full md:w-48"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Articles (${filteredArticles.length})`} />
          <CardBody>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">Aucun article trouvé.</p>
              </div>
            ) : (
              <DataTable<Article>
                columns={columns}
                data={filteredArticles}
                rowKey="id"
                pageSize={10}
              />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un nouvel Article"
        size="lg"
        onConfirm={handleCreateArticle}
        confirmText="Créer"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Code de l'Article *" 
              placeholder="ex. OFF-001" 
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Input 
              label="Nom de l'Article *" 
              placeholder="ex. Papier A4" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <Textarea 
            label="Description" 
            placeholder="Description de l'article" 
            rows={3} 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Catégorie *"
              options={categoryOptions.slice(1)}
              value={formData.categoryId?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            />
            <Select
              label="Fournisseur"
              options={supplierOptions.slice(1)}
              value={formData.supplierId?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Unité" 
              placeholder="ex. Boîte, Rame" 
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
            <Input 
              label="Prix Unitaire" 
              type="number" 
              step="0.01" 
              value={formData.unitPrice?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
            />
            <Input 
              label="Quantité Initiale" 
              type="number" 
              value={formData.quantity?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Stock Min" 
              type="number" 
              value={formData.minStock?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
            />
            <Input 
              label="Stock Max" 
              type="number" 
              value={formData.maxStock?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      {selectedArticle && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedArticle(null);
          }}
          title="Modifier l'Article"
          size="lg"
          onConfirm={handleEditArticle}
          confirmText="Mettre à jour"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Code de l'Article *" 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              <Input 
                label="Nom de l'Article *" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Textarea
              label="Description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Catégorie *"
                options={categoryOptions.slice(1)}
                value={formData.categoryId?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              />
              <Select
                label="Fournisseur"
                options={supplierOptions.slice(1)}
                value={formData.supplierId?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                label="Unité" 
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
              <Input
                label="Prix Unitaire"
                type="number"
                step="0.01"
                value={formData.unitPrice?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              />
              <Input 
                label="Quantité" 
                type="number" 
                value={formData.quantity?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Stock Min" 
                type="number" 
                value={formData.minStock?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
              />
              <Input 
                label="Stock Max" 
                type="number" 
                value={formData.maxStock?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Désactiver l'Article"
        onConfirm={handleDeleteArticle}
        confirmText="Désactiver"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir désactiver cet article ? Il ne sera plus disponible pour les nouvelles commandes.
        </p>
      </Modal>
    </MainLayout>
  );
};
