/**
 * Login Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const { showError } = useNotification();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email) errors.email = 'L\'email est requis';
    if (!formData.password) errors.password = 'Le mot de passe est requis';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      showError(err.message || 'La connexion a échoué');
    }
  };


  return (
    <AuthLayout>
      {/* Central Glassmorphism Card */}
      <div className="glass-panel w-full max-w-[480px] rounded-xl p-8 md:p-12 animate-fade-in-scale">
        {/* Brand & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4 shadow-sm">
            <span className="material-symbols-outlined text-surface-bright text-[32px]" data-icon="business_center">
              business_center
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-primary tracking-tight mb-2">
            Hammemi Office
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Executive Workspace</p>
          <div className="mt-6 p-4 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/20">
            <p className="font-title-md text-title-md text-on-background">
              Bienvenue dans votre espace de gestion premium.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider"
              htmlFor="email"
            >
              Email Professionnel
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]" data-icon="mail">
                  mail
                </span>
              </div>
              <input
                className={`premium-input block w-full pl-10 pr-3 py-3 border ${
                  fieldErrors.email ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 bg-surface-container-lowest'
                } rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300`}
                id="email"
                name="email"
                placeholder="prenom.nom@groupe-hammemi.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.email && <p className="text-error text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]" data-icon="lock">
                  lock
                </span>
              </div>
              <input
                className={`premium-input block w-full pl-10 pr-3 py-3 border ${
                  fieldErrors.password ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 bg-surface-container-lowest'
                } rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300`}
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.password && <p className="text-error text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-secondary focus:ring-secondary border-outline-variant rounded transition-colors duration-300 cursor-pointer"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer"
                htmlFor="remember-me"
              >
                Se souvenir de moi
              </label>
            </div>
            <div className="text-sm">
              <a
                className="font-body-sm text-body-sm text-secondary hover:text-secondary-container transition-colors duration-300 font-semibold"
                href="#"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="btn-primary w-full flex justify-center items-center py-3 px-4 rounded-lg font-title-md text-title-md mt-6 disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Connexion en cours...' : 'Se Connecter'}</span>
            {!isLoading && (
              <span className="material-symbols-outlined ml-2 text-[20px]" data-icon="arrow_forward">
                arrow_forward
              </span>
            )}
          </button>
        </form>

        {/* Secondary Actions */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Nouveau collaborateur ?{' '}
            <Link className="text-secondary hover:underline font-semibold transition-all duration-300" to="/register">
              Demander un compte
            </Link>
          </p>
          <a
            className="font-body-sm text-body-sm text-outline hover:text-on-surface-variant transition-colors duration-300 flex items-center gap-1"
            href="#"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="support_agent">
              support_agent
            </span>
            Contacter le support technique
          </a>
        </div>

        {/* Quick Role Testing Panel */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30">
          <p className="text-xs text-on-surface-variant mb-3 text-center font-semibold uppercase tracking-wider">
            Accès rapide — Tester les rôles
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: '🛡 Administrateur',    email: 'admin@hammemi.com',              pass: 'Admin123!' },
              { label: '✅ Resp. de Service',   email: 'resp.service@hammemi.com',       pass: 'Service123!' },
              { label: '📦 Gest. de Stock',     email: 'gestionnaire.stock@hammemi.com', pass: 'Stock123!' },
              { label: '🛒 Resp. Achats',       email: 'resp.achats@hammemi.com',        pass: 'Achats123!' },
              { label: '👤 Employé',            email: 'employe@hammemi.com',            pass: 'Employe123!' },
            ].map(({ label, email, pass }) => (
              <button
                key={email}
                disabled={isLoading}
                onClick={async () => {
                  setFormData({ email, password: pass });
                  try {
                    await login(email, pass);
                    navigate('/dashboard');
                  } catch (err: any) {
                    showError(err.message || 'La connexion a échoué');
                  }
                }}
                className="flex items-center justify-between px-4 py-2.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-lg transition-colors text-left group"
              >
                <span className="text-sm font-semibold text-on-surface">{label}</span>
                <span className="text-[10px] font-mono text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">{email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

LoginPage.displayName = 'LoginPage';
