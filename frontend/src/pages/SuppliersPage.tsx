/**
 * Suppliers Page - Catalog Module
 * Manage suppliers
 */

import React, { useState, useMemo } from 'react';
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

export const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const mockSuppliers: Supplier[] = [
    {
      id: 'sup-001',
      name: 'Office Pro',
      code: 'OFP',
      email: 'sales@officepro.com',
      phone: '+1-555-0101',
      address: '123 Business St',
      city: 'New York',
      country: 'USA',
      contactPerson: 'John Smith',
      paymentTerms: 'Net 30',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-06-10',
    },
    {
      id: 'sup-002',
      name: 'Supplies Plus',
      code: 'SUP',
      email: 'contact@suppliesplus.com',
      phone: '+1-555-0102',
      address: '456 Commerce Ave',
      city: 'Boston',
      country: 'USA',
      contactPerson: 'Jane Doe',
      paymentTerms: 'Net 45',
      status: 'active',
      createdAt: '2024-01-12',
      updatedAt: '2024-06-09',
    },
    {
      id: 'sup-003',
      name: 'Tech Store',
      code: 'TEC',
      email: 'info@techstore.com',
      phone: '+1-555-0103',
      address: '789 Tech Boulevard',
      city: 'San Francisco',
      country: 'USA',
      contactPerson: 'Robert Johnson',
      paymentTerms: 'Net 30',
      status: 'active',
      createdAt: '2024-02-01',
      updatedAt: '2024-06-08',
    },
    {
      id: 'sup-004',
      name: 'Global Imports',
      code: 'GLO',
      email: 'orders@globalimports.com',
      phone: '+1-555-0104',
      address: '321 International Dr',
      city: 'Miami',
      country: 'USA',
      contactPerson: 'Maria Garcia',
      paymentTerms: 'Net 60',
      status: 'inactive',
      createdAt: '2024-02-15',
      updatedAt: '2024-06-01',
    },
  ];

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || supplier.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

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
      render: (_value: string, row: Supplier) => (
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
            onClick={() => {
              setSelectedSupplier(row);
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

  const handleCreateSupplier = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSupplier = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteSupplier = () => {
    setIsDeleting(false);
  };

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
            onClick={() => setIsCreateModalOpen(true)}
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
                  {mockSuppliers.length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Fournisseurs Actifs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockSuppliers.filter((s) => s.status === 'active').length}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Fournisseurs Inactifs</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {mockSuppliers.filter((s) => s.status === 'inactive').length}
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
            <DataTable<Supplier>
              columns={columns}
              data={filteredSuppliers}
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
        title="Créer un nouveau Fournisseur"
        size="lg"
        onConfirm={handleCreateSupplier}
        confirmText="Créer"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nom du Fournisseur" placeholder="ex. Office Pro" />
            <Input label="Code" placeholder="ex. OFP" maxLength={10} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="email@exemple.com" />
            <Input label="Téléphone" type="tel" placeholder="+1-555-0000" />
          </div>
          <Input label="Personne à contacter" placeholder="Nom du contact" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ville" placeholder="Ville" />
            <Input label="Pays" placeholder="Pays" />
          </div>
          <Textarea label="Adresse" placeholder="Adresse complète" rows={2} />
          <Input label="Conditions de paiement" placeholder="ex. Net 30" />
        </form>
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
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nom du Fournisseur" defaultValue={selectedSupplier.name} />
              <Input label="Code" defaultValue={selectedSupplier.code} maxLength={10} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" type="email" defaultValue={selectedSupplier.email} />
              <Input label="Téléphone" type="tel" defaultValue={selectedSupplier.phone} />
            </div>
            <Input label="Personne à contacter" defaultValue={selectedSupplier.contactPerson} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Ville" defaultValue={selectedSupplier.city} />
              <Input label="Pays" defaultValue={selectedSupplier.country} />
            </div>
            <Textarea label="Adresse" defaultValue={selectedSupplier.address} rows={2} />
            <Input label="Conditions de paiement" defaultValue={selectedSupplier.paymentTerms} />
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              defaultValue={selectedSupplier.status}
            />
          </form>
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
        title="Supprimer le Fournisseur"
        onConfirm={handleDeleteSupplier}
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible.
        </p>
      </Modal>
    </MainLayout>
  );
};
