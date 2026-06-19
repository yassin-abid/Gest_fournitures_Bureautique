/**
 * Categories Page - Catalog Module
 * Manage product categories
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { Modal } from '@components/Modal';
import { Input, Textarea, Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import type { Category } from '@/types/catalog';
import { catalogService } from '@/services/catalogService';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    status: 'active' as 'active' | 'inactive',
  });

  const fetchCategories = async () => {
    try {
      const data = await catalogService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      status: 'active',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      code: category.code || '',
      status: category.status,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateCategory = async () => {
    if (!formData.name) {
      alert("Le nom est obligatoire");
      return;
    }
    try {
      await catalogService.createCategory(formData);
      setIsCreateModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      alert('Erreur lors de la création: ' + err.message);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name) return;
    try {
      await catalogService.updateCategory(selectedCategory.id, formData);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      alert('Erreur lors de la modification: ' + err.message);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await catalogService.deleteCategory(selectedCategory.id);
      setIsDeleting(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
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
      render: (_value: number, row: Category) => (
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
              setSelectedCategory(row);
              setIsDeleting(true);
            }}
          />
        </div>
      ),
    },
  ];

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
            onClick={openCreateModal}
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
                  {categories.length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Catégories Actives</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {categories.filter((c) => c.status === 'active').length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Articles Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {categories.reduce((sum, c) => sum + (c.itemCount || 0), 0)}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Catégories (${categories.length})`} />
          <CardBody>
            <DataTable<Category>
              columns={columns}
              data={categories}
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
        <div className="space-y-4">
          <Input 
            label="Code Catégorie" 
            placeholder="ex. PAP" 
            maxLength={10}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <Input 
            label="Nom Catégorie" 
            placeholder="ex. Produits en papier" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea 
            label="Description" 
            placeholder="Description de la catégorie" 
            rows={3} 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
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
          <div className="space-y-4">
            <Input 
              label="Code Catégorie" 
              maxLength={10} 
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <Input 
              label="Nom Catégorie" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Textarea
              label="Description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        title="Supprimer la Catégorie"
        onConfirm={handleDeleteCategory}
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
          {selectedCategory?.itemCount && selectedCategory.itemCount > 0 ? (
            <span className="block mt-2 text-red-600 font-semibold">
              Avertissement : Cette catégorie contient {selectedCategory.itemCount} articles.
              La suppression échouera si la base de données empêche la suppression des catégories non vides.
            </span>
          ) : null}
        </p>
      </Modal>
    </MainLayout>
  );
};
