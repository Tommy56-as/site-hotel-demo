import React, { useState } from 'react';
import { Room, Language, Currency, Booking, GuestInfo, PaymentMethod } from '../types';
import { formatPrice, calculateBookingTotals } from '../utils/currency';
import { translations } from '../utils/i18n';
import { checkRoomAvailability } from '../utils/availability';
import { UssdPromptModal } from './UssdPromptModal';
import { InvoiceView } from './InvoiceView';
import { X, Check, CreditCard, Shield, AlertCircle, ArrowLeft, ArrowRight, Lock, CheckCircle2, Calendar } from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currency: Currency;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  existingBookings?: Booking[];
  onBookingConfirmed: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  isOpen,
  onClose,
  language,
  currency,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  existingBookings = [],
  onBookingConfirmed,
}) => {
  if (!isOpen || !room) return null;
  const t = translations[language];

  // Helper date initialization
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || todayStr);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || tomorrowStr);
  const [guestsCount, setGuestsCount] = useState<number>(initialGuests);

  // Guest Information state
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    civility: 'M.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    arrivalTime: '14:00',
    specialRequests: '',
    airportShuttle: true,
    breakfastIncluded: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [momoNumber, setMomoNumber] = useState<string>('');
  const [orangeNumber, setOrangeNumber] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardProcessing, setCardProcessing] = useState<boolean>(false);

  // USSD modal trigger state
  const [ussdOpen, setUssdOpen] = useState(false);

  // Completed booking reference
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Compute nights
  const computeNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return isNaN(diff) || diff < 1 ? 1 : diff;
  };

  const nights = computeNights();
  const totals = calculateBookingTotals(room.priceXAF, nights);
  const availability = checkRoomAvailability(room.id, checkIn, checkOut, existingBookings);

  // Phone validation for Cameroon (+237 6xx xx xx xx or 2xx xx xx xx)
  const validatePhone = (num: string): boolean => {
    const clean = num.replace(/\s+/g, '');
    return /^(6[5-9][0-9]{7}|2[2-4][0-9]{7})$/.test(clean);
  };

  // Step 1 validation
  const handleProceedToPayment = () => {
    const errors: Record<string, string> = {};

    if (!guestInfo.firstName.trim()) {
      errors.firstName = language === 'fr' ? 'Le prénom est requis.' : 'First name is required.';
    }
    if (!guestInfo.lastName.trim()) {
      errors.lastName = language === 'fr' ? 'Le nom est requis.' : 'Last name is required.';
    }
    if (!guestInfo.email.trim() || !/\S+@\S+\.\S+/.test(guestInfo.email)) {
      errors.email = language === 'fr' ? 'Adresse email invalide.' : 'Valid email required.';
    }
    if (!guestInfo.phone.trim() || !validatePhone(guestInfo.phone)) {
      errors.phone =
        language === 'fr'
          ? 'Numéro camerounais invalide (ex: 699 00 00 00).'
          : 'Invalid Cameroon phone number (e.g. 699 00 00 00).';
    }

    // Real-time availability check
    if (!availability.isAvailable) {
      errors.dates =
        language === 'fr'
          ? 'Cette suite est déjà réservée pour ces dates. Veuillez choisir d’autres dates.'
          : 'This suite is already booked for these dates. Please choose different dates.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    // Pre-fill mobile number with guest's phone if empty
    if (!momoNumber && guestInfo.phone) setMomoNumber(guestInfo.phone);
    if (!orangeNumber && guestInfo.phone) setOrangeNumber(guestInfo.phone);

    setStep(2);
  };

  // Step 2: Handle Payment trigger
  const handleInitiatePayment = () => {
    if (paymentMethod === 'momo' || paymentMethod === 'orange') {
      const activeNumber = paymentMethod === 'momo' ? momoNumber : orangeNumber;
      if (!validatePhone(activeNumber)) {
        setFormErrors({
          paymentPhone:
            language === 'fr'
              ? 'Numéro Mobile Money invalide (+237 6xx xx xx xx).'
              : 'Invalid Cameroon Mobile Money phone number.',
        });
        return;
      }
      setFormErrors({});
      setUssdOpen(true);
    } else {
      // Credit card simulation
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setFormErrors({ card: language === 'fr' ? 'Numéro de carte incomplet (16 chiffres).' : '16-digit card number required.' });
        return;
      }
      setFormErrors({});
      setCardProcessing(true);

      setTimeout(() => {
        setCardProcessing(false);
        const txId = `CARD-CM-${Math.floor(10000000 + Math.random() * 90000000)}`;
        finalizeBooking('card', txId);
      }, 1600);
    }
  };

  const handleUssdSuccess = (txId: string) => {
    setUssdOpen(false);
    finalizeBooking(paymentMethod, txId);
  };

  const finalizeBooking = (method: PaymentMethod, txId: string) => {
    const bookingId = `MLC-2026-${room.destination.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: bookingId,
      roomId: room.id,
      roomName: room.name[language],
      destination: room.destinationLabel[language],
      checkIn,
      checkOut,
      nights,
      guestsCount,
      guestInfo,
      payment: {
        method,
        momoNumber: method === 'momo' ? momoNumber : undefined,
        orangeNumber: method === 'orange' ? orangeNumber : undefined,
        cardLast4: method === 'card' ? cardNumber.slice(-4) : undefined,
        transactionId: txId,
        paidAt: new Date().toISOString(),
        status: 'confirmed',
        currencyUsed: currency,
        baseAmountXAF: totals.baseSubtotal,
        tvaXAF: totals.tva,
        taxeSejourXAF: totals.taxeSejour,
        totalXAF: totals.grandTotal,
      },
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setStep(3);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-[#163024]/20 rounded-sm shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Step Indicator */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-[#163024]/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C4A32] block">
                Réservation Officielle · Mboa Collection
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#163024]">
                {room.name[language]}
              </h2>
            </div>

            {/* Stepper (Only on Step 1 & 2) */}
            {step < 3 && (
              <div className="hidden sm:flex items-center gap-3 text-xs font-medium">
                <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#163024] font-bold' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#163024] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    1
                  </span>
                  <span>{t.checkout.step1Title}</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#163024] font-bold' : 'text-slate-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#163024] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    2
                  </span>
                  <span>{t.checkout.step2Title}</span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A]/60 hover:text-[#163024] hover:bg-black/5 rounded-xs transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content depending on step */}
          <div className="p-6 sm:p-8 flex-1">
            {/* STEP 1: Guest Information & Preferences */}
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Fields */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="font-serif text-base font-semibold text-[#163024] border-b border-[#163024]/10 pb-2">
                    {t.checkout.personalDetails}
                  </h3>

                  {/* Civility, First Name, Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.civility}
                      </label>
                      <select
                        value={guestInfo.civility}
                        onChange={(e) => setGuestInfo({ ...guestInfo, civility: e.target.value as any })}
                        className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium cursor-pointer"
                      >
                        <option value="M.">{t.checkout.mr}</option>
                        <option value="Mme">{t.checkout.mrs}</option>
                        <option value="Dr">{t.checkout.dr}</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.firstName} *
                      </label>
                      <input
                        type="text"
                        value={guestInfo.firstName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                        placeholder="ex: Jean"
                        className={`w-full bg-[#FAF8F5] border rounded-xs px-3 py-2 text-xs font-medium ${
                          formErrors.firstName ? 'border-red-500' : 'border-[#163024]/20'
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.firstName}</p>
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.lastName} *
                      </label>
                      <input
                        type="text"
                        value={guestInfo.lastName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                        placeholder="ex: Essomba"
                        className={`w-full bg-[#FAF8F5] border rounded-xs px-3 py-2 text-xs font-medium ${
                          formErrors.lastName ? 'border-red-500' : 'border-[#163024]/20'
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Cameroon Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.email} *
                      </label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        placeholder="jean.essomba@exemple.cm"
                        className={`w-full bg-[#FAF8F5] border rounded-xs px-3 py-2 text-xs font-medium ${
                          formErrors.email ? 'border-red-500' : 'border-[#163024]/20'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.phone} *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-[#163024]">
                          +237
                        </span>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                          placeholder={t.checkout.phonePlaceholder}
                          className={`w-full bg-[#FAF8F5] border rounded-xs pl-14 pr-3 py-2 text-xs font-mono font-medium ${
                            formErrors.phone ? 'border-red-500' : 'border-[#163024]/20'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-[#1A1A1A]/60 mt-1">
                        {t.checkout.phoneHelp}
                      </p>
                      {formErrors.phone && (
                        <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Dates & Guests Adjustment with Live Availability Status */}
                  <div className="p-4 bg-[#FAF8F5] border border-[#163024]/10 rounded-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#163024] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#8C4A32]" />
                        <span>Ajustement des dates & Contrôle Temps Réel</span>
                      </span>
                      {availability.isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t.availability.availableBadge}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-xs">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>{t.availability.unavailableBadge}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#1A1A1A]/70 mb-1">
                          {t.hero.checkIn}
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          min={todayStr}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full bg-white border border-[#163024]/20 rounded-xs px-2.5 py-1.5 text-xs cursor-pointer focus:border-[#163024]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#1A1A1A]/70 mb-1">
                          {t.hero.checkOut}
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full bg-white border border-[#163024]/20 rounded-xs px-2.5 py-1.5 text-xs cursor-pointer focus:border-[#163024]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#1A1A1A]/70 mb-1">
                          {t.hero.guests}
                        </label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full bg-white border border-[#163024]/20 rounded-xs px-2.5 py-1.5 text-xs cursor-pointer focus:border-[#163024]"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num} {num > 1 ? t.hero.guestPlural : t.hero.guestSingular}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Conflict Alert Banner if room is occupied */}
                    {!availability.isAvailable && availability.conflictRange && (
                      <div className="p-3 bg-rose-50 border border-rose-300 rounded-xs text-xs text-rose-900 space-y-2 animate-in fade-in">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">
                              {t.availability.conflictExplanation}
                            </p>
                            <p className="text-[11px] text-rose-800 mt-0.5">
                              Réservation active enregistrée du <strong>{availability.conflictRange.start}</strong> au <strong>{availability.conflictRange.end}</strong>.
                            </p>
                          </div>
                        </div>

                        {availability.nextAvailableDate && (
                          <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                            <span className="text-[11px] text-rose-800">
                              {t.modal.nextAvailabilityFrom} : <strong>{availability.nextAvailableDate}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (availability.nextAvailableDate) {
                                  setCheckIn(availability.nextAvailableDate);
                                  const nextEnd = new Date(new Date(availability.nextAvailableDate).getTime() + 86400000 * 2)
                                    .toISOString()
                                    .split('T')[0];
                                  setCheckOut(nextEnd);
                                }
                              }}
                              className="px-2.5 py-1 bg-[#163024] text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs hover:bg-[#0E2018] cursor-pointer"
                            >
                              Appliquer ces dates
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preferences Checkbox & Arrival Time */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A1A1A]/85">
                      <input
                        type="checkbox"
                        checked={guestInfo.airportShuttle}
                        onChange={(e) => setGuestInfo({ ...guestInfo, airportShuttle: e.target.checked })}
                        className="accent-[#163024] w-4 h-4 rounded-xs"
                      />
                      <span>{t.checkout.airportShuttleCheck}</span>
                    </label>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A]/70 mb-1">
                        {t.checkout.specialRequests}
                      </label>
                      <textarea
                        rows={2}
                        value={guestInfo.specialRequests}
                        onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                        placeholder="Ex: Régime alimentaire spécifique, accueil protocolaire, lit d'appoint..."
                        className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Stay Summary Card */}
                <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#163024]/15 rounded-xs p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-semibold text-[#163024] mb-4">
                      {t.checkout.orderSummary}
                    </h4>

                    <div className="space-y-3 text-xs border-b border-[#163024]/10 pb-4">
                      <div className="flex justify-between">
                        <span className="text-[#1A1A1A]/70">{t.checkout.room} :</span>
                        <span className="font-medium text-[#163024] text-right">{room.name[language]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1A1A1A]/70">{t.checkout.duration} :</span>
                        <span className="font-medium">{nights} {t.checkout.nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1A1A1A]/70">{t.hero.guests} :</span>
                        <span className="font-medium">{guestsCount}</span>
                      </div>
                    </div>

                    {/* Price & Taxes Breakdown */}
                    <div className="pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-[#1A1A1A]/70">
                        <span>{t.checkout.subtotal} :</span>
                        <span className="font-mono tabular-nums">{formatPrice(totals.baseSubtotal, currency)}</span>
                      </div>
                      <div className="flex justify-between text-[#1A1A1A]/70">
                        <span>{t.checkout.tvaLabel} :</span>
                        <span className="font-mono tabular-nums">{formatPrice(totals.tva, currency)}</span>
                      </div>
                      <div className="flex justify-between text-[#1A1A1A]/70">
                        <span>{t.checkout.taxeSejourLabel} :</span>
                        <span className="font-mono tabular-nums">{formatPrice(totals.taxeSejour, currency)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#163024]/20 font-serif text-base font-bold text-[#163024]">
                        <span>{t.checkout.totalToPay} :</span>
                        <span className="font-mono tabular-nums text-[#163024]">{formatPrice(totals.grandTotal, currency)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#163024]/10 space-y-2">
                    <button
                      type="button"
                      disabled={!availability.isAvailable}
                      onClick={handleProceedToPayment}
                      className={`w-full py-3 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs ${
                        availability.isAvailable
                          ? 'bg-[#163024] hover:bg-[#0E2018] cursor-pointer'
                          : 'bg-stone-400 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <span>
                        {availability.isAvailable
                          ? t.checkout.continueToPayment
                          : language === 'fr'
                          ? 'Suite indisponible pour ces dates'
                          : 'Suite unavailable for these dates'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {!availability.isAvailable && (
                      <p className="text-[11px] text-rose-700 text-center font-medium">
                        {t.availability.alternativeSuggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Realistic Payment Simulation */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#163024] mb-1">
                      {t.checkout.paymentMethodSelect}
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70">
                      Règlement sécurisé aux standards bancaires camerounais et régionaux CEMAC.
                    </p>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* MTN MoMo */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-3 border rounded-xs text-left transition-all cursor-pointer ${
                        paymentMethod === 'momo'
                          ? 'border-[#FFCC00] bg-[#FFCC00]/10 shadow-xs'
                          : 'border-[#163024]/15 bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-xs bg-[#FFCC00] text-black font-bold text-[10px] flex items-center justify-center mb-2">
                        MoMo
                      </div>
                      <div className="text-xs font-bold text-[#163024]">MTN Money</div>
                      <div className="text-[10px] text-[#1A1A1A]/60">Invite USSD *126#</div>
                    </button>

                    {/* Orange Money */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange')}
                      className={`p-3 border rounded-xs text-left transition-all cursor-pointer ${
                        paymentMethod === 'orange'
                          ? 'border-[#FF7900] bg-[#FF7900]/10 shadow-xs'
                          : 'border-[#163024]/15 bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-xs bg-[#FF7900] text-white font-bold text-[10px] flex items-center justify-center mb-2">
                        OM
                      </div>
                      <div className="text-xs font-bold text-[#163024]">Orange Money</div>
                      <div className="text-[10px] text-[#1A1A1A]/60">Prompt USSD #150#</div>
                    </button>

                    {/* Visa / Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border rounded-xs text-left transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#163024] bg-[#163024]/10 shadow-xs'
                          : 'border-[#163024]/15 bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-xs bg-[#163024] text-white flex items-center justify-center mb-2">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-bold text-[#163024]">Carte Bancaire</div>
                      <div className="text-[10px] text-[#1A1A1A]/60">Visa / Mastercard</div>
                    </button>
                  </div>

                  {/* Payment Details Container */}
                  <div className="p-5 bg-[#FAF8F5] border border-[#163024]/15 rounded-xs">
                    {/* MTN MoMo Flow */}
                    {paymentMethod === 'momo' && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#FFCC00] text-black font-bold text-xs rounded-xs">
                            MTN
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#163024]">{t.checkout.momoTitle}</h4>
                            <p className="text-[11px] text-[#1A1A1A]/75 mt-0.5">{t.checkout.momoInstruction}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                            {t.checkout.mobileNumberLabel}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs font-bold text-[#163024] font-mono">
                              +237
                            </span>
                            <input
                              type="tel"
                              value={momoNumber}
                              onChange={(e) => setMomoNumber(e.target.value)}
                              placeholder="67x xx xx xx ou 68x xx xx xx"
                              className="w-full bg-white border border-[#163024]/20 rounded-xs pl-14 pr-3 py-2 text-xs font-mono font-medium"
                            />
                          </div>
                          {formErrors.paymentPhone && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors.paymentPhone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Orange Money Flow */}
                    {paymentMethod === 'orange' && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#FF7900] text-white font-bold text-xs rounded-xs">
                            OM
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#163024]">{t.checkout.orangeTitle}</h4>
                            <p className="text-[11px] text-[#1A1A1A]/75 mt-0.5">{t.checkout.orangeInstruction}</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                            {t.checkout.mobileNumberLabel}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-xs font-bold text-[#163024] font-mono">
                              +237
                            </span>
                            <input
                              type="tel"
                              value={orangeNumber}
                              onChange={(e) => setOrangeNumber(e.target.value)}
                              placeholder="69x xx xx xx ou 65x xx xx xx"
                              className="w-full bg-white border border-[#163024]/20 rounded-xs pl-14 pr-3 py-2 text-xs font-mono font-medium"
                            />
                          </div>
                          {formErrors.paymentPhone && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors.paymentPhone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Credit Card Flow */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#163024]/10 pb-3">
                          <span className="text-xs font-bold text-[#163024]">{t.checkout.cardTitle}</span>
                          <span className="text-[10px] text-[#1A1A1A]/60 flex items-center gap-1 font-sans">
                            <Lock className="w-3 h-3 text-emerald-700" />
                            Cryptage SSL 256 bits
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                            {t.checkout.cardNumberLabel}
                          </label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(formatted);
                            }}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-mono"
                          />
                          {formErrors.card && (
                            <p className="text-[10px] text-red-500 mt-1">{formErrors.card}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                              {t.checkout.cardExpiryLabel}
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                              {t.checkout.cardCvvLabel}
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="•••"
                              className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                            {t.checkout.cardHolderLabel}
                          </label>
                          <input
                            type="text"
                            value={cardHolder || `${guestInfo.firstName} ${guestInfo.lastName}`}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="JEAN ESSOMBA"
                            className="w-full bg-white border border-[#163024]/20 rounded-xs px-3 py-2 text-xs uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back and Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-xs font-semibold text-[#163024] hover:bg-black/5 rounded-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.checkout.backToInfo}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      disabled={cardProcessing}
                      className="px-6 py-2.5 bg-[#163024] hover:bg-[#0E2018] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {cardProcessing
                          ? t.checkout.processingPayment
                          : `${t.checkout.simulatePaymentBtn} ${formatPrice(totals.grandTotal, currency)}`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Summary */}
                <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#163024]/15 rounded-xs p-6 space-y-4">
                  <h4 className="font-serif text-base font-semibold text-[#163024]">
                    Validation du dossier
                  </h4>
                  <div className="text-xs space-y-2 text-[#1A1A1A]/80">
                    <p>
                      <strong className="text-[#163024]">Titulaire :</strong> {guestInfo.civility} {guestInfo.firstName} {guestInfo.lastName}
                    </p>
                    <p>
                      <strong className="text-[#163024]">Téléphone :</strong> +237 {guestInfo.phone}
                    </p>
                    <p>
                      <strong className="text-[#163024]">Dates :</strong> {checkIn} au {checkOut} ({nights} nuits)
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#163024]/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#1A1A1A]/70">Hébergement HT :</span>
                      <span className="font-mono">{formatPrice(totals.baseSubtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#1A1A1A]/70">TVA Cameroun (19,25%) :</span>
                      <span className="font-mono">{formatPrice(totals.tva, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#1A1A1A]/70">Taxe de séjour :</span>
                      <span className="font-mono">{formatPrice(totals.taxeSejour, currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#163024]/15 font-serif text-base font-bold text-[#163024]">
                      <span>Total Net :</span>
                      <span className="font-mono">{formatPrice(totals.grandTotal, currency)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-[#163024]/10 rounded-xs text-[11px] text-[#1A1A1A]/70 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-[#163024] shrink-0 mt-0.5" />
                    <span>{t.checkout.guaranteeNotice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmed Voucher & Printable Invoice */}
            {step === 3 && confirmedBooking && (
              <InvoiceView
                booking={confirmedBooking}
                language={language}
                currency={currency}
                onClose={onClose}
                onNewBooking={() => {
                  setStep(1);
                  setConfirmedBooking(null);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* USSD Prompt Overlay for MTN MoMo & Orange Money */}
      <UssdPromptModal
        isOpen={ussdOpen}
        method={paymentMethod as 'momo' | 'orange'}
        phoneNumber={paymentMethod === 'momo' ? momoNumber : orangeNumber}
        amountFormatted={formatPrice(totals.grandTotal, 'XAF')}
        language={language}
        onSuccess={handleUssdSuccess}
        onCancel={() => setUssdOpen(false)}
      />
    </>
  );
};
