/**
 * Reset Password Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/MainLayout';
import { authService } from '../services/authService';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit faire au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({ email, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Impossible de réinitialiser le mot de passe. Assurez-vous que l'administrateur a approuvé votre demande.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="glass-panel w-full max-w-[480px] rounded-xl p-8 md:p-12 animate-fade-in-scale">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4 shadow-sm">
            <span className="material-symbols-outlined text-surface-bright text-[32px]" data-icon="lock_reset">
              lock_reset
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:font-display-sm md:text-display-sm text-primary tracking-tight mb-2">
            Nouveau mot de passe
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Définissez votre nouvel accès</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm font-medium text-center">
            Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider">
                Email Professionnel
              </label>
              <div className="relative">
                <input
                  className="premium-input block w-full px-4 py-3 border border-outline-variant/50 bg-surface-container-lowest rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300"
                  placeholder="prenom.nom@groupe-hammemi.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  className="premium-input block w-full px-4 py-3 border border-outline-variant/50 bg-surface-container-lowest rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300"
                  placeholder="••••••••"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  className="premium-input block w-full px-4 py-3 border border-outline-variant/50 bg-surface-container-lowest rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              className="btn-primary w-full flex justify-center items-center py-3 px-4 rounded-lg font-title-md text-title-md mt-6 disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'En cours...' : 'Réinitialiser'}</span>
            </button>
          </form>
        )}

        <div className="mt-8 flex flex-col items-center space-y-4">
          <Link className="text-secondary hover:underline font-semibold transition-all duration-300" to="/login">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

ResetPasswordPage.displayName = 'ResetPasswordPage';
