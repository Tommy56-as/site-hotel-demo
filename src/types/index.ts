export type Language = 'fr' | 'en';
export type Currency = 'XAF' | 'EUR' | 'USD';

export type DestinationId = 'all' | 'kribi' | 'douala' | 'yaounde' | 'limbe';

export interface Room {
  id: string;
  name: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  destination: 'kribi' | 'douala' | 'yaounde' | 'limbe';
  destinationLabel: { fr: string; en: string };
  city: string;
  priceXAF: number;
  capacity: number;
  bedding: { fr: string; en: string };
  sizeM2: number;
  view: { fr: string; en: string };
  floor: { fr: string; en: string };
  amenities: string[];
  features: { fr: string[]; en: string[] };
  description: { fr: string; en: string };
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
  isCustom?: boolean;
}

export interface GuestInfo {
  civility: 'M.' | 'Mme' | 'Dr';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  arrivalTime: string;
  specialRequests: string;
  airportShuttle: boolean;
  breakfastIncluded: boolean;
}

export type PaymentMethod = 'momo' | 'orange' | 'card';

export interface PaymentDetails {
  method: PaymentMethod;
  momoNumber?: string;
  orangeNumber?: string;
  cardLast4?: string;
  transactionId: string;
  paidAt: string;
  status: 'confirmed' | 'pending' | 'failed';
  currencyUsed: Currency;
  baseAmountXAF: number;
  tvaXAF: number;
  taxeSejourXAF: number;
  totalXAF: number;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  guestInfo: GuestInfo;
  payment: PaymentDetails;
  createdAt: string;
}

export interface FilterState {
  destination: DestinationId;
  checkIn: string;
  checkOut: string;
  guests: number;
  maxPriceXAF?: number;
  amenities: string[];
}

export type AdminRole = 'DIRECTEUR_GENERAL' | 'CHEF_RECEPTION' | 'RESPONSABLE_RESERVATIONS';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

