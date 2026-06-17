/**
 * Settings Page - Admin Module
 * System settings and configuration
 */

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody, CardFooter } from '@components/Card';
import { Button } from '@components/Button';
import { Input, Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';

export const SettingsPage: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [companyEmail, setCompanyEmail] = useState('admin@acmecorp.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupTime, setBackupTime] = useState('02:00');
  const [maxUploadSize, setMaxUploadSize] = useState('50');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Paramètres enregistrés avec succès');
    }, 1500);
  };

  return (
    <MainLayout title="Paramètres">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Paramètres</h2>
          <p className="text-neutral-600 mt-2">Configurez les paramètres et préférences du système</p>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader title="Informations de l'Entreprise" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom de l'Entreprise"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  label="Email de l'Entreprise"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader title="Maintenance du Système" />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-900">Mode de Maintenance</h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    Désactiver l'accès utilisateur pendant la maintenance
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
              </div>

              {maintenanceMode && (
                <Alert type="warning">
                  Le mode de maintenance est activé. Les utilisateurs normaux verront une page de maintenance.
                </Alert>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader title="Paramètres de Sauvegarde" />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-neutral-900">Sauvegarde Automatique</h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    Sauvegarder automatiquement la base de données quotidiennement
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
              </div>

              {autoBackup && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Heure de Sauvegarde (UTC)
                  </label>
                  <Input
                    type="time"
                    value={backupTime}
                    onChange={(e) => setBackupTime(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Taille Max de Téléchargement (Mo)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={maxUploadSize}
                  onChange={(e) => setMaxUploadSize(e.target.value)}
                />
              </div>

              <div>
                <p className="text-sm text-neutral-600">Dernière Sauvegarde : 2024-06-10 02:00:00 UTC</p>
                <p className="text-sm text-neutral-600">Prochaine Sauvegarde : 2024-06-11 02:00:00 UTC</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Session Settings */}
        <Card>
          <CardHeader title="Paramètres de Session" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Délai d'Expiration de Session (minutes)
                </label>
                <Input
                  type="number"
                  min="5"
                  max="480"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  helpText="Les utilisateurs seront déconnectés après cette période d'inactivité"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader title="Paramètres d'Affichage" />
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Thème"
                  options={[
                    { value: 'light', label: 'Clair' },
                    { value: 'dark', label: 'Sombre' },
                    { value: 'auto', label: 'Auto (Par défaut du système)' },
                  ]}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <Select
                  label="Langue"
                  options={[
                    { value: 'en', label: 'Anglais' },
                    { value: 'fr', label: 'Français' },
                    { value: 'de', label: 'Allemand' },
                    { value: 'es', label: 'Espagnol' },
                  ]}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>

              <Select
                label="Fuseau Horaire"
                options={[
                  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                  { value: 'EST', label: 'EST (Eastern Standard Time)' },
                  { value: 'CST', label: 'CST (Central Standard Time)' },
                  { value: 'MST', label: 'MST (Mountain Standard Time)' },
                  { value: 'PST', label: 'PST (Pacific Standard Time)' },
                  { value: 'CET', label: 'CET (Central European Time)' },
                ]}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader title="Paramètres de Notification" />
          <CardBody>
            <div className="space-y-3">
              {[
                { id: 'email-alerts', label: 'Alertes Email', checked: true },
                { id: 'stock-alerts', label: 'Alertes de Niveau de Stock', checked: true },
                { id: 'request-alerts', label: 'Notifications de Demandes', checked: true },
                { id: 'order-alerts', label: 'Mises à jour du Statut des Commandes', checked: true },
                { id: 'system-alerts', label: 'Notifications Système', checked: false },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-neutral-900">{item.label}</span>
                </label>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader title="Informations Système" />
          <CardBody>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Version de l'Application</span>
                <span className="font-medium text-neutral-900">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Version de la Base de Données</span>
                <span className="font-medium text-neutral-900">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600">Heure du Serveur</span>
                <span className="font-medium text-neutral-900">2024-06-10 15:30:45 UTC</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-600">Dernière Mise à Jour</span>
                <span className="font-medium text-neutral-900">2024-06-01 10:00:00 UTC</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <Card>
          <CardFooter>
            <Button variant="ghost" onClick={() => window.history.back()}>
              Annuler
            </Button>
            <Button
              variant="primary"
              icon={<Save size={20} />}
              onClick={handleSave}
              isLoading={isSaving}
            >
              Enregistrer les Paramètres
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};
