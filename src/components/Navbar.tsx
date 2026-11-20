import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Shield, ChevronRight } from 'lucide-react';
import { Language, Currency } from '../types';
import { translations } from '../utils/i18n';
import { motion, AnimatePresence, useScroll } from 'framer-motion';

import { Logo } from './Logo';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onOpenBookings: () => void;
  bookingsCount: number;
  onDirectBook: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  onOpenBookings,
  bookingsCount,
  onDirectBook,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const navLinks = [
    { id: 'destinations', label: t.nav.destinations },
    { id: 'catalog', label: t.nav.suites },
    { id: 'experiences', label: t.nav.experiences },
  ];

  return (
    <>
      {/* Editorial Scroll Progress Indicator at the very top */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#8C4A32] z-50 pointer-events-none"
      />

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#163024]/12 shadow-sm py-0'
            : 'bg-[#FAF8F5]/85 backdrop-blur-xs border-b border-[#163024]/5 py-1'
        }`}
      >
        <div className="mx-auto flex h-18 sm:h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
          {/* Zone 1: Authentic Luxury Brand Logo & Monogram */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group min-w-0 transition-opacity hover:opacity-90"
            aria-label="Mboa Luxury Collection - Accueil"
          >
            <Logo variant="dark" showSubtitle={true} />
          </a>

          {/* Zone 2: Single-line Navigation Links (Desktop) with Smooth Indicator */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1A1A1A]/80">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative py-2 text-[#1A1A1A]/80 hover:text-[#163024] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-[13px] tracking-wide"
              >
                <span>{link.label}</span>
                {hoveredLink === link.id && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#8C4A32]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={onOpenBookings}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#163024]/5 hover:bg-[#163024]/10 text-[#163024] border border-[#163024]/15 rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs font-semibold"
              title="Espace Direction & Registre des Réservations"
            >
              <Shield className="w-3.5 h-3.5 text-[#8C4A32]" />
              <span>{t.admin.adminBtn}</span>
              {bookingsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#8C4A32] text-white rounded-xs">
                  {bookingsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions + Currency & Language Selectors + Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency Switcher */}
            <div className="hidden sm:flex items-center border border-[#163024]/20 rounded-xs overflow-hidden bg-white/70 text-xs font-medium shadow-2xs">
              {(['XAF', 'EUR', 'USD'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                    currency === curr
                      ? 'bg-[#163024] text-white font-semibold'
                      : 'text-[#1A1A1A]/70 hover:bg-[#FAF8F5] hover:text-[#163024]'
                  }`}
                >
                  {curr === 'XAF' ? 'FCFA' : curr}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center border border-[#163024]/20 rounded-xs overflow-hidden bg-white/70 text-xs font-semibold shadow-2xs">
              {(['fr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1.5 transition-colors uppercase cursor-pointer ${
                    language === lang
                      ? 'bg-[#8C4A32] text-white font-semibold'
                      : 'text-[#1A1A1A]/70 hover:bg-[#FAF8F5] hover:text-[#163024]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Primary CTA Button (Desktop) with subtle breathing lift */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDirectBook}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#163024] hover:bg-[#0E2018] rounded-xs transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.nav.bookNow}</span>
            </motion.button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-[#163024] bg-white border border-[#163024]/25 hover:bg-[#FAF8F5] active:bg-[#F3EFE6] rounded-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#8C4A32]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Navigation Drawer with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t border-[#163024]/15 bg-[#FAF8F5] px-6 py-6 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="flex items-center justify-between text-left py-2 font-serif text-lg font-medium text-[#1A1A1A] border-b border-[#163024]/10 cursor-pointer hover:text-[#8C4A32] transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#8C4A32]" />
                  </button>
                ))}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBookings();
                  }}
                  className="flex items-center justify-between py-2 font-serif text-lg font-medium text-[#163024] border-b border-[#163024]/10 cursor-pointer bg-white/70 px-2 rounded-xs"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#8C4A32]" />
                    {t.admin.portalTitle}
                  </span>
                  {bookingsCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-[#8C4A32] text-white rounded-xs">
                      {bookingsCount}
                    </span>
                  )}
                </button>

                {/* Mobile Currency Selection */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs uppercase font-medium text-[#1A1A1A]/60">Devise :</span>
                  <div className="flex gap-1">
                    {(['XAF', 'EUR', 'USD'] as Currency[]).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => onCurrencyChange(curr)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-xs cursor-pointer ${
                          currency === curr
                            ? 'bg-[#163024] text-white shadow-xs font-semibold'
                            : 'bg-white text-[#1A1A1A] border border-[#163024]/20'
                        }`}
                      >
                        {curr === 'XAF' ? 'FCFA' : curr}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDirectBook();
                  }}
                  className="mt-4 w-full py-3.5 text-center text-xs font-semibold tracking-wider uppercase text-white bg-[#163024] hover:bg-[#0E2018] rounded-xs cursor-pointer shadow-xs active:scale-[0.99] transition-transform"
                >
                  {t.nav.bookNow}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
