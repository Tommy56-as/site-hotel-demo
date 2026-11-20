import React, { useState } from 'react';
import { Room, Language, Currency, DestinationId, Booking } from '../types';
import { formatPrice } from '../utils/currency';
import { translations } from '../utils/i18n';
import { checkRoomAvailability } from '../utils/availability';
import {
  Wifi,
  Waves,
  Sparkles,
  Wind,
  Coffee,
  Bed,
  Maximize2,
  Users,
  ArrowRight,
  Images,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomCatalogProps {
  rooms: Room[];
  language: Language;
  currency: Currency;
  selectedDestination: DestinationId;
  onDestinationChange: (dest: DestinationId) => void;
  onOpenRoomDetails: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  bookings?: Booking[];
  checkIn?: string;
  checkOut?: string;
}

export const RoomCatalog: React.FC<RoomCatalogProps> = ({
  rooms,
  language,
  currency,
  selectedDestination,
  onDestinationChange,
  onOpenRoomDetails,
  onBookRoom,
  bookings = [],
  checkIn = '',
  checkOut = '',
}) => {
  const t = translations[language];
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minCapacity, setMinCapacity] = useState<number>(1);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    if (selectedDestination !== 'all' && room.destination !== selectedDestination) {
      return false;
    }
    if (room.priceXAF > maxPrice) {
      return false;
    }
    if (room.capacity < minCapacity) {
      return false;
    }
    if (selectedAmenity !== 'all' && !room.amenities.includes(selectedAmenity)) {
      return false;
    }
    if (onlyAvailable && checkIn && checkOut) {
      const avail = checkRoomAvailability(room.id, checkIn, checkOut, bookings);
      if (!avail.isAvailable) return false;
    }
    return true;
  });

  const getAmenityIcon = (key: string) => {
    switch (key) {
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-[#163024]" />;
      case 'oceanView':
      case 'pool':
        return <Waves className="w-3.5 h-3.5 text-[#163024]" />;
      case 'ac':
        return <Wind className="w-3.5 h-3.5 text-[#163024]" />;
      case 'breakfast':
        return <Coffee className="w-3.5 h-3.5 text-[#163024]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#163024]" />;
    }
  };

  return (
    <section id="catalog" className="py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Editorial Section Header with Bidirectional whileInView (once: false) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <div className="overflow-hidden mb-2">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-xs uppercase tracking-[0.25em] text-[#8C4A32] font-semibold block"
            >
              Collection Exclusive · Cameroon Hospitality
            </motion.span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#163024] font-normal tracking-tight mb-4">
            {t.catalog.title}
          </h2>
          <p className="text-sm sm:text-base text-[#1A1A1A]/75 leading-relaxed">
            {t.catalog.subtitle}
          </p>
        </motion.div>

        {/* Interactive Filter Bar with Bidirectional whileInView */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 p-5 bg-white border border-[#163024]/15 rounded-sm shadow-2xs space-y-5"
        >
          {/* Destination Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#163024]/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mr-2">
              Région :
            </span>
            {(
              [
                { id: 'all', label: t.catalog.all },
                { id: 'kribi', label: 'Kribi (Océan)' },
                { id: 'douala', label: 'Douala (Wouri)' },
                { id: 'yaounde', label: 'Yaoundé (Mont Fébé)' },
                { id: 'limbe', label: 'Limbé (Sable Noir)' },
              ] as { id: DestinationId; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onDestinationChange(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs transition-all cursor-pointer ${
                  selectedDestination === tab.id
                    ? 'bg-[#163024] text-white shadow-xs scale-102 font-semibold'
                    : 'bg-[#FAF8F5] text-[#1A1A1A]/80 hover:bg-[#F3EFE6] border border-[#163024]/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-Filters: Price, Capacity, Amenity + Real-Time Availability Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-[#1A1A1A]/70 mb-2">
                <span>{t.catalog.filterPrice}</span>
                <span className="font-semibold text-[#163024] tabular-nums font-mono">
                  {formatPrice(maxPrice, currency)}
                </span>
              </div>
              <input
                type="range"
                min={150000}
                max={300000}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#163024] cursor-pointer"
              />
            </div>

            {/* Min Capacity */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-[#1A1A1A]/70 mb-2">
                <span>{t.catalog.filterCapacity}</span>
                <span className="font-semibold text-[#163024] tabular-nums">
                  {minCapacity} {t.hero.guestPlural}
                </span>
              </div>
              <select
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024] cursor-pointer"
              >
                <option value={1}>1 voyageur et plus</option>
                <option value={2}>2 voyageurs et plus</option>
                <option value={3}>3 voyageurs et plus</option>
              </select>
            </div>

            {/* Amenity Filter */}
            <div>
              <div className="text-xs font-medium text-[#1A1A1A]/70 mb-2">
                {t.catalog.filterAmenities}
              </div>
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024] cursor-pointer"
              >
                <option value="all">Tous les équipements</option>
                <option value="oceanView">Vue Océan Atlantique</option>
                <option value="pool">Bassin ou piscine</option>
                <option value="workspace">Espace de travail exécutif</option>
                <option value="shuttle">Navette aéroport VIP</option>
              </select>
            </div>

            {/* Real-time availability filter toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-[#163024]/15 rounded-xs bg-[#FAF8F5] hover:bg-[#F3EFE6] transition-colors">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="accent-[#163024] w-4 h-4 rounded-xs"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-[#163024] block">
                    Uniquement disponibles
                  </span>
                  <span className="text-[#1A1A1A]/60 text-[10px]">
                    Contrôle des dates en direct
                  </span>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Room Grid with Bidirectional Staggered whileInView Reveals */}
        {filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center bg-white border border-[#163024]/10 rounded-sm"
          >
            <p className="text-sm text-[#1A1A1A]/70 mb-4">{t.catalog.noRoomsFound}</p>
            <button
              onClick={() => {
                onDestinationChange('all');
                setMaxPrice(300000);
                setMinCapacity(1);
                setSelectedAmenity('all');
                setOnlyAvailable(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#163024] rounded-xs cursor-pointer hover:bg-[#0E2018] transition-colors"
            >
              {t.catalog.resetFilters}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, idx) => {
                const galleryCount = room.gallery?.length || 1;
                const availability = checkRoomAvailability(room.id, checkIn, checkOut, bookings);

                return (
                  <motion.div
                    key={room.id}
                    layout
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.12 }}
                    transition={{
                      duration: 0.7,
                      delay: (idx % 3) * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                    className="group flex flex-col bg-white border border-[#163024]/15 rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                  >
                    {/* Visual Anchor Image with Multi-Photo Badge and Live Availability */}
                    <div className="relative h-64 overflow-hidden bg-[#F3EFE6]">
                      <img
                        src={room.image}
                        alt={room.name[language]}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                        referrerPolicy="no-referrer"
                      />
                      {/* Destination Label */}
                      <div className="absolute top-3 left-3 bg-[#163024]/90 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 tracking-wider rounded-xs shadow-2xs">
                        {room.destinationLabel[language]}
                      </div>

                      {/* Top Right Badges: Gallery Count + Live Availability */}
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        {galleryCount > 1 && (
                          <div className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-2xs flex items-center gap-1 shadow-2xs">
                            <Images className="w-3 h-3 text-[#FAF8F5]" />
                            <span>{galleryCount} photos</span>
                          </div>
                        )}
                        {checkIn && checkOut && (
                          <div>
                            {availability.isAvailable ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-2xs backdrop-blur-xs shadow-2xs">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                                <span>Disponible</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-950 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded-2xs backdrop-blur-xs shadow-2xs">
                                <AlertCircle className="w-2.5 h-2.5 text-rose-700" />
                                <span>Occupée</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Right Dimension Badge */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-xs flex items-center gap-1.5">
                        <Maximize2 className="w-3 h-3" />
                        <span>
                          {room.sizeM2} {t.catalog.sqm}
                        </span>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Unboxed Metadata Discipline */}
                        <div className="flex items-center gap-2 text-xs text-[#8C4A32] font-semibold tracking-wide uppercase mb-2">
                          <span>{room.city}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.capacity} {t.catalog.guestsCapacity}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{room.view[language]}</span>
                        </div>

                        <h3 className="font-serif text-xl font-medium text-[#163024] mb-2 leading-snug group-hover:text-[#8C4A32] transition-colors">
                          {room.name[language]}
                        </h3>

                        <p className="text-xs text-[#1A1A1A]/75 leading-relaxed mb-4 line-clamp-2">
                          {room.subtitle[language]}
                        </p>

                        {/* Bedding specification */}
                        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/70 mb-4 pb-4 border-b border-[#163024]/10">
                          <Bed className="w-3.5 h-3.5 text-[#163024] shrink-0" />
                          <span className="truncate">{room.bedding[language]}</span>
                        </div>

                        {/* Key Included Amenities as unboxed tags */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#1A1A1A]/80 mb-6">
                          {room.amenities.slice(0, 3).map((amenity) => (
                            <div key={amenity} className="flex items-center gap-1">
                              {getAmenityIcon(amenity)}
                              <span className="text-[11px]">
                                {t.amenities[amenity as keyof typeof t.amenities]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price & Action Module */}
                      <div className="pt-4 border-t border-[#163024]/10 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60">
                            {t.catalog.perNight}
                          </div>
                          <div className="font-serif text-lg font-bold text-[#163024] tabular-nums font-mono">
                            {formatPrice(room.priceXAF, currency)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenRoomDetails(room)}
                            className="px-3 py-2 text-xs font-semibold text-[#163024] hover:bg-[#FAF8F5] border border-[#163024]/20 rounded-xs transition-colors cursor-pointer"
                          >
                            {t.catalog.detailsBtn}
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onBookRoom(room)}
                            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#163024] hover:bg-[#0E2018] rounded-xs transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>{t.nav.bookNow}</span>
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
