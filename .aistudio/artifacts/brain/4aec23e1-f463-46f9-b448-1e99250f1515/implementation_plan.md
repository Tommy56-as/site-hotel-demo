# Mboa Luxury Collection — Cameroonian Hospitality & Reservation Platform

A bespoke, production-ready luxury hotel booking and reservation web application celebrating Cameroon's premier destinations (Kribi oceanfront, Yaoundé diplomatic heights, Douala business waterfront, and Limbe volcanic coast), crafted with a high-end editorial aesthetic, authentic French/English bilingualism, multi-currency support (FCFA / EUR / USD), and realistic regional Mobile Money (MTN MoMo & Orange Money) payment simulations.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key product decisions have been confirmed through Phase 1 user alignment:

- **Confirmed Decision 1 (Scope & Brand)**: Multi-destination luxury hospitality collection across Cameroon: *Kribi Ocean Sanctuary* (Lobé & Batanga), *Douala Wouri Waterfront Residence* (Bonanjo), *Yaoundé Diplomatic Hill Suites* (Bastos/Mont Fébé), and *Limbe Black Sands Eco-Resort* (Down Beach & Botanic Garden).
- **Confirmed Decision 2 (Language & Localization)**: French default with instant, fluid English toggle (`FR` / `EN`). All room descriptions, amenities, booking steps, invoices, and payment simulator prompts are fully bilingual.
- **Confirmed Decision 3 (Regional Payment Flow)**: Authentic USSD mobile push prompt simulation with interactive PIN verification modal mimicking regional Cameroon telecom networks (MTN Cameroon Mobile Money and Orange Cameroun Money), complemented by Visa and Mastercard processing.
- **Confirmed Decision 4 (Anti-Slop Editorial Design)**: Zero generic AI cliches. No neon glows, no bento-grids, no pill-shaped tags, and strictly zero emojis. Warm ivory/cream canvas (`#FAF8F5`), deep evergreen (`#163024`), warm bronze terracotta (`#8C4A32`), and sharp charcoal (`#1A1A1A`) paired with editorial typography (Playfair Display and Plus Jakarta Sans).

---

## 1. Overview & Core Concept

- **What It Does**: Allows travelers, business executives, and diaspora guests to discover curated luxury suites and villas across Cameroon, check availability with interactive date and guest selection, explore authentic amenities (high-speed optic fiber, private plunge pool, ocean view, airport VIP shuttle), complete a frictionless 3-step checkout with realistic MTN MoMo / Orange Money / Card payments, and download or print an official bilingual hotel invoice with tax breakdown (TVA 19.25% & local tourism tax).
- **Target Audience / Persona**: International tourists, diaspora visiting Cameroon, regional business travelers, and luxury leisure seekers looking for reliable, culturally grounded Cameroonian hospitality.
- **Key Value**: Delivers the tactile feel of an elite Conde Nast / Architectural Digest hospitality publication while providing concrete Cameroonian transaction reality (FCFA currency, local taxes, +237 phone validation, MoMo/Orange Money push authentication).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Destination Filtering**:
   - Header with clean Top Bar Contract: Brand mark on the left, single-line links (`Destinations`, `Suites & Villas`, `Expériences`, `Mes Réservations`), language toggle (`FR | EN`), currency switcher (`FCFA | EUR | USD`), and a primary "Réserver" button.
   - Hero showcase featuring an asymmetric editorial composition, curated photography, and an interactive availability search bar (Destination, Check-in / Check-out, Guests, Room Tier).
2. **Room Catalog & Interactive Details**:
   - Filterable room collection by destination (Kribi, Douala, Yaoundé, Limbe), price range, capacity, and amenities (Ocean View, Balcony, Private Pool, Meeting Suite).
   - Clean room cards leading directly with architectural photography, unboxed metadata (`Kribi · 2 Invités · Vue Océan`), price per night in tabular figures, and action buttons ("Voir les détails" and "Réserver").
   - Detailed Room Modal with full image gallery, room floor plan notes, included services (petit-déjeuner buffet, navette aéroport, concierge 24/7), and quick-book CTA.
3. **Step-by-Step Reservation Funnel**:
   - **Step 1 — Voyageurs & Préférences**: Guest personal info (Nom, Prénom, Email, Téléphone format +237 avec validation 6xx xx xx xx), arrival time, dietary or transfer preferences.
   - **Step 2 — Paiement & Simulation Mobile Money**:
     - Regional wallet selection (MTN MoMo, Orange Money, Carte Bancaire).
     - For MoMo & Orange Money: input phone number, triggers realistic USSD push simulation overlay ("Demande de retrait reçue sur votre téléphone, veuillez saisir votre code PIN secret"), interactive PIN pad modal, processing spinner, and confirmed transaction ID.
     - For Card: clean payment form (Card number, expiry, CVV, Cardholder name) with 3D Secure simulation.
   - **Step 3 — Reçu Officiel & Facture Téléchargeable**:
     - Dynamic confirmation with unique booking locator (e.g., `MLC-2026-KRI-8491`), complete breakdown of room charges, TVA (19.25%), taxe de séjour, and total paid.
     - Printable & downloadable simulated PDF invoice formatted according to Cameroonian hospitality standards.
4. **Guest Bookings Drawer ("Mes Réservations")**:
   - Persistent client-side reservation manager storing past and active bookings in `localStorage`, allowing users to look up their reservations, view vouchers, or cancel if needed.

### Visual Identity & Theme

