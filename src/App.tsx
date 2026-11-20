/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Room, Language, Currency, DestinationId, Booking, AdminUser } from './types';
import { ROOMS_DATA } from './data/rooms';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DestinationsPreview } from './components/DestinationsPreview';
import { RoomCatalog } from './components/RoomCatalog';
import { ExperiencesSection } from './components/ExperiencesSection';
import { Footer } from './components/Footer';
import { getStoredAdminSession, saveAdminSession } from './utils/auth';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const RoomDetailModal = lazy(() =>
  import('./components/RoomDetailModal').then((module) => ({ default: module.RoomDetailModal }))
);
const BookingModal = lazy(() =>
  import('./components/BookingModal').then((module) => ({ default: module.BookingModal }))
);
const AdminPortal = lazy(() =>
  import('./components/AdminPortal').then((module) => ({ default: module.AdminPortal }))
);
const AdminLoginModal = lazy(() =>
  import('./components/AdminLoginModal').then((module) => ({ default: module.AdminLoginModal }))
);

const STORAGE_KEY_BOOKINGS = 'mboa_luxury_bookings_v1';
const STORAGE_KEY_CUSTOM_ROOMS = 'mboa_custom_rooms_v1';
const STORAGE_KEY_LANG = 'mboa_luxury_lang';
const STORAGE_KEY_CURR = 'mboa_luxury_currency';

