import { AdminUser, AdminRole } from '../types';

export const STORAGE_KEY_ADMIN_USERS = 'mboa_admin_users_v1';
export const STORAGE_KEY_ADMIN_SESSION = 'mboa_admin_session_v1';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-dg-01',
    name: 'Jean-Paul Mbida',
    email: 'direction@mboacollection.cm',
    role: 'DIRECTEUR_GENERAL',
    password: 'MboaAdmin237!',
    createdAt: '2026-01-15T08:00:00Z',
    lastLogin: '2026-11-03T05:30:00Z',
    isActive: true,
  },
  {
    id: 'user-rec-02',
    name: 'Marie-Claire Ndongo',
    email: 'reception@mboacollection.cm',
    role: 'CHEF_RECEPTION',
    password: 'Reception237!',
    createdAt: '2026-02-01T09:00:00Z',
    lastLogin: '2026-11-02T16:45:00Z',
    isActive: true,
  },
  {
    id: 'user-res-03',
    name: 'Alain Fopa',
    email: 'reservations@mboacollection.cm',
    role: 'RESPONSABLE_RESERVATIONS',
    password: 'Reservations237!',
    createdAt: '2026-03-10T10:15:00Z',
    lastLogin: '2026-10-28T11:20:00Z',
    isActive: true,
  },
];

export function getStoredAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADMIN_USERS;
  } catch {
    return INITIAL_ADMIN_USERS;
  }
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save admin users to localStorage', err);
  }
}

export function getStoredAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(user: AdminUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
    }
  } catch (err) {
    console.error('Failed to update admin session', err);
  }
}

export function authenticateAdmin(email: string, pass: string): { success: boolean; user?: AdminUser; error?: string } {
  const users = getStoredAdminUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return { success: false, error: 'Identifiant introuvable ou compte désactivé.' };
  }

  if (!found.isActive) {
    return { success: false, error: 'Ce compte utilisateur a été désactivé par la Direction.' };
  }

  if (found.password !== pass) {
    return { success: false, error: 'Mot de passe incorrect. Vérifiez vos identifiants.' };
  }

  // Update last login
  const updatedUser = { ...found, lastLogin: new Date().toISOString() };
  const updatedList = users.map((u) => (u.id === found.id ? updatedUser : u));
  saveAdminUsers(updatedList);
  saveAdminSession(updatedUser);

  return { success: true, user: updatedUser };
}

export function getRoleLabel(role: AdminRole): string {
  switch (role) {
    case 'DIRECTEUR_GENERAL':
      return 'Directeur Général (Super-Admin)';
    case 'CHEF_RECEPTION':
      return 'Chef de Réception & Accueil';
    case 'RESPONSABLE_RESERVATIONS':
      return 'Responsable Central Réservations';
    default:
      return role;
  }
}
