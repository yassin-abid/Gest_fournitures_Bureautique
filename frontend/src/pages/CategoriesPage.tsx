/**
 * Categories Page - Catalog Module
 * Manage product categories
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Modal } from '@components/Modal';
import { Input, Textarea, Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import type { Category } from '@/types/catalog';

export const CategoriesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const mockCategories: Category[] = [
    {
      id: 'cat-001',
      name: 'Paper',
      description: 'Paper products and stationery',
      code: 'PAP',
      itemCount: 12,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-10',
    },
    {
      id: 'cat-002',
      name: 'Writing Supplies',
      description: 'Pens, pencils, markers',
      code: 'WRI',
      itemCount: 25,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-09',
    },
    {
      id: 'cat-003',
      name: 'Filing',
      description: 'Folders, binders, filing systems',
      code: 'FIL',
      itemCount: 8,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-08',
    },
    {
      id: 'cat-004',
      name: 'Office Equipment',
      description: 'Staplers, hole punches, etc',
      code: 'EQU',
      itemCount: 15,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-07',
    },
    {
      id: 'cat-005',
      name: 'Stationery',
      description: 'Notepads, sticky notes',
      code: 'STA',
      itemCount: 0,
      status: 'inactive',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-06',
    },
  ];

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
    },
    {
      key: 'description' as const,
      label: 'Description',
      sortable: false,
      render: (value: string) => <span className="text-neutral-600">{value || '-'}</span>,
    },
    {
      key: 'itemCount' as const,
      label: 'Articles',
      sortable: true,
      width: '100px',
      render: (value: number) => (
        <span className="font-medium text-neutral-900">{value || 0}</span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '120px',
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
      width: '150px',
      render: (_value: string, row: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 size={16} />}
            onClick={() => {
              setSelectedCategory(row);
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

  const handleCreateCategory = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditCategory = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteCategory = () => {
    setIsDeleting(false);
  };

  return (
    <MainLayout title="Catégories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Catégories</h2>
            <p className="text-neutral-600 mt-2">Organisez vos articles en catégories</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Ajouter une Catégorie
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Catégories Totales</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockCategories.length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Catégories Actives</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockCategories.filter((c) => c.status === 'active').length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Articles Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockCategories.reduce((sum, c) => sum + (c.itemCount || 0), 0)}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Catégories (${mockCategories.length})`} />
          <CardBody>
            <DataTable<Category>
              columns={columns}
              data={mockCategories}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une nouvelle Catégorie"
        onConfirm={handleCreateCategory}
        confirmText="Créer"
      >
        <form className="space-y-4">
          <Input label="Code Catégorie" placeholder="ex. PAP" maxLength={10} />
          <Input label="Nom Catégorie" placeholder="ex. Produits en papier" />
          <Textarea label="Description" placeholder="Description de la catégorie" rows={3} />
          <Select
            label="Statut"
            options={[
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
            ]}
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      {selectedCategory && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCategory(null);
          }}
          title="Modifier la Catégorie"
          onConfirm={handleEditCategory}
          confirmText="Mettre à jour"
        >
          <form className="space-y-4">
            <Input label="Code Catégorie" defaultValue={selectedCategory.code} maxLength={10} />
            <Input label="Nom Catégorie" defaultValue={selectedCategory.name} />
            <Textarea
              label="Description"
              defaultValue={selectedCategory.description}
              rows={3}
            />
            <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm font-medium text-neutral-700">Articles dans la catégorie :</span>
              <span className="font-semibold text-neutral-900">{selectedCategory.itemCount || 0}</span>
            </div>
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              defaultValue={selectedCategory.status}
            />
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Supprimer la Catégorie"
        onConfirm={handleDeleteCategory}
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
          {selectedCategory?.itemCount && selectedCategory.itemCount > 0 && (
            <span className="block mt-2 text-red-600">
              Avertissement : Cette catégorie contient {selectedCategory.itemCount} articles.
            </span>
          )}
        </p>
      </Modal>
    </MainLayout>
  );
};
