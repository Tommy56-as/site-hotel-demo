import React from 'react';
import { Search, MapPin, Calendar, Users, ShieldCheck, CreditCard, ChevronDown } from 'lucide-react';
import { Language, DestinationId } from '../types';
import { translations } from '../utils/i18n';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  language: Language;
  selectedDestination: DestinationId;
  onDestinationChange: (dest: DestinationId) => void;
  checkIn: string;
  onCheckInChange: (date: string) => void;
  checkOut: string;
  onCheckOutChange: (date: string) => void;
  guests: number;
  onGuestsChange: (count: number) => void;
  onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  selectedDestination,
  onDestinationChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSearch,
}) => {
  const t = translations[language];
  const { scrollY } = useScroll();
  const imageParallaxY = useTransform(scrollY, [0, 600], [0, 40]);

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Split Editorial Layout: Left Narrative, Right Photographic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Narrative Column with Bidirectional whileInView (once: false) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Kicker with masked typographic entrance */}
            <div className="overflow-hidden mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#8C4A32] font-semibold"
              >
                <span>{t.hero.kicker}</span>
                <span aria-hidden="true">·</span>
                <span>Kribi · Douala · Yaoundé · Limbé</span>
              </motion.div>
            </div>

            {/* Headline with typographic mask reveal & text-wrap balance */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-[#163024] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {t.hero.title}
              </motion.h1>
            </div>

            {/* Body lead with bidirectional fade-in */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#1A1A1A]/80 font-normal leading-relaxed mb-8 max-w-xl"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Trust Markers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.38, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#163024]/12 text-xs text-[#1A1A1A]/70"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#163024]" />
                <span className="font-medium">{t.hero.badgeGuarantee}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8C4A32]" />
                <span className="font-medium">{t.hero.badgePayment}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Photographic Column with Ken Burns Zoom & Optical Parallax */}
          <motion.div
            style={{ y: imageParallaxY }}
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative group overflow-hidden rounded-sm border border-[#163024]/15 bg-[#F3EFE6] shadow-md">
              {/* Ken Burns Slow Cinematic Zoom */}
              <motion.img
                animate={{
                  scale: [1, 1.07, 1],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                src="/src/assets/images/hero_cameroon_luxury_1793714393134.jpg"
                alt="Terrasse privée d'exception surplombant l'océan Atlantique à Kribi"
                className="w-full h-[380px] sm:h-[470px] object-cover transition-transform duration-700 ease-out will-change-transform"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Architectural caption overlay with subtle reveal */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#FAF8F5]/85 mb-1">
                  Résidence Océanique Mboa Batanga
                </p>
                <p className="font-serif text-lg font-medium text-white">
                  Kribi, République du Cameroun
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Availability & Search Bar (Bidirectional whileInView) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 p-4 sm:p-6 bg-white border border-[#163024]/15 rounded-sm shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Field 1: Destination Selection */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#163024]" />
                  {t.hero.destinationLabel}
                </span>
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => onDestinationChange(e.target.value as DestinationId)}
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2.5 text-sm text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024] cursor-pointer transition-colors hover:border-[#163024]/40"
              >
                <option value="all">{t.hero.allDestinations}</option>
                <option value="kribi">Kribi (Océan Atlantique)</option>
                <option value="douala">Douala (Estuaire du Wouri / Bonanjo)</option>
                <option value="yaounde">Yaoundé (Mont Fébé / Bastos)</option>
                <option value="limbe">Limbé (Sable Noir / Côte Ouest)</option>
              </select>
            </div>

            {/* Field 2: Check-in Date */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#163024]" />
                  {t.hero.checkIn}
                </span>
              </label>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => onCheckInChange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2.5 text-sm text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024] cursor-pointer transition-colors hover:border-[#163024]/40"
              />
            </div>

            {/* Field 3: Check-out Date */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#163024]" />
                  {t.hero.checkOut}
                </span>
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2.5 text-sm text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024] cursor-pointer transition-colors hover:border-[#163024]/40"
              />
            </div>

            {/* Field 4: Guests Counter & Search Button */}
            <div className="lg:col-span-3 flex items-center gap-3">
              <div className="w-1/2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#163024]" />
                    {t.hero.guests}
                  </span>
                </label>
                <div className="flex items-center justify-between bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                    className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#163024] hover:bg-black/5 disabled:opacity-30 rounded-xs cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-[#1A1A1A] tabular-nums">
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGuestsChange(Math.min(6, guests + 1))}
                    disabled={guests >= 6}
                    className="w-7 h-7 flex items-center justify-center text-sm font-bold text-[#163024] hover:bg-black/5 disabled:opacity-30 rounded-xs cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="w-1/2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onSearch}
                  className="w-full h-[42px] flex items-center justify-center gap-2 bg-[#163024] hover:bg-[#0E2018] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.hero.searchButton}</span>
                  <span className="sm:hidden">Filtrer</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Minimalist Editorial Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 flex flex-col items-center justify-center"
        >
          <button
            onClick={scrollToDestinations}
            className="group flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#163024] transition-colors cursor-pointer"
          >
            <span className="font-medium text-[11px]">
              {language === 'fr' ? 'Découvrir nos sanctuaires' : 'Discover our sanctuaries'}
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-5 h-8 border border-[#163024]/30 rounded-full flex items-start justify-center p-1"
            >
              <div className="w-1 h-2 bg-[#8C4A32] rounded-full" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
