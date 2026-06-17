/**
 * Users Management Page - Admin Module
 * Manage users and permissions
 */

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Lock } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Input, Select } from '@components/FormInputs';
import { Modal } from '@components/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export const UsersManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const mockUsers: User[] = [
    {
      id: 'user-001',
      name: 'Karim Administrateur',
      email: 'admin@hammemi.com',
      role: 'Administrateur',
      department: 'Informatique',
      status: 'active',
      lastLogin: '2024-06-10 14:30',
      createdAt: '2024-01-01',
    },
    {
      id: 'user-002',
      name: 'Sonia Ben Ali',
      email: 'resp.service@hammemi.com',
      role: 'Responsable de Service',
      department: 'Ressources Humaines',
      status: 'active',
      lastLogin: '2024-06-10 09:15',
      createdAt: '2024-01-10',
    },
    {
      id: 'user-003',
      name: 'Mourad Gharbi',
      email: 'gestionnaire.stock@hammemi.com',
      role: 'Gestionnaire de Stock',
      department: 'Logistique',
      status: 'active',
      lastLogin: '2024-06-10 08:00',
      createdAt: '2024-01-15',
    },
    {
      id: 'user-004',
      name: 'Leila Mansour',
      email: 'resp.achats@hammemi.com',
      role: 'Responsable Achats',
      department: 'Achats & Finance',
      status: 'active',
      lastLogin: '2024-06-09 16:45',
      createdAt: '2024-02-01',
    },
    {
      id: 'user-005',
      name: 'Youssef Trabelsi',
      email: 'employe@hammemi.com',
      role: 'Employé',
      department: 'Commercial',
      status: 'active',
      lastLogin: '2024-06-10 10:30',
      createdAt: '2024-03-01',
    },
  ];

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  const columns = [
    {
      key: 'name' as const,
      label: 'Nom',
      sortable: true,
      render: (value: string, row: User) => (
        <div>
          <p className="font-medium text-neutral-900">{value}</p>
          <p className="text-sm text-neutral-600">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'department' as const,
      label: 'Département',
      sortable: true,
    },
    {
      key: 'role' as const,
      label: 'Rôle',
      sortable: true,
      render: (value: string) => {
        const variantMap: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
          'Administrateur':        'danger',
          'Responsable de Service':'warning',
          'Gestionnaire de Stock': 'info',
          'Responsable Achats':    'success',
          'Employé':               'primary' as any,
        };
        return <Badge variant={variantMap[value] ?? 'info'}>{value}</Badge>;
      },
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
      key: 'lastLogin' as const,
      label: 'Dernière Connexion',
      sortable: true,
      render: (value: string) => <span className="text-neutral-600">{value || 'Jamais'}</span>,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '250px',
      render: (_value: string, row: User) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit2 size={16} />}
            onClick={() => {
              setSelectedUser(row);
              setIsEditModalOpen(true);
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Lock size={16} />}
            onClick={() => {
              setSelectedUser(row);
              setIsResetPasswordModalOpen(true);
            }}
          />
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
          />
        </div>
      ),
    },
  ];

  const activeUsers = filteredUsers.filter((u) => u.status === 'active').length;
  const adminUsers = filteredUsers.filter((u) => u.role === 'Administrateur').length;
  const managerUsers = filteredUsers.filter((u) =>
    u.role === 'Responsable de Service' || u.role === 'Responsable Achats' || u.role === 'Gestionnaire de Stock'
  ).length;

  return (
    <MainLayout title="Gestion des Utilisateurs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Gestion des Utilisateurs</h2>
            <p className="text-neutral-600 mt-2">Gérez les comptes utilisateurs et les autorisations</p>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Ajouter un Utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Utilisateurs Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {filteredUsers.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{activeUsers}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Administrateurs</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{adminUsers}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Responsables</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{managerUsers}</p>
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
                  placeholder="Rechercher par nom ou email..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les Rôles' },
                  { value: 'Administrateur', label: 'Administrateur' },
                  { value: 'Responsable de Service', label: 'Responsable de Service' },
                  { value: 'Gestionnaire de Stock', label: 'Gestionnaire de Stock' },
                  { value: 'Responsable Achats', label: 'Responsable Achats' },
                  { value: 'Employé', label: 'Employé' },
                ]}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full md:w-48"
              />
              <Select
                options={[
                  { value: '', label: 'Tous les Statuts' },
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
          <CardHeader title={`Utilisateurs (${filteredUsers.length})`} />
          <CardBody>
            <DataTable<User>
              columns={columns}
              data={filteredUsers}
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
        title="Créer un Nouvel Utilisateur"
        size="lg"
        onConfirm={() => {
          setIsCreateModalOpen(false);
          alert('Utilisateur créé avec succès');
        }}
        confirmText="Créer"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nom Complet" placeholder="Prénom Nom" />
            <Input label="Email" type="email" placeholder="prenom.nom@hammemi.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Département" placeholder="ex: Logistique" />
            <Select
              label="Rôle"
              options={[
                { value: 'employe', label: 'Employé' },
                { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                { value: 'responsable_service', label: 'Responsable de Service' },
                { value: 'responsable_achats', label: 'Responsable Achats' },
                { value: 'admin', label: 'Administrateur' },
              ]}
            />
          </div>
          <Input label="Mot de passe initial" type="password" placeholder="••••••••" />
        </form>
      </Modal>

      {/* Edit Modal */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title="Modifier l'Utilisateur"
          size="lg"
          onConfirm={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
            alert('Utilisateur mis à jour avec succès');
          }}
          confirmText="Mettre à jour"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nom Complet" defaultValue={selectedUser.name} />
              <Input label="Email" type="email" defaultValue={selectedUser.email} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Département" defaultValue={selectedUser.department} />
              <Select
                label="Rôle"
                options={[
                  { value: 'employe', label: 'Employé' },
                  { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                  { value: 'responsable_service', label: 'Responsable de Service' },
                  { value: 'responsable_achats', label: 'Responsable Achats' },
                  { value: 'admin', label: 'Administrateur' },
                ]}
                defaultValue={selectedUser.role}
              />
            </div>
            <Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              defaultValue={selectedUser.status}
            />
          </form>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {selectedUser && (
        <Modal
          isOpen={isResetPasswordModalOpen}
          onClose={() => {
            setIsResetPasswordModalOpen(false);
            setSelectedUser(null);
          }}
          title="Réinitialiser le Mot de passe"
          onConfirm={() => {
            setIsResetPasswordModalOpen(false);
            setSelectedUser(null);
            alert('Email de réinitialisation de mot de passe envoyé à ' + selectedUser.email);
          }}
          confirmText="Envoyer l'Email de Réinitialisation"
        >
          <p className="text-neutral-700">
            Un email de réinitialisation de mot de passe sera envoyé à {selectedUser.email}. L'utilisateur pourra définir un nouveau mot de passe en cliquant sur le lien dans l'email.
          </p>
        </Modal>
      )}
    </MainLayout>
  );
};
