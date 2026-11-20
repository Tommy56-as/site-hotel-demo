import React from 'react';
import { Language, DestinationId } from '../types';
import { translations } from '../utils/i18n';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HOTEL_IMAGES } from '../utils/images';

interface DestinationsPreviewProps {
  language: Language;
  onSelectDestination: (dest: DestinationId) => void;
}

export const DestinationsPreview: React.FC<DestinationsPreviewProps> = ({
  language,
  onSelectDestination,
}) => {
  const t = translations[language];

  const destinationCards = [
    {
      id: 'kribi' as DestinationId,
      name: 'Kribi',
      tagline: t.destinations.kribi,
      desc: t.destinations.kribiDesc,
      image: HOTEL_IMAGES.kribi,
      region: 'Littoral Atlantique · Sud Cameroun',
    },
    {
      id: 'douala' as DestinationId,
      name: 'Douala',
      tagline: t.destinations.douala,
      desc: t.destinations.doualaDesc,
      image: HOTEL_IMAGES.douala,
      region: 'Estuaire du Wouri · Bonanjo',
    },
    {
      id: 'yaounde' as DestinationId,
      name: 'Yaoundé',
      tagline: t.destinations.yaounde,
      desc: t.destinations.yaoundeDesc,
      image: HOTEL_IMAGES.yaounde,
      region: 'Mont Fébé · Bastos Diplomatique',
    },
    {
      id: 'limbe' as DestinationId,
      name: 'Limbé',
      tagline: t.destinations.limbe,
      desc: t.destinations.limbeDesc,
      image: HOTEL_IMAGES.limbe,
      region: 'Baie d’Ambas · Sable Noir Volcanique',
    },
  ];

  return (
    <section id="destinations" className="py-24 border-t border-[#163024]/10 bg-[#F5F2EB]/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header with Bidirectional whileInView (once: false) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
        >
          <div>
            <div className="overflow-hidden mb-2">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-xs uppercase tracking-[0.25em] text-[#8C4A32] font-semibold block"
              >
                Territoires d’Exception · Cameroon Sanctuaries
              </motion.span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#163024] font-normal tracking-tight">
              Quatre Havres entre Forêt, Fleuve et Océan
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-[#1A1A1A]/70 max-w-md leading-relaxed">
            Chaque adresse est conçue en osmose avec la topographie et la culture de sa région, pour une hospitalité sans compromis.
          </p>
        </motion.div>

        {/* 4 Cards Grid with Bidirectional Staggered whileInView Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinationCards.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.75,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => onSelectDestination(dest.id)}
              className="group cursor-pointer bg-white border border-[#163024]/15 rounded-sm overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-56 overflow-hidden bg-[#FAF8F5]">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#163024] text-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-xs shadow-2xs">
                  {dest.name}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C4A32] font-semibold block mb-1">
                    {dest.region}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#163024] mb-2 group-hover:text-[#8C4A32] transition-colors">
                    {dest.tagline}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/75 leading-relaxed line-clamp-3">
                    {dest.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#163024]/10 flex items-center justify-between text-xs font-semibold text-[#163024]">
                  <span>Voir les demeures</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
