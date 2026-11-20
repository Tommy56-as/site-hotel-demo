import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { Utensils, Compass, Car, Check, Award, Sparkles, Shield, Clock } from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';

interface ExperiencesSectionProps {
  language: Language;
}

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sublabel: string;
}

const StatCounter: React.FC<StatItemProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
  sublabel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplayValue(latest);
        },
      });
      return () => controls.stop();
    } else {
      setDisplayValue(0);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6 bg-[#FAF8F5] border border-[#163024]/10 rounded-sm">
      <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#163024] tracking-tight tabular-nums mb-2">
        <span>{prefix}</span>
        <span>
          {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
        </span>
        <span className="text-[#8C4A32] ml-0.5">{suffix}</span>
      </div>
      <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#163024] mb-1">
        {label}
      </p>
      <p className="text-[11px] text-[#1A1A1A]/70 max-w-xs mx-auto">
        {sublabel}
      </p>
    </div>
  );
};

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ language }) => {
  const t = translations[language];

  const experiences = [
    {
      icon: <Utensils className="w-5 h-5 text-[#8C4A32]" />,
      title: t.experiences.exp1Title,
      description: t.experiences.exp1Desc,
      highlights: [
        'Poisson braisé noble mariné aux épices du Littoral',
        'Poivre blanc de Penja certifié IGP première récolte',
        'Grand cru de cacao de la Sanaga et miel sauvage',
      ],
    },
    {
      icon: <Car className="w-5 h-5 text-[#163024]" />,
      title: t.experiences.exp2Title,
      description: t.experiences.exp2Desc,
      highlights: [
        'Accueil VIP passerelle à Douala International & Nsimalen',
        'Flotte de berlines climatisées avec chauffeurs privés',
        'Salon d’embarquement et conciergerie diplomatique',
      ],
    },
    {
      icon: <Compass className="w-5 h-5 text-[#8C4A32]" />,
      title: t.experiences.exp3Title,
      description: t.experiences.exp3Desc,
      highlights: [
        'Pirogue privée aux Chutes de la Lobé au soleil couchant',
        'Ascension guidée des contreforts du Mont Cameroun',
        'Observation ornithologique dans les jardins botaniques',
      ],
    },
  ];

  return (
    <section id="experiences" className="py-24 border-t border-[#163024]/10 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header with Bidirectional whileInView (once: false) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16"
        >
          <div className="overflow-hidden mb-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-xs uppercase tracking-[0.25em] text-[#8C4A32] font-semibold block"
            >
              {t.experiences.kicker}
            </motion.span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#163024] font-normal tracking-tight mb-4">
            {t.experiences.title}
          </h2>
          <p className="text-sm sm:text-base text-[#1A1A1A]/75 leading-relaxed">
            {t.experiences.subtitle}
          </p>
        </motion.div>

        {/* 3 Editorial Columns with Staggered Bidirectional whileInView Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.75,
                delay: idx * 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="p-8 bg-[#FAF8F5] border border-[#163024]/15 rounded-sm flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xs bg-white border border-[#163024]/15 flex items-center justify-center mb-6 shadow-2xs">
                  {exp.icon}
                </div>
                <h3 className="font-serif text-xl font-medium text-[#163024] mb-3">
                  {exp.title}
                </h3>
                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed mb-6">
                  {exp.description}
                </p>
              </div>

              <div className="space-y-2 pt-6 border-t border-[#163024]/10 text-xs text-[#163024]">
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#8C4A32] shrink-0 mt-0.5" />
                    <span className="text-[11px] text-[#1A1A1A]/80 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-End Key Metrics / Stats Strip with Animated Incremental Counters */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 border-t border-[#163024]/10"
        >
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C4A32] font-semibold block mb-1">
              Repères & Certifications
            </span>
            <h3 className="font-serif text-2xl text-[#163024]">
              L’Excellence Hôtelière en Chiffres
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCounter
              value={4}
              suffix=""
              label="Sanctuaires"
              sublabel="Kribi, Douala, Yaoundé et Limbé"
            />
            <StatCounter
              value={100}
              suffix="%"
              label="Hospitalité Mboa"
              sublabel="Produits du terroir & savoir-faire local"
            />
            <StatCounter
              value={19.25}
              suffix="%"
              decimals={2}
              label="Fiscalité Conforme"
              sublabel="Factures certifiées NUI, RCCM & TVA CEMAC"
            />
            <StatCounter
              value={24}
              suffix="/7"
              label="Conciergerie VIP"
              sublabel="Accueil aéroport, chauffeurs & sécurité dédiée"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
