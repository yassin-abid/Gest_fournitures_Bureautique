/**
 * Roles & Permissions Page - Admin Module
 * Manage roles and their permissions
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Modal } from '@components/Modal';
import { Input, Textarea, Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  userCount?: number;
  status: 'active' | 'inactive';
}

export const RolesPermissionsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const mockRoles: Role[] = [
    {
      id: 'role-001',
      name: 'Admin',
      description: 'Full system access',
      userCount: 2,
      status: 'active',
      permissions: [
        {
          id: 'perm-001',
          name: 'View All Articles',
          resource: 'articles',
          action: 'read',
        },
        {
          id: 'perm-002',
          name: 'Create Articles',
          resource: 'articles',
          action: 'create',
        },
        {
          id: 'perm-003',
          name: 'Manage Users',
          resource: 'users',
          action: 'manage',
        },
        {
          id: 'perm-004',
          name: 'Manage Roles',
          resource: 'roles',
          action: 'manage',
        },
      ],
    },
    {
      id: 'role-002',
      name: 'Manager',
      description: 'Can approve requests and create orders',
      userCount: 4,
      status: 'active',
      permissions: [
        {
          id: 'perm-005',
          name: 'View All Articles',
          resource: 'articles',
          action: 'read',
        },
        {
          id: 'perm-006',
          name: 'Approve Requests',
          resource: 'requests',
          action: 'approve',
        },
        {
          id: 'perm-007',
          name: 'Create Orders',
          resource: 'orders',
          action: 'create',
        },
      ],
    },
    {
      id: 'role-003',
      name: 'User',
      description: 'Basic user access',
      userCount: 18,
      status: 'active',
      permissions: [
        {
          id: 'perm-008',
          name: 'View Articles',
          resource: 'articles',
          action: 'read',
        },
        {
          id: 'perm-009',
          name: 'Create Requests',
          resource: 'requests',
          action: 'create',
        },
      ],
    },
  ];

  const allPermissions: Permission[] = [
    { id: 'perm-001', name: 'View Articles', resource: 'articles', action: 'read' },
    { id: 'perm-002', name: 'Create Articles', resource: 'articles', action: 'create' },
    { id: 'perm-003', name: 'Edit Articles', resource: 'articles', action: 'edit' },
    { id: 'perm-004', name: 'Delete Articles', resource: 'articles', action: 'delete' },
    { id: 'perm-005', name: 'View Requests', resource: 'requests', action: 'read' },
    { id: 'perm-006', name: 'Create Requests', resource: 'requests', action: 'create' },
    { id: 'perm-007', name: 'Approve Requests', resource: 'requests', action: 'approve' },
    { id: 'perm-008', name: 'View Orders', resource: 'orders', action: 'read' },
    { id: 'perm-009', name: 'Create Orders', resource: 'orders', action: 'create' },
    { id: 'perm-010', name: 'View Reports', resource: 'reports', action: 'read' },
    { id: 'perm-011', name: 'Manage Users', resource: 'users', action: 'manage' },
    { id: 'perm-012', name: 'Manage Roles', resource: 'roles', action: 'manage' },
  ];

  return (
    <MainLayout title="Rôles et Autorisations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Rôles et Autorisations</h2>
            <p className="text-neutral-600 mt-2">Gérez les rôles et leurs autorisations</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Créer un Rôle
          </Button>
        </div>

        <Alert type="info">
          Définissez les rôles et assignez des autorisations pour contrôler ce que les utilisateurs peuvent faire dans le système.
        </Alert>

        {/* Roles List */}
        <div className="space-y-4">
          {mockRoles.map((role) => (
            <Card key={role.id}>
              <CardBody>
                <div className="space-y-4">
                  {/* Role Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-neutral-900">{role.name}</h3>
                        <Badge variant={role.status === 'active' ? 'success' : 'warning'}>
                          {role.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">{role.userCount || 0}</p>
                        <p className="text-xs text-neutral-600">utilisateurs</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Edit2 size={16} />}
                        onClick={() => {
                          setSelectedRole(role);
                          setIsEditModalOpen(true);
                        }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={16} />}
                        onClick={() => {
                          setSelectedRole(role);
                          setIsDeleteModalOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Permissions Grid */}
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-3">
                      Autorisations ({role.permissions.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {role.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start gap-2 p-3 bg-neutral-50 rounded-lg">
                          <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-900">
                              {permission.name}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {permission.resource} - {permission.action}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Available Permissions Reference */}
        <Card>
          <CardHeader title="Référence des Autorisations Disponibles" />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPermissions.map((permission) => (
                <div key={permission.id} className="flex items-start gap-2 p-3 border border-neutral-200 rounded-lg">
                  <Circle size={16} className="text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{permission.name}</p>
                    <p className="text-xs text-neutral-600">
                      {permission.resource} - {permission.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un Nouveau Rôle"
        size="lg"
        onConfirm={() => {
          setIsCreateModalOpen(false);
          alert('Rôle créé avec succès');
        }}
        confirmText="Créer"
      >
        <form className="space-y-4">
          <Input label="Nom du Rôle" placeholder="ex., Superviseur" />
          <Textarea
            label="Description"
            placeholder="Décrivez ce que ce rôle peut faire..."
            rows={3}
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Sélectionner les Autorisations
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allPermissions.map((permission) => (
                <label key={permission.id} className="flex items-start gap-3 p-2 hover:bg-neutral-50 rounded">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-medium text-neutral-900">{permission.name}</p>
                    <p className="text-xs text-neutral-600">
                      {permission.resource} - {permission.action}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {selectedRole && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
          }}
          title="Modifier le Rôle"
          size="lg"
          onConfirm={() => {
            setIsEditModalOpen(false);
            setSelectedRole(null);
            alert('Rôle mis à jour avec succès');
          }}
          confirmText="Mettre à jour"
        >
          <form className="space-y-4">
            <Input label="Nom du Rôle" defaultValue={selectedRole.name} />
            <Textarea
              label="Description"
              defaultValue={selectedRole.description}
              rows={3}
            />
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              defaultValue={selectedRole.status}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Autorisations
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allPermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-3 p-2 hover:bg-neutral-50 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      defaultChecked={selectedRole.permissions.some((p) => p.id === permission.id)}
                    />
                    <div>
                      <p className="font-medium text-neutral-900">{permission.name}</p>
                      <p className="text-xs text-neutral-600">
                        {permission.resource} - {permission.action}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        title="Supprimer le Rôle"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
          alert('Rôle supprimé avec succès');
        }}
        confirmText="Supprimer"
      >
        <p className="text-neutral-700">
          Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action ne peut pas être annulée.
          {selectedRole?.userCount && selectedRole.userCount > 0 && (
            <span className="block mt-2 text-red-600">
              Attention : {selectedRole.userCount} utilisateur(s) sont assignés à ce rôle.
            </span>
          )}
        </p>
      </Modal>
    </MainLayout>
  );
};
