import { Booking } from '../types';

export interface AvailabilityResult {
  isAvailable: boolean;
  conflictingBooking?: Booking;
  conflictRange?: { start: string; end: string };
  nextAvailableDate?: string;
}

/**
 * Checks if two date ranges overlap.
 * Standard hotel turnover rule: checkout at 12:00, checkin at 14:00 on the same date do NOT conflict.
 * Range A [startA, endA) overlaps with Range B [startB, endB) if and only if:
 * startA < endB && startB < endA
 */
export const doDatesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean => {
  if (!startA || !endA || !startB || !endB) return false;
  return startA < endB && startB < endA;
};

/**
 * Checks if a room is available for the specified stay.
 */
export const checkRoomAvailability = (
  roomId: string,
  checkIn: string,
  checkOut: string,
  bookings: Booking[]
): AvailabilityResult => {
  if (!checkIn || !checkOut) {
    return { isAvailable: true };
  }

  if (checkIn >= checkOut) {
    return { isAvailable: false };
  }

  // Find any active booking for this specific room that overlaps
  const conflict = bookings.find((b) => {
    if (b.roomId !== roomId) return false;
    return doDatesOverlap(checkIn, checkOut, b.checkIn, b.checkOut);
  });

  if (conflict) {
    return {
      isAvailable: false,
      conflictingBooking: conflict,
      conflictRange: { start: conflict.checkIn, end: conflict.checkOut },
      nextAvailableDate: conflict.checkOut,
    };
  }

  return { isAvailable: true };
};

/**
 * Returns all active booked date ranges for a given room.
 */
export const getRoomBookedRanges = (
  roomId: string,
  bookings: Booking[]
): { start: string; end: string; bookingId: string; clientName: string }[] => {
  return bookings
    .filter((b) => b.roomId === roomId)
    .map((b) => ({
      start: b.checkIn,
      end: b.checkOut,
      bookingId: b.id,
      clientName: `${b.guestInfo.civility} ${b.guestInfo.lastName}`,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
};
