/**
 * Register Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    department: '',
    password: '',
    confirm_password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullname) errors.fullname = 'Le nom complet est requis';
    if (!formData.email) errors.email = 'L\'email est requis';
    if (!formData.department) errors.department = 'Le département est requis';
    if (!formData.password) errors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Les mots de passe ne correspondent pas';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    try {
      if (register) {
         const nameParts = formData.fullname.trim().split(' ');
         const firstName = nameParts[0];
         const lastName = nameParts.slice(1).join(' ') || firstName;

         await register({
           firstName,
           lastName,
           email: formData.email,
           password: formData.password,
           department: formData.department
         });
         showSuccess('Compte créé ! Votre compte est en attente de validation par un administrateur.');
         navigate('/login');
      } else {
         setError('La fonction d\'inscription n\'est pas disponible.');
      }
    } catch (err: any) {
      setError(err.message || 'L\'inscription a échoué');
      showError(err.message || 'L\'inscription a échoué');
    }
  };

  return (
    <AuthLayout>
      {/* Central Glassmorphism Card */}
      <div className="glass-panel w-full max-w-[520px] rounded-xl p-8 md:p-12 animate-fade-in-scale">
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
          <p className="font-body-lg text-body-lg text-on-surface-variant">Créer un compte professionnel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label
              className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider"
              htmlFor="fullname"
            >
              Nom Complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]" data-icon="person">
                  person
                </span>
              </div>
              <input
                className={`premium-input block w-full pl-10 pr-3 py-3 border ${
                  fieldErrors.fullname ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 bg-surface-container-lowest'
                } rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300`}
                id="fullname"
                name="fullname"
                placeholder="Jean Dupont"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.fullname && <p className="text-error text-xs mt-1">{fieldErrors.fullname}</p>}
          </div>

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

          {/* Department Dropdown */}
          <div className="space-y-2">
            <label
              className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider"
              htmlFor="department"
            >
              Département
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]" data-icon="corporate_fare">
                  corporate_fare
                </span>
              </div>
              <select
                className={`premium-input block w-full pl-10 pr-3 py-3 border ${
                  fieldErrors.department ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 bg-surface-container-lowest'
                } rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300 appearance-none`}
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="" disabled>Sélectionner un département</option>
                <option value="achats">Achats / Approvisionnement</option>
                <option value="rh">Ressources Humaines</option>
                <option value="it">Informatique (IT)</option>
                <option value="direction">Direction Générale</option>
                <option value="autre">Autre</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[20px]" data-icon="expand_more">
                  expand_more
                </span>
              </div>
            </div>
            {fieldErrors.department && <p className="text-error text-xs mt-1">{fieldErrors.department}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-wider"
                htmlFor="confirm_password"
              >
                Confirmer
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]" data-icon="lock_reset">
                    lock_reset
                  </span>
                </div>
                <input
                  className={`premium-input block w-full pl-10 pr-3 py-3 border ${
                    fieldErrors.confirm_password ? 'border-error/50 bg-error/5' : 'border-outline-variant/50 bg-surface-container-lowest'
                  } rounded-lg text-on-background font-body-lg text-body-lg placeholder-outline transition-all duration-300`}
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.confirm_password && <p className="text-error text-xs mt-1">{fieldErrors.confirm_password}</p>}
            </div>
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
                <input
                    className="h-4 w-4 text-secondary focus:ring-secondary border-outline-variant rounded transition-colors duration-300 cursor-pointer"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                />
            </div>
            <div className="ml-3 text-sm">
                <label
                    className="font-body-sm text-body-sm text-on-surface-variant"
                    htmlFor="terms"
                >
                    J'accepte les <a className="text-secondary hover:underline font-medium" href="#">conditions d'utilisation</a> et la politique de confidentialité.
                </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="btn-primary w-full flex justify-center items-center py-3 px-4 rounded-lg font-title-md text-title-md mt-6 disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Inscription...' : 'S\'inscrire'}</span>
            {!isLoading && (
              <span className="material-symbols-outlined ml-2 text-[20px]" data-icon="arrow_forward">
                arrow_forward
              </span>
            )}
          </button>
        </form>

        {/* Secondary Actions */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Vous avez déjà un compte ?{' '}
            <Link className="text-secondary font-medium hover:underline transition-colors" to="/login">
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
};

RegisterPage.displayName = 'RegisterPage';