export default function App() {
  // Localization & Preferences
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'fr'; // French default
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURR);
    return saved === 'EUR' || saved === 'USD' ? saved : 'XAF'; // XAF (FCFA) default
  });

  // Rooms State (Core + Custom added by Admin)
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ROOMS);
      const customRooms = saved ? JSON.parse(saved) : [];
      return [...customRooms, ...ROOMS_DATA];
    } catch {
      return ROOMS_DATA;
    }
  });

  // Filter & Search states
  const [selectedDestination, setSelectedDestination] = useState<DestinationId>('all');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState<string>(todayStr);
  const [checkOut, setCheckOut] = useState<string>(tomorrowStr);
  const [guests, setGuests] = useState<number>(2);

  // Modals & Admin Drawer
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);

  // Authenticated Admin User
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => getStoredAdminSession());

  // Bookings list in localStorage (managed in Admin)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Smooth Scroll Progress
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 450);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURR, currency);
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch {
      // storage unavailable
    }
  }, [bookings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(
      language === 'fr'
        ? `Réservation #${newBooking.id} confirmée avec succès. Reçu officiel généré.`
        : `Booking #${newBooking.id} successfully confirmed. Official voucher generated.`
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast(
      language === 'fr'
        ? 'Dossier de réservation annulé avec succès par la Direction.'
        : 'Reservation record successfully cancelled by Management.'
    );
  };

  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ROOMS);
      const customRooms = saved ? JSON.parse(saved) : [];
      localStorage.setItem(STORAGE_KEY_CUSTOM_ROOMS, JSON.stringify([newRoom, ...customRooms]));
    } catch {
      // storage unavailable
    }
    showToast(
      language === 'fr'
        ? `Nouvelle demeure "${newRoom.name.fr}" enregistrée pour ${newRoom.city}.`
        : `New residence "${newRoom.name.en}" listed for ${newRoom.city}.`
    );
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_ROOMS);
      const customRooms: Room[] = saved ? JSON.parse(saved) : [];
      const updated = customRooms.filter((r) => r.id !== roomId);
      localStorage.setItem(STORAGE_KEY_CUSTOM_ROOMS, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
    showToast(
      language === 'fr'
        ? 'La demeure a été retirée du catalogue avec succès.'
        : 'The residence has been removed from the catalog.'
    );
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDestinationFromPreview = (dest: DestinationId) => {
    setSelectedDestination(dest);
    handleNavigateSection('catalog');
  };

  const handleDirectBook = () => {
    const targetRoom = rooms[0] || ROOMS_DATA[0];
    setBookingRoom(targetRoom);
  };

  const handleOpenAdmin = () => {
    if (currentAdminUser) {
      setAdminOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentAdminUser(user);
    setAdminLoginOpen(false);
    setAdminOpen(true);
    showToast(`Bienvenue, ${user.name} (${user.role.replace('_', ' ')}).`);
  };

  const handleLogout = () => {
    saveAdminSession(null);
    setCurrentAdminUser(null);
    setAdminOpen(false);
    showToast('Déconnexion effectuée avec succès.');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      {/* Editorial Scroll Progress Hairline at the very top */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#8C4A32] origin-left z-50 pointer-events-none"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#163024] text-white px-5 py-3 rounded-xs shadow-xl border border-white/20 text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 w-10 h-10 bg-[#163024] hover:bg-[#0E2018] text-white rounded-xs shadow-md border border-white/20 flex items-center justify-center cursor-pointer transition-colors"
            title="Remonter en haut de page"
            aria-label="Remonter en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top Bar Navigation */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenBookings={handleOpenAdmin}
        bookingsCount={bookings.length}
        onDirectBook={handleDirectBook}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* Editorial Hero & Interactive Search with Entry Motion */}
        <Hero
          language={language}
          selectedDestination={selectedDestination}
          onDestinationChange={setSelectedDestination}
          checkIn={checkIn}
          onCheckInChange={setCheckIn}
          checkOut={checkOut}
          onCheckOutChange={setCheckOut}
          guests={guests}
          onGuestsChange={setGuests}
          onSearch={() => handleNavigateSection('catalog')}
        />

        {/* Cameroon Destinations Preview with Scroll Motion */}
        <DestinationsPreview
          language={language}
          onSelectDestination={handleSelectDestinationFromPreview}
        />

        {/* Room Catalog & Filtering with Staggered Scroll Motion & Live Availability */}
        <RoomCatalog
          rooms={rooms}
          language={language}
          currency={currency}
          selectedDestination={selectedDestination}
          onDestinationChange={setSelectedDestination}
          onOpenRoomDetails={(room) => setDetailRoom(room)}
          onBookRoom={(room) => setBookingRoom(room)}
          bookings={bookings}
          checkIn={checkIn}
          checkOut={checkOut}
        />

        {/* Hospitality & Cultural Experiences with Scroll Motion */}
        <ExperiencesSection language={language} />
      </main>

      {/* Editorial Footer */}
      <Footer
        language={language}
        onNavigateSection={handleNavigateSection}
      />

      {/* Room Detail Modal with Multi-Photo Gallery & Real-Time Availability */}
      {detailRoom && (
        <Suspense fallback={null}>
          <RoomDetailModal
            room={detailRoom}
            isOpen
            onClose={() => setDetailRoom(null)}
            language={language}
            currency={currency}
            bookings={bookings}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            onBookRoom={(room, inDate, outDate) => {
              if (inDate) setCheckIn(inDate);
              if (outDate) setCheckOut(outDate);
              setDetailRoom(null);
              setBookingRoom(room);
            }}
          />
        </Suspense>
      )}

      {/* Step-by-Step Checkout & Payment Simulation Funnel with Overlap Prevention */}
      {bookingRoom && (
        <Suspense fallback={null}>
          <BookingModal
            room={bookingRoom}
            isOpen
            onClose={() => setBookingRoom(null)}
            language={language}
            currency={currency}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests}
            existingBookings={bookings}
            onBookingConfirmed={handleBookingConfirmed}
          />
        </Suspense>
      )}

      {/* Admin Login Modal (Triggered when unauthenticated) */}
      {adminLoginOpen && (
        <Suspense fallback={null}>
          <AdminLoginModal
            isOpen
            onClose={() => setAdminLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            language={language}
          />
        </Suspense>
      )}

      {/* Hotel Operations & Executive Admin Portal (Requires Login) */}
      {currentAdminUser && adminOpen && (
        <Suspense fallback={null}>
          <AdminPortal
            isOpen
            onClose={() => setAdminOpen(false)}
            currentUser={currentAdminUser}
            onLogout={handleLogout}
            bookings={bookings}
            rooms={rooms}
            language={language}
            currency={currency}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onCancelBooking={handleCancelBooking}
          />
        </Suspense>
      )}
    </div>
  );
}
