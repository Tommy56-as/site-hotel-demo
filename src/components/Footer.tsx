import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  language: Language;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigateSection }) => {
  const t = translations[language];

  return (
    <footer className="border-t border-[#163024]/15 bg-[#163024] text-[#FAF8F5] pt-16 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10"
        >
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              {t.footer.aboutTitle}
            </span>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed max-w-sm">
              {t.footer.aboutDesc}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5A059]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Agréé Ministère du Tourisme et des Loisirs du Cameroun</span>
            </div>
          </div>

          {/* Properties Across Cameroon */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059] uppercase">
              {t.footer.locationsTitle}
            </h4>
            <div className="space-y-2 text-xs text-[#FAF8F5]/75">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{t.footer.locKribi}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{t.footer.locDouala}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{t.footer.locYaounde}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{t.footer.locLimbe}</span>
              </p>
            </div>
          </div>

          {/* Contact & Concierge Desk */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-[#C5A059] uppercase">
              {t.footer.contactTitle}
            </h4>
            <div className="space-y-2 text-xs text-[#FAF8F5]/75">
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footer.phoneOffice}</span>
              </p>
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.footer.phoneMobile}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{t.footer.email}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF8F5]/60">
          <p>{t.footer.legal}</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigateSection('destinations')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Destinations
            </button>
            <button
              onClick={() => onNavigateSection('catalog')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Suites
            </button>
            <button
              onClick={() => onNavigateSection('experiences')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Expériences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
