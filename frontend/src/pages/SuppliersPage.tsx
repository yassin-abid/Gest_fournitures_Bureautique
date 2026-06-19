/**
 * Suppliers Page - Catalog Module
 * Manage suppliers
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Modal } from '@components/Modal';
import { Input, Textarea, Select } from '@components/FormInputs';
import { Badge } from '@components/Badge';
import type { Supplier } from '@/types/catalog';
import { catalogService } from '@/services/catalogService';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    contactPerson: '',
    paymentTerms: '',
    status: 'active' as 'active' | 'inactive',
  });

  const fetchSuppliers = async () => {
    try {
      const data = await catalogService.getSuppliers(1, 100);
      setSuppliers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      (supplier.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      contactPerson: '',
      paymentTerms: '',
      status: 'active',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      code: supplier.code,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || '',
      contactPerson: supplier.contactPerson || '',
      paymentTerms: supplier.paymentTerms || '',
      status: supplier.status,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSupplier = async () => {
    if (!formData.name || !formData.email) {
      alert("Nom et Email sont obligatoires.");
      return;
    }
    try {
      await catalogService.createSupplier(formData);
      setIsCreateModalOpen(false);
      fetchSuppliers();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      await catalogService.updateSupplier(selectedSupplier.id, formData);
      setIsEditModalOpen(false);
      setSelectedSupplier(null);
      fetchSuppliers();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      await catalogService.deleteSupplier(selectedSupplier.id);
      setIsDeleting(false);
      setSelectedSupplier(null);
      fetchSuppliers();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Nom',
      sortable: true,
      render: (value: string, row: Supplier) => (
        <div>
          <p className="font-medium text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-600">{row.code}</p>
        </div>
      ),
    },
    {
      key: 'contactPerson' as const,
      label: 'Contact',
      sortable: false,
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: false,
      render: (value: string) => (
        <a href={`mailto:${value}`} className="text-primary-600 hover:underline">
          {value}
        </a>
      ),
    },
    {
      key: 'phone' as const,
      label: 'Téléphone',
      sortable: false,
    },
    {
      key: 'paymentTerms' as const,
      label: 'Conditions de paiement',
      sortable: false,
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
      width: '200px',
      render: (_value: number, row: Supplier) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSupplier(row);
              setIsDetailModalOpen(true);
            }}
          >
            Voir
          </Button>
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
              setSelectedSupplier(row);
              setIsDeleting(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Fournisseurs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Fournisseurs</h2>
            <p className="text-neutral-600 mt-2">Gérez les informations de vos fournisseurs</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={openCreateModal}
          >
            Ajouter un Fournisseur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Fournisseurs Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {suppliers.length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Fournisseurs Actifs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {suppliers.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Fournisseurs Inactifs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {suppliers.filter((s) => s.status === 'inactive').length}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Rechercher des fournisseurs par nom, code ou email..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'active', label: 'Actif' },
                  { value: 'inactive', label: 'Inactif' },
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Fournisseurs (${filteredSuppliers.length})`} />
          <CardBody>
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">Aucun fournisseur trouvé.</p>
              </div>
            ) : (
              <DataTable<Supplier>
                columns={columns}
                data={filteredSuppliers}
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
        title="Créer un nouveau Fournisseur"
        size="lg"
        onConfirm={handleCreateSupplier}
        confirmText="Créer"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nom du Fournisseur *" 
              placeholder="ex. Office Pro" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              label="Code *" 
              placeholder="ex. OFP" 
              maxLength={10} 
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Email *" 
              type="email" 
              placeholder="email@exemple.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input 
              label="Téléphone" 
              type="tel" 
              placeholder="+1-555-0000" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Input 
            label="Personne à contacter" 
            placeholder="Nom du contact" 
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Ville" 
              placeholder="Ville" 
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input 
              label="Pays" 
              placeholder="Pays" 
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <Textarea 
            label="Adresse" 
            placeholder="Adresse complète" 
            rows={2} 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input 
            label="Conditions de paiement" 
            placeholder="ex. Net 30" 
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSupplier(null);
          }}
          title="Modifier le Fournisseur"
          size="lg"
          onConfirm={handleEditSupplier}
          confirmText="Mettre à jour"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Nom du Fournisseur *" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input 
                label="Code *" 
                maxLength={10} 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Email *" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                label="Téléphone" 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <Input 
              label="Personne à contacter" 
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Ville" 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input 
                label="Pays" 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <Textarea 
              label="Adresse" 
              rows={2} 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input 
              label="Conditions de paiement" 
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
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
      )}

      {/* Detail Modal */}
      {selectedSupplier && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedSupplier(null);
          }}
          title="Détails du Fournisseur"
          size="md"
          closeButton
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{selectedSupplier.name}</h3>
              <Badge variant={selectedSupplier.status === 'active' ? 'success' : 'warning'} className="mt-2">
                {selectedSupplier.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-neutral-600" />
                <div>
                  <p className="text-sm text-neutral-600">Email</p>
                  <p className="font-medium text-neutral-900">{selectedSupplier.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-neutral-600" />
                <div>
                  <p className="text-sm text-neutral-600">Téléphone</p>
                  <p className="font-medium text-neutral-900">{selectedSupplier.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-neutral-600 mt-1" />
                <div>
                  <p className="text-sm text-neutral-600">Adresse</p>
                  <p className="font-medium text-neutral-900">
                    {selectedSupplier.address}<br />
                    {selectedSupplier.city}, {selectedSupplier.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Personne à contacter</p>
                <p className="font-medium text-neutral-900">{selectedSupplier.contactPerson}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Conditions de paiement</p>
                <p className="font-medium text-neutral-900">{selectedSupplier.paymentTerms}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Désactiver le Fournisseur"
        onConfirm={handleDeleteSupplier}
        confirmText="Désactiver"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir désactiver ce fournisseur ? Cette action empêchera la création de nouvelles commandes avec lui.
        </p>
      </Modal>
    </MainLayout>
  );
};
