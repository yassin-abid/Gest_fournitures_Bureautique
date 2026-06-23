/**
 * User and Authentication Types
 */

export type UserRole =
  | 'admin'               // Niveau 1 — Administrateur
  | 'responsable_service' // Niveau 2 — Responsable de Service
  | 'gestionnaire_stock'  // Niveau 3 — Gestionnaire de Stock
  | 'responsable_achats'  // Niveau 4 — Responsable Achats
  | 'employe';            // Niveau 5 — Employé (standard)

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  permissions?: string[];
  status: 'active' | 'inactive';
  passwordResetRequested?: boolean;
  passwordResetApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}
