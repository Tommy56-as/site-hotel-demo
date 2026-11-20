import React, { useState } from 'react';
import { Room, Language, Currency, Booking } from '../types';
import { formatPrice } from '../utils/currency';
import { translations } from '../utils/i18n';
import { checkRoomAvailability, getRoomBookedRanges } from '../utils/availability';
import {
  X,
  Check,
  Bed,
  Maximize2,
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  bookings: Booking[];
  onBookRoom: (room: Room, checkInDate?: string, checkOutDate?: string) => void;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  isOpen,
  onClose,
  language,
  currency,
  bookings,
  onBookRoom,
  defaultCheckIn,
  defaultCheckOut,
}) => {
  if (!isOpen || !room) return null;
  const t = translations[language];

  // Gallery images array
  const galleryPhotos =
    room.gallery && room.gallery.length > 0
      ? room.gallery
      : [room.image];

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Local date check inside modal
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const [testCheckIn, setTestCheckIn] = useState<string>(defaultCheckIn || todayStr);
  const [testCheckOut, setTestCheckOut] = useState<string>(defaultCheckOut || tomorrowStr);

  const availability = checkRoomAvailability(room.id, testCheckIn, testCheckOut, bookings);
  const bookedRanges = getRoomBookedRanges(room.id, bookings);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  const getPhotoLabel = (index: number) => {
    const labelsFr = [
      'Chambre Impériale & Literie de Prestige',
      'Salle d’Eau & Baignoire en Pierre Naturelle',
      'Salon Exécutif Privé & Boiseries d’Iroko',
      'Terrasse Extérieure & Vue Panoramique',
    ];
    const labelsEn = [
      'Imperial Master Suite & Prestige Bedding',
      'En-Suite Bathroom & Natural Stone Tub',
      'Private Executive Salon & Iroko Timber Work',
      'Outdoor Deck & Panoramic View',
    ];
    return language === 'fr'
      ? labelsFr[index % labelsFr.length]
      : labelsEn[index % labelsEn.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-[#163024]/20 rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-xs border-b border-[#163024]/10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8C4A32] block">
              {room.destinationLabel[language]}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#163024]">
              {room.name[language]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1A1A1A]/60 hover:text-[#163024] hover:bg-black/5 rounded-xs transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* MULTI-PHOTO GALLERY CAROUSEL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#1A1A1A]/70">
              <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[#163024] text-[11px]">
                <ImageIcon className="w-3.5 h-3.5 text-[#8C4A32]" />
                {t.modal.photoGallery}
              </span>
              <span className="font-mono text-[11px] bg-[#FAF8F5] px-2 py-0.5 border border-[#163024]/10 rounded-xs font-medium">
                {t.modal.photoCounter} {activePhotoIdx + 1} {t.modal.photoOf} {galleryPhotos.length}
              </span>
            </div>

            {/* Main Interactive Stage */}
            <div className="relative h-72 sm:h-96 md:h-[420px] rounded-sm overflow-hidden bg-[#F3EFE6] border border-[#163024]/15 group">
              <img
                src={galleryPhotos[activePhotoIdx]}
                alt={`${room.name[language]} - Photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Prev & Next Floating Buttons */}
              {galleryPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    aria-label={t.modal.prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer backdrop-blur-xs opacity-90 group-hover:opacity-100 shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    aria-label={t.modal.nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer backdrop-blur-xs opacity-90 group-hover:opacity-100 shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                <span className="font-medium truncate pr-2">
                  {getPhotoLabel(activePhotoIdx)}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 bg-white/20 backdrop-blur-xs text-[11px] font-semibold uppercase tracking-wider rounded-xs">
                  {room.view[language]}
                </span>
              </div>
            </div>

            {/* Thumbnails Row */}
            {galleryPhotos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
                {galleryPhotos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-xs overflow-hidden border transition-all cursor-pointer ${
                      activePhotoIdx === idx
                        ? 'border-[#163024] ring-2 ring-[#8C4A32]/40 scale-102 shadow-xs'
                        : 'border-[#163024]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold bg-black/70 text-white px-1 rounded-2xs font-mono">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subtitle & Narrative Description */}
          <div>
            <p className="font-serif text-lg italic text-[#8C4A32] mb-3">
              « {room.subtitle[language]} »
            </p>
            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
              {room.description[language]}
            </p>
          </div>

          {/* REAL-TIME AVAILABILITY & CALENDAR AUDIT SECTION */}
          <div className="p-5 bg-[#FAF8F5] border border-[#163024]/15 rounded-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#163024]/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8C4A32]" />
                <h3 className="font-serif text-base font-semibold text-[#163024]">
                  {t.modal.availabilityTitle}
                </h3>
              </div>
              <div>
                {availability.isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {t.availability.availableBadge}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-800 border border-rose-300 rounded-xs text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    {t.availability.unavailableBadge}
                  </span>
                )}
              </div>
            </div>

            {/* Quick date simulator for this room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-1">
                  {t.hero.checkIn}
                </label>
                <input
                  type="date"
                  value={testCheckIn}
                  min={todayStr}
                  onChange={(e) => setTestCheckIn(e.target.value)}
                  className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60 mb-1">
                  {t.hero.checkOut}
                </label>
                <input
                  type="date"
                  value={testCheckOut}
                  min={testCheckIn || todayStr}
                  onChange={(e) => setTestCheckOut(e.target.value)}
                  className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#163024]"
                />
              </div>
            </div>

            {/* Conflict details or Confirmation */}
            {!availability.isAvailable && availability.conflictRange && (
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xs text-xs text-rose-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  {t.modal.conflictAlert}
                </p>
                <p>
                  Occupée du <strong>{availability.conflictRange.start}</strong> au <strong>{availability.conflictRange.end}</strong>.
                </p>
                {availability.nextAvailableDate && (
                  <p className="text-[#8C4A32] font-medium">
                    {t.modal.nextAvailabilityFrom} : <strong>{availability.nextAvailableDate}</strong>.
                  </p>
                )}
              </div>
            )}

            {/* Current Bookings schedule preview */}
            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#1A1A1A]/70 mb-2">
                {t.modal.bookedRangesTitle}
              </span>
              {bookedRanges.length === 0 ? (
                <p className="text-xs text-[#163024]/75 italic">
                  {t.modal.noBookingsOnRoom}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bookedRanges.map((range, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#163024]/15 rounded-xs text-[11px] text-[#1A1A1A] font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A32]" />
                      Du {range.start} au {range.end}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="border border-[#163024]/15 rounded-xs overflow-hidden">
            <div className="bg-[#FAF8F5] px-4 py-2.5 border-b border-[#163024]/10 font-serif text-sm font-semibold text-[#163024]">
              {t.modal.specifications}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#163024]/10 text-xs">
              <div className="p-4 flex items-start gap-3">
                <Maximize2 className="w-4 h-4 text-[#8C4A32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1A1A1A]/60 uppercase text-[10px] tracking-wider">
                    {t.modal.area}
                  </div>
                  <div className="font-medium text-[#1A1A1A] tabular-nums mt-0.5">
                    {room.sizeM2} {t.catalog.sqm}
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <Bed className="w-4 h-4 text-[#8C4A32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1A1A1A]/60 uppercase text-[10px] tracking-wider">
                    {t.modal.bedding}
                  </div>
                  <div className="font-medium text-[#1A1A1A] mt-0.5">
                    {room.bedding[language]}
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#8C4A32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1A1A1A]/60 uppercase text-[10px] tracking-wider">
                    {t.modal.view}
                  </div>
                  <div className="font-medium text-[#1A1A1A] mt-0.5">
                    {room.view[language]}
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-start gap-3">
                <Layers className="w-4 h-4 text-[#8C4A32] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1A1A1A]/60 uppercase text-[10px] tracking-wider">
                    {t.modal.floor}
                  </div>
                  <div className="font-medium text-[#1A1A1A] mt-0.5">
                    {room.floor[language]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Inclusions & Architectural Highlights */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#163024] mb-3">
              {t.modal.includedServices}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1A1A1A]/85">
              {room.features[language].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#163024] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Marker */}
          <div className="p-4 bg-[#FAF8F5] border border-[#163024]/10 rounded-xs flex items-center gap-3 text-xs text-[#1A1A1A]/80">
            <ShieldCheck className="w-5 h-5 text-[#163024] shrink-0" />
            <span>
              Réservation garantie sans frais cachés. Régularisation fiscale conforme aux normes de la République du Cameroun (TVA 19,25% + taxe de séjour).
            </span>
          </div>
        </div>

        {/* Modal Footer / Purchase Bar */}
        <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-[#FAF8F5] border-t border-[#163024]/10">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#1A1A1A]/60">
              Tarif officiel direct
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[#163024] tabular-nums">
              {formatPrice(room.priceXAF, currency)}{' '}
              <span className="text-xs font-normal text-[#1A1A1A]/70">/ nuit</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-[#1A1A1A]/80 hover:bg-black/5 rounded-xs transition-colors cursor-pointer"
            >
              {t.modal.close}
            </button>
            <button
              onClick={() => {
                onClose();
                onBookRoom(room, testCheckIn, testCheckOut);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#163024] hover:bg-[#0E2018] rounded-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{t.modal.reserveThisRoom}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