- **Palette**:
  - *Canvas (60%)*: Warm Off-White / Natural Ivory (`#FAF8F5`) and Crisp Paper (`#FFFFFF`).
  - *Structural Surfaces (30%)*: Deep Forest Evergreen (`#163024`), Warm Sand Muted Gray (`#F3EFE6`), Subtle Hairline Borders (`rgba(22, 48, 36, 0.1)`).
  - *Accent Budget (10%)*: Warm Terracotta Earth (`#8C4A32`), Muted Gold/Brass (`#C5A059`).
  - *Typography*: Sharp Charcoal (`#1A1A1A`) and Muted Slate (`#606462`).
- **Typography Hierarchy**:
  - *Headings & Display*: Google Font `Playfair Display` or `Cormorant Garamond` (classic serif, optical balance, `text-wrap: balance`).
  - *Body Prose & Form Labels*: `Plus Jakarta Sans` (refined geometric humanist sans-serif).
  - *Prices & Booking Reference*: Tabular figures (`tabular-nums`, crisp, vertical column alignment).
- **Component Styling & Layout**:
  - Strict zero-pill discipline: metadata rendered as unboxed inline text with `·` separators.
  - Refined rectangular buttons with subtle `rounded-sm` or `rounded-md` radius (`2px`–`6px`), never pill/capsule shapes.
  - Zero decorative emojis, zero neon gradients, zero generic bento boxes.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side State Management with LocalStorage Persistence**:
  - *Approach*: Use React state combined with robust `localStorage` synchronization for bookings, currency preferences, and language selection.
  - *Why*: Instant reactivity, offline safety, no external server dependency failures during review, and zero friction when creating and reviewing multiple bookings.
- **Decision 2: Realistic USSD & PIN Mobile Money Simulation**:
  - *Approach*: Rather than a dummy checkout button, build an authentic simulated USSD dialog (the classic black-and-white pop-up that appears on Android/iOS when MTN *126# or Orange #150# push notifications arrive in Cameroon) with numeric PIN input and countdown timer.
  - *Why*: Perfectly captures the actual local payment culture of Cameroon while ensuring users can test both successful and failure scenarios.
- **Decision 3: Complete Bilingual Engine with Reactive Dictionary**:
  - *Approach*: Built-in i18n dictionary object covering all UI strings, room descriptions, amenities, Cameroonian cultural notes, and invoice labels.
  - *Why*: Meets the strict requirement for French content as primary while supporting English for international guests, without requiring external heavy translation libraries.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root (App.tsx)                              │
│   ├── I18nContext (fr / en)                                            │
│   ├── CurrencyContext (XAF / EUR / USD with real conversion rates)     │
│   └── BookingsState (localStorage sync)                                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐
│  Top Navigation  │       │  Hero & Search   │        │ Booking Drawer   │
│  - Brand Wordmark│       │  - City / Dates  │        │ - Past Bookings  │
│  - Nav Links     │       │  - Guests Stepper│        │ - View Voucher   │
│  - FR/EN & XAF   │       │  - Instant Filter│        │ - Cancellation   │
└──────────────────┘       └──────────────────┘        └──────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────────┐         ┌───────────────────────────────┐
│ Room Catalog & Destination Selector │         │ Checkout Modal & Funnel       │
│ - Kribi, Douala, Yaoundé, Limbe     │         │ - Step 1: Guest Information   │
│ - Price, Capacity, View Filters     │ ──────> │ - Step 2: Payment Simulator   │
│ - Detailed Room Inspection Modal    │         │   (MTN MoMo / Orange / Card)  │
│ - High-Fidelity Architectural Visual│         │ - Step 3: Official Invoice    │
└─────────────────────────────────────┘         └───────────────────────────────┘
```

### Data Model Entities

- `Room`:
  - `id`: string (e.g. `kribi-suite-ocean`, `douala-wouri-penthouse`)
  - `name`: Record<Lang, string>
  - `destination`: `'kribi' | 'douala' | 'yaounde' | 'limbe'`
  - `destinationLabel`: Record<Lang, string>
  - `priceXAF`: number
  - `capacity`: number
  - `bedding`: Record<Lang, string>
  - `sizeM2`: number
  - `view`: Record<Lang, string>
  - `amenities`: Array<AmenityKey>
  - `description`: Record<Lang, string>
  - `images`: Array<string>
  - `rating`: number, `reviewsCount`: number
- `Booking`:
  - `id`: string (reference code e.g. `MLC-2026-KRI-7193`)
  - `roomId`: string
  - `checkIn`: string
  - `checkOut`: string
  - `nights`: number
  - `guests`: number
  - `guestInfo`: { firstName, lastName, email, phone, specialRequests }
  - `payment`: { method: 'momo' | 'orange' | 'card', transactionId, status, timestamp, currency, totalAmount, tva, taxeSejour }
  - `createdAt`: string

### Verification Plan

1. **Compilation Check**: Run `compile_applet` to ensure zero TypeScript errors or missing imports.
2. **Localization & Currency Testing**: Verify instant switching between French and English across all screens; verify XAF (FCFA), EUR, and USD price calculations and formatting.
3. **Interactive Search & Filter Testing**: Test destination tabs, check-in/out date selection, guest counter stepper, and amenities checkboxes.
4. **Booking Funnel Testing**:
   - Complete Step 1 with valid Cameroonian phone number (+237 6xx xx xx xx).
   - Test MTN MoMo USSD push popup with PIN simulation.
   - Test Orange Money USSD prompt.
   - Test Visa/Mastercard simulation.
   - Verify Step 3 invoice calculation (Subtotal + TVA 19.25% + Taxe de séjour = Total).
   - Test simulated PDF invoice download / print view.
5. **Anti-Slop Audit**: Verify that zero emojis, zero neon glows, zero pills, and zero generic marketing fluff exist in the application.
