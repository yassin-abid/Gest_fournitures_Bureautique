/**
 * Profile Page
 * User profile and personal settings
 */

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input } from '@components/FormInputs';
import { useAuth } from '@hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Mot de passe mis à jour avec succès');
    }, 1500);
  };

  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');

  const roleLabels: Record<string, string> = {
    admin:               'Administrateur',
    responsable_service: 'Responsable de Service',
    gestionnaire_stock:  'Gestionnaire de Stock',
    responsable_achats:  'Responsable Achats',
    employe:             'Employé',
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profil mis à jour avec succès');
    }, 1500);
  };

  return (
    <MainLayout title="Mon Profil">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Mon Profil</h2>
          <p className="text-neutral-600 mt-2">Gérez vos informations personnelles</p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader title="Informations Personnelles" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Département"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Rôle (Lecture seule)"
                    value={user ? (roleLabels[user.role] || user.role) : ''}
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              icon={<Save size={20} />}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Enregistrer les modifications
            </Button>
          </CardFooter>
        </Card>

        {/* Security / Password Information */}
        <Card>
          <CardHeader title="Sécurité & Mot de Passe" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="hidden md:block"></div>
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              icon={<Save size={20} />}
              onClick={handleSavePassword}
              isLoading={isSavingPassword}
            >
              Mettre à jour le mot de passe
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
