import React, { useState } from 'react';
import { Booking, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { translations } from '../utils/i18n';
import { InvoiceView } from './InvoiceView';
import { X, Calendar, MapPin, Printer, Trash2, CheckCircle, BedDouble } from 'lucide-react';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  language: Language;
  currency: Currency;
  onCancelBooking: (bookingId: string) => void;
  onExploreSuites: () => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  language,
  currency,
  onCancelBooking,
  onExploreSuites,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-[#163024]/20 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#FAF8F5] border-b border-[#163024]/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C4A32] block">
                Espace Résident · Mboa Collection
              </span>
              <h2 className="font-serif text-xl font-bold text-[#163024]">
                {t.myBookings.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#1A1A1A]/60 hover:text-[#163024] hover:bg-black/5 rounded-xs transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {selectedInvoice ? (
              <div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="mb-4 text-xs font-semibold text-[#163024] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Retour à la liste des séjours
                </button>
                <InvoiceView
                  booking={selectedInvoice}
                  language={language}
                  currency={currency}
                  onClose={() => setSelectedInvoice(null)}
                />
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <BedDouble className="w-12 h-12 text-[#163024]/30 mx-auto" />
                <p className="text-sm text-[#1A1A1A]/70 max-w-xs mx-auto">
                  {t.myBookings.empty}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreSuites();
                  }}
                  className="px-5 py-2.5 bg-[#163024] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#0E2018] transition-colors cursor-pointer"
                >
                  {t.myBookings.exploreSuites}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 bg-[#FAF8F5] border border-[#163024]/15 rounded-xs transition-all hover:border-[#163024]/40 hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#8C4A32]">
                            {booking.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t.myBookings.statusConfirmed}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-semibold text-[#163024]">
                          {booking.roomName}
                        </h4>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-base font-bold text-[#163024] tabular-nums font-mono">
                          {formatPrice(booking.payment.totalXAF, currency)}
                        </div>
                        <div className="text-[10px] text-[#1A1A1A]/60">
                          {booking.payment.method.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#1A1A1A]/80 py-2 border-y border-[#163024]/10 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#163024]" />
                        <span>Du {booking.checkIn} au {booking.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C4A32]" />
                        <span>{booking.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-[#1A1A1A]/60">
                        Client : {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(booking)}
                          className="px-3 py-1.5 bg-white border border-[#163024]/20 hover:bg-[#FAF8F5] text-[#163024] font-semibold text-xs rounded-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Printer className="w-3 h-3" />
                          <span>{t.myBookings.viewInvoice}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(t.myBookings.cancelConfirm)) {
                              onCancelBooking(booking.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                          title={t.myBookings.cancelBooking}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
