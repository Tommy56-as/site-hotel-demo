import React, { useState } from 'react';
import { AdminUser, Language } from '../types';
import { authenticateAdmin } from '../utils/auth';
import { translations } from '../utils/i18n';
import { Lock, Building, X, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  language: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = authenticateAdmin(email, password);
      setLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Identifiants invalides.');
      }
    }, 400);
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white border border-[#163024]/20 rounded-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#163024] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Building className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-serif text-base font-bold tracking-tight">
                Direction & Exploitation Hôtelière
              </h3>
              <p className="text-[10px] text-white/70 uppercase tracking-widest">
                Portail Administratif Sécurisé
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-xs text-[#1A1A1A]/75 leading-relaxed">
            {language === 'fr'
              ? 'Veuillez saisir vos identifiants pour accéder au registre des réservations, aux statistiques d’exploitation et à la gestion du parc hôtelier.'
              : 'Please enter your administrative credentials to access customer reservations, revenue analytics, and residence inventory.'}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xs text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                Adresse e-mail professionnelle
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="direction@mboacollection.cm"
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#163024]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                Mot de passe sécurisé
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#163024]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#163024] hover:bg-[#0E2018] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Authentification...' : 'Ouvrir l’Espace Admin'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Reviewers */}
          <div className="pt-4 border-t border-[#163024]/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C4A32] block">
              Comptes Démo Préconfigurés :
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillDemo('direction@mboacollection.cm', 'MboaAdmin237!')}
                className="p-2 text-left bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#163024]/15 rounded-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#163024] flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#8C4A32]" />
                  Directeur Général
                </div>
                <div className="text-[10px] text-[#1A1A1A]/60 truncate font-mono">
                  direction@...
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('reception@mboacollection.cm', 'Reception237!')}
                className="p-2 text-left bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#163024]/15 rounded-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#163024] flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#163024]" />
                  Chef de Réception
                </div>
                <div className="text-[10px] text-[#1A1A1A]/60 truncate font-mono">
                  reception@...
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-t border-[#163024]/10 flex items-center gap-2 text-[10px] text-[#1A1A1A]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Accès réservé au personnel accrédité de Mboa Luxury Collection S.A.</span>
        </div>
      </div>
    </div>
  );
};
