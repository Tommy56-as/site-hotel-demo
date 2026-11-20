import { Currency } from '../types';

export const EUR_TO_XAF_RATE = 655.957; // Official fixed peg for CFA Franc BEAC (CEMAC)
export const USD_TO_XAF_RATE = 610.0;   // Market reference exchange rate

export function convertFromXAF(amountXAF: number, targetCurrency: Currency): number {
  if (targetCurrency === 'XAF') return amountXAF;
  if (targetCurrency === 'EUR') return Math.round(amountXAF / EUR_TO_XAF_RATE);
  if (targetCurrency === 'USD') return Math.round(amountXAF / USD_TO_XAF_RATE);
  return amountXAF;
}

export function formatPrice(amountXAF: number, currency: Currency): string {
  if (currency === 'XAF') {
    // Standard Cameroonian French formatting: 180 000 FCFA
    const formatted = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
    }).format(amountXAF);
    return `${formatted} FCFA`;
  }

  if (currency === 'EUR') {
    const inEur = convertFromXAF(amountXAF, 'EUR');
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(inEur);
  }

  if (currency === 'USD') {
    const inUsd = convertFromXAF(amountXAF, 'USD');
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(inUsd);
  }

  return `${amountXAF} FCFA`;
}

// Cameroon standard tax calculations:
// TVA (Taxe sur la Valeur Ajoutée): 19.25% (17.5% principal + 10% CAC)
export const TVA_RATE = 0.1925;
// Taxe de séjour hôtelière au Cameroun (for luxury category: typically 5 000 FCFA per room night)
export const TAXE_SEJOUR_PER_NIGHT_XAF = 5000;

export function calculateBookingTotals(pricePerNightXAF: number, nights: number) {
  const baseSubtotal = pricePerNightXAF * nights;
  const tva = Math.round(baseSubtotal * TVA_RATE);
  const taxeSejour = TAXE_SEJOUR_PER_NIGHT_XAF * nights;
  const grandTotal = baseSubtotal + tva + taxeSejour;

  return {
    baseSubtotal,
    tva,
    taxeSejour,
    grandTotal,
  };
}
