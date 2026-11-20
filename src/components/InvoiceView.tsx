import React, { useState } from 'react';
import { Booking, Language, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { translations } from '../utils/i18n';
import { getWhatsAppConfirmationLink, getGmailWebLink, getMailtoLink } from '../utils/confirmation';
import { Logo } from './Logo';
import { Printer, CheckCircle, ShieldCheck, Download, X, MessageSquare, Mail, Send, Loader2 } from 'lucide-react';
import { generateBookingPdf } from '../utils/pdfGenerator';

interface InvoiceViewProps {
  booking: Booking;
  language: Language;
  currency: Currency;
  onClose?: () => void;
  onNewBooking?: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  booking,
  language,
  currency,
  onClose,
  onNewBooking,
}) => {
  const t = translations[language];
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generateBookingPdf(booking, currency, language);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const paymentMethodLabel = {
    momo: 'MTN Mobile Money Cameroun (*126#)',
    orange: 'Orange Money Cameroun (#150#)',
    card: 'Carte Bancaire Internationale (Visa / Mastercard)',
  }[booking.payment.method];

  const whatsappUrl = getWhatsAppConfirmationLink(booking, language);
  const gmailUrl = getGmailWebLink(booking, language);
  const mailtoUrl = getMailtoLink(booking, language);

  return (
    <div className="bg-white border border-[#163024]/20 rounded-sm shadow-lg overflow-hidden max-w-3xl mx-auto my-4 text-[#1A1A1A]">
      {/* Top Banner Actions (Hidden on print) */}
      <div className="no-print bg-[#163024] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-serif text-base font-semibold">
            {t.invoice.bookingConfirmed}
          </span>
          <span className="text-xs text-white/70 ml-2 font-mono">
            #{booking.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Direct PDF Download Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-3.5 py-1.5 bg-[#8C4A32] hover:bg-[#743C28] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Télécharger directement la facture en fichier PDF"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>
              {isDownloadingPdf
                ? language === 'fr'
                  ? 'Génération PDF...'
                  : 'Generating PDF...'
                : language === 'fr'
                ? 'Télécharger PDF'
                : 'Download PDF'}
            </span>
          </button>

          {/* Standard Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white text-[#163024] hover:bg-[#FAF8F5] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.invoice.printBtn}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xs transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Instant Transmission Bar (WhatsApp & Gmail Confirmation) */}
      <div className="no-print bg-[#F3EFE6] border-b border-[#163024]/15 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium text-[#163024]">
          <Send className="w-4 h-4 text-[#8C4A32]" />
          <span>
            {language === 'fr'
              ? 'Transmettre la confirmation de séjour au client :'
              : 'Send stay confirmation to guest:'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer text-xs"
            title="Envoyer la confirmation officielle via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp (+237 {booking.guestInfo.phone})</span>
          </a>

          {/* Gmail Web */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#EA4335] hover:bg-[#D93025] text-white font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer text-xs"
            title="Ouvrir dans Gmail avec le justificatif prérempli"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail</span>
          </a>

          {/* Mailto alternative */}
          <a
            href={mailtoUrl}
            className="px-2.5 py-1.5 bg-white border border-[#163024]/20 hover:bg-[#FAF8F5] text-[#163024] font-semibold rounded-xs transition-colors flex items-center gap-1 text-xs cursor-pointer"
            title="Ouvrir dans le client de messagerie par défaut"
          >
            <span>Email</span>
          </a>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-invoice" className="p-8 sm:p-12 space-y-8 bg-white">
        {/* Header with Formal Cameroonian Corporate Identity and Brand Logo */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#163024]/20 pb-8">
          <div>
            <Logo variant="dark" showSubtitle={true} className="mb-3" />
            <div className="text-[11px] text-[#1A1A1A]/70 space-y-0.5 mt-2">
              <p>{t.invoice.hotelAddress}</p>
              <p className="font-mono">{t.invoice.hotelFiscal}</p>
              <p>Agrément Ministériel N° 00412/MINTOUL/SG/DET/2021</p>
            </div>
          </div>

          <div className="sm:text-right bg-[#FAF8F5] sm:bg-transparent p-4 sm:p-0 rounded-xs border sm:border-0 border-[#163024]/10 w-full sm:w-auto">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#8C4A32]">
              {t.invoice.receiptTitle}
            </div>
            <div className="font-mono text-base font-bold text-[#163024] mt-1">
              N° {booking.id}
            </div>
            <div className="text-xs text-[#1A1A1A]/70 mt-1">
              {t.invoice.issuedOn} : {new Date(booking.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Client & Stay Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          {/* Guest Details */}
          <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#163024]/10">
            <span className="font-serif text-sm font-semibold text-[#163024] block mb-3 border-b border-[#163024]/10 pb-1.5">
              Client Titulaire du Séjour
            </span>
            <div className="space-y-1.5 text-[#1A1A1A]">
              <p className="font-bold text-sm text-[#163024]">
                {booking.guestInfo.civility} {booking.guestInfo.firstName} {booking.guestInfo.lastName}
              </p>
              <p className="text-[#1A1A1A]/80">{booking.guestInfo.email}</p>
              <p className="font-mono text-[#1A1A1A]/80">+237 {booking.guestInfo.phone}</p>
              <p className="text-[11px] text-[#1A1A1A]/60 pt-1">
                Heure d'arrivée prévue : {booking.guestInfo.arrivalTime}
              </p>
            </div>
          </div>

          {/* Stay Properties */}
          <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#163024]/10">
            <span className="font-serif text-sm font-semibold text-[#163024] block mb-3 border-b border-[#163024]/10 pb-1.5">
              Sanctuaire & Calendrier
            </span>
            <div className="space-y-1.5 text-[#1A1A1A]">
              <p className="font-bold text-sm text-[#163024]">
                {booking.roomName}
              </p>
              <p className="text-[#8C4A32] font-semibold text-xs">
                {booking.destination}
              </p>
              <p className="font-medium text-xs pt-1">
                Du <strong>{booking.checkIn}</strong> au <strong>{booking.checkOut}</strong>
              </p>
              <p className="text-[11px] text-[#1A1A1A]/70">
                Durée : <strong>{booking.nights} nuit(s)</strong> · Capacité : <strong>{booking.guestsCount} voyageur(s)</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Financial Line Items Table */}
        <div className="border border-[#163024]/20 rounded-xs overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#163024] border-b border-[#163024]/20 font-serif">
                <th className="py-3 px-4 text-left font-semibold">Désignation de la prestation</th>
                <th className="py-3 px-4 text-center font-semibold">Quantité</th>
                <th className="py-3 px-4 text-right font-semibold">Tarif unitaire</th>
                <th className="py-3 px-4 text-right font-semibold">Total Net HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#163024]/10">
              <tr>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#163024]">{booking.roomName}</div>
                  <div className="text-[11px] text-[#1A1A1A]/60">
                    Hébergement en suite de prestige avec petit-déjeuner du terroir
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-mono">{booking.nights} nuit(s)</td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatPrice(booking.payment.baseAmountXAF / booking.nights, currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-[#163024]">
                  {formatPrice(booking.payment.baseAmountXAF, currency)}
                </td>
              </tr>

              {booking.guestInfo.airportShuttle && (
                <tr>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#163024]">Navette aéroport VIP</div>
                    <div className="text-[11px] text-[#1A1A1A]/60">
                      Accueil protocolaire et transfert berline climatisée
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">1</td>
                  <td className="py-3.5 px-4 text-right font-mono">Inclus (Offert)</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#163024]">
                    0 FCFA
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals & Tax Calculation (TVA 19.25% & Taxe de séjour) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
          {/* Payment proof metadata */}
          <div className="bg-[#FAF8F5] border border-[#163024]/15 p-4 rounded-xs text-xs space-y-2 w-full sm:max-w-md">
            <div className="font-serif font-bold text-[#163024] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Acquittement & Preuve de Règlement</span>
            </div>
            <div className="space-y-1 text-[11px] text-[#1A1A1A]/80">
              <p>
                <strong>Mode d’encaissement :</strong> {paymentMethodLabel}
              </p>
              <p className="font-mono">
                <strong>Identifiant de transaction :</strong> {booking.payment.transactionId}
              </p>
              <p>
                <strong>Date & Heure d'acquittement :</strong> {new Date(booking.payment.paidAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
              </p>
              <p className="text-emerald-700 font-bold uppercase tracking-wider text-[10px] pt-1">
                Statut : Règlement intégral acquitté (Sans réserve)
              </p>
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-[#1A1A1A]/70 pb-1">
              <span>Total Hébergement HT :</span>
              <span className="font-mono tabular-nums">{formatPrice(booking.payment.baseAmountXAF, currency)}</span>
            </div>
            <div className="flex justify-between text-[#1A1A1A]/70 pb-1">
              <span>TVA Cameroun (19,25%) :</span>
              <span className="font-mono tabular-nums">{formatPrice(booking.payment.tvaXAF, currency)}</span>
            </div>
            <div className="flex justify-between text-[#1A1A1A]/70 pb-2 border-b border-[#163024]/20">
              <span>Taxe de séjour touristique :</span>
              <span className="font-mono tabular-nums">{formatPrice(booking.payment.taxeSejourXAF, currency)}</span>
            </div>
            <div className="flex justify-between font-serif text-base font-bold text-[#163024] pt-1">
              <span>Montant Total TTC :</span>
              <span className="font-mono tabular-nums text-[#163024]">{formatPrice(booking.payment.totalXAF, currency)}</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Seal */}
        <div className="pt-6 border-t border-[#163024]/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#1A1A1A]/60">
          <p className="max-w-md leading-relaxed text-center sm:text-left">
            Facture certifiée conforme émise par Mboa Luxury Collection S.A. sous le régime du réel d'imposition (DGI Cameroun). En cas de réclamation, s'adresser à la Direction Générale sous 48h.
          </p>
          <div className="border border-[#163024]/30 px-3 py-1.5 rounded-xs font-mono uppercase tracking-widest text-[#163024] text-center font-bold">
            ACQUITTÉ · DGI CEMAC
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA (Hidden on print) */}
      <div className="no-print bg-[#FAF8F5] border-t border-[#163024]/10 p-4 px-6 flex justify-between items-center">
        {onNewBooking && (
          <button
            onClick={onNewBooking}
            className="text-xs font-bold text-[#8C4A32] hover:underline cursor-pointer"
          >
            ← Effectuer une autre réservation
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#163024] text-white hover:bg-[#0E2018] text-xs font-bold rounded-xs cursor-pointer shadow-xs"
          >
            Fermer le reçu
          </button>
        )}
      </div>
    </div>
  );
};
