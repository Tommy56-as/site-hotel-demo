import jsPDF from 'jspdf';
import { Booking, Currency, Language } from '../types';
import { formatPrice } from './currency';

/**
 * Generates and downloads a pristine, vector-sharp PDF invoice for a confirmed booking
 * without relying on DOM canvas rasterization or html2canvas CSS parsing.
 */
export const generateBookingPdf = (
  booking: Booking,
  currency: Currency,
  language: Language
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  // Editorial Palette
  const forestGreen = [22, 48, 36]; // #163024
  const terracotta = [140, 74, 50]; // #8C4A32
  const gold = [197, 160, 89]; // #C5A059
  const darkCharcoal = [26, 26, 26]; // #1A1A1A
  const mutedGray = [115, 115, 115];
  const warmIvory = [250, 248, 245]; // #FAF8F5
  const borderLine = [218, 212, 202];

  // 1. Top Decorative Bands
  doc.setFillColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 5, pageWidth, 1.2, 'F');

  let currentY = 17;

  // 2. Brand Identity & Header
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('MBOA LUXURY COLLECTION', margin, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(terracotta[0], terracotta[1], terracotta[2]);
  doc.text('CAMEROUN · SANCTUAIRES D’EXCEPTION & HÔTELLERIE D’ÉLITE', margin, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('B.P. 1248 Douala-Bonanjo / Bastos Yaoundé · République du Cameroun', margin, currentY + 9.5);
  doc.text('N.U.I. : M051812739481A · R.C.C.M. : RC/DLA/2018/B/412', margin, currentY + 13.5);
  doc.text('Agrément Ministériel N° 00412/MINTOUL/SG/DET/2021', margin, currentY + 17.5);

  // Right Header: Receipt Label & Reference
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(terracotta[0], terracotta[1], terracotta[2]);
  doc.text("FACTURE D’HÉBERGEMENT & REÇU OFFICIEL", rightX, currentY, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text(`N° ${booking.id}`, rightX, currentY + 6, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  const dateStr = new Date(booking.createdAt).toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
  doc.text(`Date d’émission : ${dateStr}`, rightX, currentY + 11, { align: 'right' });
  doc.text('Régularisation fiscale CEMAC', rightX, currentY + 15, { align: 'right' });

  // Divider Line
  currentY += 23;
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, rightX, currentY);

  // 3. Client & Stay Information Cards (Two Columns)
  currentY += 6;
  const colWidth = (contentWidth - 6) / 2;
  const boxHeight = 44;

  // Left Card: Client Titulaire
  doc.setFillColor(warmIvory[0], warmIvory[1], warmIvory[2]);
  doc.roundedRect(margin, currentY, colWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('CLIENT TITULAIRE DU SÉJOUR', margin + 4, currentY + 7);
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.line(margin + 4, currentY + 9, margin + colWidth - 4, currentY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text(
    `${booking.guestInfo.civility} ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
    margin + 4,
    currentY + 16
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text(`Email : ${booking.guestInfo.email}`, margin + 4, currentY + 22);
  doc.text(`Téléphone : +237 ${booking.guestInfo.phone}`, margin + 4, currentY + 28);
  doc.text(`Heure estimée d’arrivée : ${booking.guestInfo.arrivalTime}`, margin + 4, currentY + 34);
  if (booking.guestInfo.airportShuttle) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(terracotta[0], terracotta[1], terracotta[2]);
    doc.text('Prestation VIP : Navette aéroport privée confirmée', margin + 4, currentY + 39.5);
  }

  // Right Card: Sanctuaire & Calendrier
  const rightColX = margin + colWidth + 6;
  doc.setFillColor(warmIvory[0], warmIvory[1], warmIvory[2]);
  doc.roundedRect(rightColX, currentY, colWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('SANCTUAIRE & DÉTAILS DU SÉJOUR', rightColX + 4, currentY + 7);
  doc.line(rightColX + 4, currentY + 9, rightColX + colWidth - 4, currentY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text(booking.roomName, rightColX + 4, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(terracotta[0], terracotta[1], terracotta[2]);
  doc.text(booking.destination, rightColX + 4, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text(`Séjour : Du ${booking.checkIn} au ${booking.checkOut}`, rightColX + 4, currentY + 28);
  doc.text(
    `Durée : ${booking.nights} nuit(s) · Capacité : ${booking.guestsCount} voyageur(s)`,
    rightColX + 4,
    currentY + 34
  );
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('Petit-déjeuner du terroir & Conciergerie VIP inclus', rightColX + 4, currentY + 39.5);

  // 4. Financial Table
  currentY += boxHeight + 8;

  // Table Header
  const tableHeaderY = currentY;
  doc.setFillColor(warmIvory[0], warmIvory[1], warmIvory[2]);
  doc.rect(margin, tableHeaderY, contentWidth, 7.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('Désignation de la prestation', margin + 4, tableHeaderY + 5.2);
  doc.text('Quantité', margin + 98, tableHeaderY + 5.2, { align: 'center' });
  doc.text('Tarif unitaire', margin + 138, tableHeaderY + 5.2, { align: 'right' });
  doc.text('Total Net HT', rightX - 4, tableHeaderY + 5.2, { align: 'right' });

  // Table Row 1: Room
  currentY += 7.5;
  const rowHeight = 15;
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.rect(margin, currentY, contentWidth, rowHeight, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text(booking.roomName, margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(
    'Hébergement en suite de prestige avec petit-déjeuner du terroir',
    margin + 4,
    currentY + 10.5
  );

  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text(`${booking.nights} nuit(s)`, margin + 98, currentY + 7.5, { align: 'center' });
  doc.text(
    formatPrice(booking.payment.baseAmountXAF / booking.nights, currency),
    margin + 138,
    currentY + 7.5,
    { align: 'right' }
  );

  doc.setFont('courier', 'bold');
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text(formatPrice(booking.payment.baseAmountXAF, currency), rightX - 4, currentY + 7.5, {
    align: 'right',
  });

  currentY += rowHeight;

  // Table Row 2: Shuttle (if selected)
  if (booking.guestInfo.airportShuttle) {
    const shuttleRowHeight = 11;
    doc.rect(margin, currentY, contentWidth, shuttleRowHeight, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
    doc.text('Navette aéroport VIP (Accueil & Berline climatisée)', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Transfert privé aller-retour aéroport international', margin + 4, currentY + 8.5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
    doc.text('1', margin + 98, currentY + 6.5, { align: 'center' });
    doc.text('Inclus (Offert)', margin + 138, currentY + 6.5, { align: 'right' });
    doc.text('0 FCFA', rightX - 4, currentY + 6.5, { align: 'right' });

    currentY += shuttleRowHeight;
  }

  // 5. Payment Details & Totals Section
  currentY += 8;
  const payCardWidth = 98;
  const payCardHeight = 44;

  // Left Box: Payment Proof
  doc.setFillColor(warmIvory[0], warmIvory[1], warmIvory[2]);
  doc.roundedRect(margin, currentY, payCardWidth, payCardHeight, 1.5, 1.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('ACQUITTEMENT & TRANSACTION', margin + 4, currentY + 7);
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.line(margin + 4, currentY + 9, margin + payCardWidth - 4, currentY + 9);

  const paymentMethodLabel = {
    momo: 'MTN Mobile Money (*126#)',
    orange: 'Orange Money (#150#)',
    card: 'Carte Bancaire (Visa / Mastercard)',
  }[booking.payment.method] || booking.payment.method;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text('Mode d’encaissement :', margin + 4, currentY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(paymentMethodLabel, margin + 4, currentY + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Identifiant de transaction :', margin + 4, currentY + 26);
  doc.setFont('courier', 'bold');
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text(booking.payment.transactionId, margin + 4, currentY + 31);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(16, 120, 60);
  doc.text('STATUT : RÈGLEMENT INTÉGRAL ACQUITTÉ', margin + 4, currentY + 38);

  // Right Box: Totals Breakdown
  const totalBoxX = margin + payCardWidth + 8;
  let totY = currentY + 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkCharcoal[0], darkCharcoal[1], darkCharcoal[2]);
  doc.text('Total Hébergement HT :', totalBoxX, totY);
  doc.setFont('courier', 'normal');
  doc.text(formatPrice(booking.payment.baseAmountXAF, currency), rightX, totY, { align: 'right' });

  totY += 6.5;
  doc.setFont('helvetica', 'normal');
  doc.text('TVA Cameroun (19,25%) :', totalBoxX, totY);
  doc.setFont('courier', 'normal');
  doc.text(formatPrice(booking.payment.tvaXAF, currency), rightX, totY, { align: 'right' });

  totY += 6.5;
  doc.setFont('helvetica', 'normal');
  doc.text('Taxe de séjour touristique :', totalBoxX, totY);
  doc.setFont('courier', 'normal');
  doc.text(formatPrice(booking.payment.taxeSejourXAF, currency), rightX, totY, { align: 'right' });

  totY += 3.5;
  doc.setDrawColor(borderLine[0], borderLine[1], borderLine[2]);
  doc.line(totalBoxX, totY, rightX, totY);

  totY += 7.5;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('MONTANT TOTAL TTC :', totalBoxX, totY);

  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text(formatPrice(booking.payment.totalXAF, currency), rightX, totY, { align: 'right' });

  // 6. Official Stamp & Legal Notes
  currentY += payCardHeight + 9;

  // Fiscal Stamp Box
  doc.setDrawColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.setLineWidth(0.8);
  doc.rect(rightX - 58, currentY, 58, 17, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.text('RÉPUBLIQUE DU CAMEROUN', rightX - 29, currentY + 4.5, { align: 'center' });
  doc.text('ACQUITTÉ · DGI CEMAC', rightX - 29, currentY + 8.5, { align: 'center' });
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(terracotta[0], terracotta[1], terracotta[2]);
  doc.text('CERTIFIÉ CONFORME', rightX - 29, currentY + 13.5, { align: 'center' });

  // Left Legal Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(
    'Facture certifiée conforme émise par Mboa Luxury Collection S.A. sous le régime du réel d’imposition (DGI Cameroun).',
    margin,
    currentY + 4.5
  );
  doc.text(
    'Conformément aux normes OHADA et CEMAC, ce document électronique fait foi de preuve intégrale de paiement.',
    margin,
    currentY + 8.5
  );
  doc.text(
    'En cas de demande d’assistance ou de protocole VIP, contactez la conciergerie : reservations@mboacollection.cm',
    margin,
    currentY + 12.5
  );

  // 7. Bottom Brand Line
  doc.setFillColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

  // Trigger Save / Download
  doc.save(`Facture-Mboa-${booking.id}.pdf`);
};
