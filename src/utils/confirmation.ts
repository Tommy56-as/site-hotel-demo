import { Booking } from '../types';
import { formatPrice } from './currency';

export function formatCameroonPhoneForWhatsApp(phone: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('237')) {
    return digits;
  }
  return `237${digits}`;
}

export function generateBookingConfirmationText(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  const formattedTotal = formatPrice(booking.payment.totalXAF, 'XAF');
  const paymentMethodLabel =
    booking.payment.method === 'momo'
      ? 'MTN Mobile Money (*126#)'
      : booking.payment.method === 'orange'
      ? 'Orange Money (#150#)'
      : 'Carte Bancaire Internationale';

  if (lang === 'en') {
    return `*MBOA LUXURY COLLECTION — OFFICIAL RESERVATION CONFIRMATION*
Reference: #${booking.id}
Property: ${booking.roomName} (${booking.destination})
Guest: ${booking.guestInfo.civility} ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}
Dates: From ${booking.checkIn} to ${booking.checkOut} (${booking.nights} nights)
Total Paid: ${formattedTotal} (Taxes Included)
Settlement Method: ${paymentMethodLabel}
Transaction ID: ${booking.payment.transactionId}
${booking.guestInfo.airportShuttle ? 'VIP Airport Shuttle: Confirmed (Douala / Yaoundé Nsimalen)' : ''}

Our Executive VIP Concierge Desk remains at your disposal 24/7 on WhatsApp at +237 699 45 88 12.
We look forward to welcoming you to Cameroon!
Official Portal: https://mboacollection.cm`;
  }

  return `*MBOA LUXURY COLLECTION — CONFIRMATION OFFICIELLE DE RÉSERVATION*
Référence dossier : #${booking.id}
Établissement : ${booking.roomName} (${booking.destination})
Bénéficiaire : ${booking.guestInfo.civility} ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}
Séjour : Du ${booking.checkIn} au ${booking.checkOut} (${booking.nights} nuitées)
Montant réglé : ${formattedTotal} TTC
Règlement : ${paymentMethodLabel}
Réf. Transaction : ${booking.payment.transactionId}
${booking.guestInfo.airportShuttle ? 'Navette aéroport VIP : Confirmée et réservée' : ''}

Notre service de conciergerie VIP reste à votre entière disposition 24h/24 par WhatsApp au +237 699 45 88 12.
L'équipe de Mboa Luxury Collection vous souhaite un excellent séjour au Cameroun !
Portail officiel : https://mboacollection.cm`;
}

export function getWhatsAppConfirmationLink(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  const phoneInt = formatCameroonPhoneForWhatsApp(booking.guestInfo.phone);
  const text = generateBookingConfirmationText(booking, lang);
  return `https://wa.me/${phoneInt}?text=${encodeURIComponent(text)}`;
}

export function getEmailConfirmationSubject(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  if (lang === 'en') {
    return `Booking Confirmation Voucher #${booking.id} — Mboa Luxury Collection`;
  }
  return `Confirmation de Séjour & Bon de Réservation #${booking.id} — Mboa Luxury Collection`;
}

export function getEmailConfirmationBody(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  return generateBookingConfirmationText(booking, lang);
}

export function getGmailWebLink(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  const email = booking.guestInfo.email;
  const subject = getEmailConfirmationSubject(booking, lang);
  const body = getEmailConfirmationBody(booking, lang);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getMailtoLink(booking: Booking, lang: 'fr' | 'en' = 'fr'): string {
  const email = booking.guestInfo.email;
  const subject = getEmailConfirmationSubject(booking, lang);
  const body = getEmailConfirmationBody(booking, lang);
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
