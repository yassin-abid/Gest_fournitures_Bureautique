/**
 * Articles Page - Catalog Module
 * Shows list of articles with search, filter, and CRUD operations
 */

import React, { useState, useMemo } from 'react';
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
import type { Article } from '@/types/catalog';

export const ArticlesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const mockArticles: Article[] = [
    {
      id: 'art-001',
      code: 'OFF-001',
      name: 'A4 Paper (500 sheets)',
      description: 'Standard white copy paper',
      categoryId: 'cat-001',
      categoryName: 'Paper',
      supplierId: 'sup-001',
      supplierName: 'Office Pro',
      unit: 'Ream',
      unitPrice: 5.99,
      quantity: 450,
      minStock: 100,
      maxStock: 500,
      status: 'active',
      createdAt: '2024-06-01',
      updatedAt: '2024-06-10',
    },
    {
      id: 'art-002',
      code: 'PEN-001',
      name: 'Ballpoint Pen (Blue)',
      description: 'Professional ballpoint pen',
      categoryId: 'cat-002',
      categoryName: 'Writing Supplies',
      supplierId: 'sup-002',
      supplierName: 'Supplies Plus',
      unit: 'Box',
      unitPrice: 12.50,
      quantity: 75,
      minStock: 50,
      maxStock: 200,
      status: 'active',
      createdAt: '2024-06-02',
      updatedAt: '2024-06-09',
    },
    {
      id: 'art-003',
      code: 'FOLDER-001',
      name: 'File Folder (Yellow)',
      description: 'Legal size folder',
      categoryId: 'cat-003',
      categoryName: 'Filing',
      supplierId: 'sup-001',
      supplierName: 'Office Pro',
      unit: 'Pack',
      unitPrice: 8.75,
      quantity: 120,
      minStock: 80,
      maxStock: 300,
      status: 'active',
      createdAt: '2024-06-03',
      updatedAt: '2024-06-08',
    },
    {
      id: 'art-004',
      code: 'STAPLER-001',
      name: 'Stapler (Desktop)',
      description: 'Heavy-duty stapler',
      categoryId: 'cat-004',
      categoryName: 'Office Equipment',
      supplierId: 'sup-003',
      supplierName: 'Tech Store',
      unit: 'Piece',
      unitPrice: 25.00,
      quantity: 15,
      minStock: 5,
      maxStock: 30,
      status: 'active',
      createdAt: '2024-06-04',
      updatedAt: '2024-06-07',
    },
    {
      id: 'art-005',
      code: 'NOTEBOOK-001',
      name: 'Notebook (Ruled)',
      description: 'A5 ruled notebook',
      categoryId: 'cat-005',
      categoryName: 'Stationery',
      supplierId: 'sup-002',
      supplierName: 'Supplies Plus',
      unit: 'Pack',
      unitPrice: 3.50,
      quantity: 200,
      minStock: 100,
      maxStock: 500,
      status: 'inactive',
      createdAt: '2024-06-05',
      updatedAt: '2024-06-06',
    },
  ];

  const mockCategories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'cat-001', label: 'Papier' },
    { value: 'cat-002', label: 'Fournitures d\'écriture' },
    { value: 'cat-003', label: 'Classement' },
    { value: 'cat-004', label: 'Équipement de bureau' },
    { value: 'cat-005', label: 'Papeterie' },
  ];

  const mockSuppliers = [
    { value: '', label: 'Tous les fournisseurs' },
    { value: 'sup-001', label: 'Office Pro' },
    { value: 'sup-002', label: 'Supplies Plus' },
    { value: 'sup-003', label: 'Tech Store' },
  ];

  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesSearch =
        article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || article.categoryId === selectedCategory;
      const matchesSupplier = !selectedSupplier || article.supplierId === selectedSupplier;
      return matchesSearch && matchesCategory && matchesSupplier;
    });
  }, [searchTerm, selectedCategory, selectedSupplier]);

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
      render: (value: number) => `€${value.toFixed(2)}`,
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
      render: (_value: string, row: Article) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 size={16} />}
            onClick={() => {
              setSelectedArticle(row);
              setIsEditModalOpen(true);
            }}
          />
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => setIsDeleting(true)}
          />
        </div>
      ),
    },
  ];

  const handleCreateArticle = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditArticle = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteArticle = () => {
    setIsDeleting(false);
  };

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
            onClick={() => setIsCreateModalOpen(true)}
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
                  options={mockCategories}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-48"
                />
                <Select
                  options={mockSuppliers}
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
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
                <p className="text-neutral-600">Aucun article correspondant à vos critères de recherche n'a été trouvé.</p>
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
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Code de l'Article" placeholder="ex. OFF-001" />
            <Input label="Nom de l'Article" placeholder="ex. Papier A4" />
          </div>
          <Textarea label="Description" placeholder="Description de l'article" rows={3} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Catégorie"
              options={mockCategories.slice(1)}
              placeholder="Sélectionner une catégorie"
            />
            <Select
              label="Fournisseur"
              options={mockSuppliers.slice(1)}
              placeholder="Sélectionner un fournisseur"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Unité" placeholder="ex. Boîte, Rame" />
            <Input label="Prix Unitaire" type="number" step="0.01" placeholder="0.00" />
            <Input label="Quantité" type="number" placeholder="0" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Stock Min" type="number" placeholder="0" />
            <Input label="Stock Max" type="number" placeholder="0" />
          </div>
        </form>
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
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Code de l'Article" defaultValue={selectedArticle.code} />
              <Input label="Nom de l'Article" defaultValue={selectedArticle.name} />
            </div>
            <Textarea
              label="Description"
              defaultValue={selectedArticle.description}
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Catégorie"
                options={mockCategories.slice(1)}
                defaultValue={selectedArticle.categoryId}
              />
              <Select
                label="Fournisseur"
                options={mockSuppliers.slice(1)}
                defaultValue={selectedArticle.supplierId}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Unité" defaultValue={selectedArticle.unit} />
              <Input
                label="Prix Unitaire"
                type="number"
                step="0.01"
                defaultValue={selectedArticle.unitPrice}
              />
              <Input label="Quantité" type="number" defaultValue={selectedArticle.quantity} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Stock Min" type="number" defaultValue={selectedArticle.minStock} />
              <Input label="Stock Max" type="number" defaultValue={selectedArticle.maxStock} />
            </div>
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              defaultValue={selectedArticle.status}
            />
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Supprimer l'Article"
        onConfirm={handleDeleteArticle}
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
        </p>
      </Modal>
    </MainLayout>
  );
};
