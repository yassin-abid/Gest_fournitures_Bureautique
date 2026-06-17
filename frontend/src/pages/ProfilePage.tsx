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
      </div>
    </MainLayout>
  );
};
