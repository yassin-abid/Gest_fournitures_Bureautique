/**
 * Users Management Page - Admin Module
 * Manage users and permissions
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Lock, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Input, Select } from '@components/FormInputs';
import { Modal } from '@components/Modal';
import { adminService } from '@services/adminService';
import type { User } from '@/types/auth';

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<any>({});

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers(1, 100, selectedRole, searchTerm);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus = !selectedStatus || u.status === selectedStatus;
      return matchesStatus;
    });
  }, [users, selectedStatus]);

  const columns = [
    {
      key: 'email' as const,
      label: 'Nom',
      sortable: true,
      render: (_value: string, row: User) => (
        <div>
          <p className="font-medium text-neutral-900">{row.firstName} {row.lastName}</p>
          <p className="text-sm text-neutral-600">{row.email}</p>
          {row.passwordResetRequested && (
            <Badge variant="warning" className="mt-1 text-xs">Demande Réinit. MDP</Badge>
          )}
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
          'admin': 'danger',
          'responsable_service': 'warning',
          'gestionnaire_stock': 'info',
          'responsable_achats': 'success',
          'employe': 'primary' as any,
        };
        const labelMap: Record<string, string> = {
          'admin': 'Administrateur',
          'responsable_service': 'Responsable de Service',
          'gestionnaire_stock': 'Gestionnaire de Stock',
          'responsable_achats': 'Responsable Achats',
          'employe': 'Employé',
        };
        return <Badge variant={variantMap[value] ?? 'info'}>{labelMap[value] || value}</Badge>;
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
      key: 'updatedAt' as const,
      label: 'Dernière Connexion',
      sortable: true,
      render: (_value: string, row: User) => <span className="text-neutral-600">{row.updatedAt && row.updatedAt !== row.createdAt ? new Date(row.updatedAt).toLocaleDateString() : 'Jamais'}</span>,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '250px',
      render: (_value: string, row: User) => (
        <div className="flex items-center gap-2">
          {row.status === 'inactive' ? (
            <div className="flex items-center gap-1">
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle size={16} />}
                onClick={async () => {
                  try {
                    await adminService.activateUser(row.id.toString());
                    fetchUsers();
                  } catch (e: any) {
                    alert("Erreur lors de l'activation: " + e.message);
                  }
                }}
                title="Approuver l'utilisateur"
              >
                Approuver
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle size={16} />}
                onClick={async () => {
                  if (confirm('Êtes-vous sûr de vouloir refuser cette demande ? Le compte sera supprimé.')) {
                    try {
                      await adminService.hardDeleteUser(row.id.toString());
                      fetchUsers();
                    } catch (e: any) {
                      alert("Erreur lors de la suppression: " + e.message);
                    }
                  }
                }}
                title="Refuser la demande"
              />
            </div>
          ) : row.passwordResetRequested ? (
            <div className="flex items-center gap-1">
              <Button
                variant="primary"
                size="sm"
                icon={<Lock size={16} />}
                onClick={() => {
                  setSelectedUser(row);
                  setFormData({ ...formData, newPassword: '' });
                  setIsResetPasswordModalOpen(true);
                }}
                title="Définir un nouveau mot de passe"
              >
                Changer MDP
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle size={16} />}
                onClick={async () => {
                  if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
                    try {
                      // fallback to updating the user without resetting the password
                      await adminService.updateUser(row.id.toString(), { status: row.status });
                      fetchUsers();
                    } catch (e: any) {
                      alert("Erreur: " + e.message);
                    }
                  }
                }}
                title="Ignorer la demande"
              />
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<Edit2 size={16} />}
                onClick={() => {
                  setSelectedUser(row);
                  setFormData({
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    department: row.department,
                    role: row.role,
                    status: row.status,
                  });
                  setIsEditModalOpen(true);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={<Lock size={16} />}
                onClick={() => {
                  setSelectedUser(row);
                  setFormData({ ...formData, newPassword: '' });
                  setIsResetPasswordModalOpen(true);
                }}
              />
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={async () => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                    await adminService.deleteUser(row.id.toString());
                    fetchUsers();
                  }
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const activeUsers = filteredUsers.filter((u) => u.status === 'active').length;
  const pendingUsers = filteredUsers.filter((u) => u.status === 'inactive').length;
  const adminUsers = filteredUsers.filter((u) => u.role === 'admin').length;
  const managerUsers = filteredUsers.filter((u) =>
    ['responsable_service', 'responsable_achats', 'gestionnaire_stock'].includes(u.role)
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
            onClick={() => {
              setFormData({});
              setIsCreateModalOpen(true);
            }}
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
                <p className="text-sm text-neutral-600">En attente (Inactifs)</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pendingUsers}</p>
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
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'responsable_service', label: 'Responsable de Service' },
                  { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                  { value: 'responsable_achats', label: 'Responsable Achats' },
                  { value: 'employe', label: 'Employé' },
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
        onConfirm={async () => {
          try {
            await adminService.createUser({
              email: formData.email,
              password: formData.password || 'Password123!',
              firstName: formData.firstName || '',
              lastName: formData.lastName || '',
              department: formData.department,
              role: formData.role || 'employe',
            } as any);
            setIsCreateModalOpen(false);
            setFormData({});
            fetchUsers();
          } catch (e) {
            alert('Erreur lors de la création');
          }
        }}
        confirmText="Créer"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Prénom" placeholder="Prénom" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <Input label="Nom" placeholder="Nom" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <Input label="Email" type="email" placeholder="prenom.nom@hammemi.com" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <Input label="Département" placeholder="ex: Logistique" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Rôle"
              options={[
                { value: 'employe', label: 'Employé' },
                { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                { value: 'responsable_service', label: 'Responsable de Service' },
                { value: 'responsable_achats', label: 'Responsable Achats' },
                { value: 'admin', label: 'Administrateur' },
              ]}
              value={formData.role || 'employe'}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
            <Input label="Mot de passe initial" type="password" placeholder="••••••••" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
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
          onConfirm={async () => {
            if (!selectedUser) return;
            try {
              await adminService.updateUser(selectedUser.id.toString(), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                department: formData.department,
                role: formData.role,
                status: formData.status,
              });
              setIsEditModalOpen(false);
              setSelectedUser(null);
              fetchUsers();
            } catch (e) {
              alert('Erreur lors de la modification');
            }
          }}
          confirmText="Mettre à jour"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Prénom" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <Input label="Nom" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              <Input label="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled />
              <Input label="Département" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Rôle"
                options={[
                  { value: 'employe', label: 'Employé' },
                  { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                  { value: 'responsable_service', label: 'Responsable de Service' },
                  { value: 'responsable_achats', label: 'Responsable Achats' },
                  { value: 'admin', label: 'Administrateur' },
                ]}
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
              <Select
                label="Statut"
                options={[
                  { value: 'active', label: 'Actif' },
                  { value: 'inactive', label: 'Inactif' },
                ]}
                value={formData.status || ''}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              />
            </div>
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
          onConfirm={async () => {
            try {
              if (!formData.newPassword || formData.newPassword.length < 6) {
                alert('Le mot de passe doit contenir au moins 6 caractères.');
                return;
              }
              await adminService.resetUserPassword(selectedUser.id.toString(), formData.newPassword);
              setIsResetPasswordModalOpen(false);
              setSelectedUser(null);
              setFormData({ ...formData, newPassword: '' });
              fetchUsers();
              alert('Le mot de passe de ' + selectedUser.email + ' a été modifié avec succès.');
            } catch (e: any) {
              alert('Erreur: ' + e.message);
            }
          }}
          confirmText="Changer le mot de passe"
        >
          <div className="space-y-4">
            <p className="text-neutral-700">
              Veuillez définir un nouveau mot de passe pour {selectedUser.email}. Ce mot de passe devra lui être communiqué manuellement.
            </p>
            <Input 
              label="Nouveau mot de passe" 
              type="password" 
              placeholder="••••••••" 
              value={formData.newPassword || ''} 
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
            />
          </div>
        </Modal>
      )}
    </MainLayout>
  );
};
