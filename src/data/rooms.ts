import { Room } from '../types';

export const ROOMS_DATA: Room[] = [
  {
    id: 'kribi-villa-batanga',
    name: {
      fr: 'Villa Grand Batanga Oceanfront',
      en: 'Grand Batanga Oceanfront Villa',
    },
    subtitle: {
      fr: 'Terrasse privée en iroko, bassin d’eau fraîche et panorama sur le golfe de Guinée',
      en: 'Private iroko timber terrace, plunge pool and panoramic Gulf of Guinea view',
    },
    destination: 'kribi',
    destinationLabel: {
      fr: 'Kribi · Littoral Sud',
      en: 'Kribi · South Coast',
    },
    city: 'Kribi',
    priceXAF: 240000,
    capacity: 2,
    bedding: {
      fr: '1 Lit King Size Impérial en bois massif',
      en: '1 Imperial King Size Bed handcrafted hardwood',
    },
    sizeM2: 78,
    view: {
      fr: 'Océan Atlantique & Canopée de Cocotiers',
      en: 'Atlantic Ocean & Coconut Palm Canopy',
    },
    floor: {
      fr: 'Rez-de-jardin avec accès direct à la plage',
      en: 'Garden level with direct beach access',
    },
    amenities: ['wifi', 'pool', 'oceanView', 'ac', 'breakfast', 'shuttle', 'butler', 'balcony', 'spa'],
    features: {
      fr: [
        'Accès privé et direct à la plage de sable doré',
        'Bassin de détente taillé en pierre locale',
        'Douche tropicale extérieure sous les étoiles',
        'Literie en lin brut d’Égypte et matelas orthopédique',
        'Fibre optique 200 Mbps et bureau de travail discret',
      ],
      en: [
        'Direct and private access to the golden beach',
        'Plunge pool carved from local volcanic stone',
        'Open-air tropical outdoor rain shower',
        'Raw Egyptian organic linen bedding and orthopedic mattress',
        'High-speed dedicated 200 Mbps fiber and executive desk',
      ],
    },
    description: {
      fr: 'Nichée à la lisière des vagues atlantiques et des cocotiers centenaires, la Villa Grand Batanga incarne le repos balnéaire absolu. Construite en matériaux nobles du Cameroun avec ses baies vitrées coulissantes ouvrant sur une vaste terrasse en bois d’iroko, elle offre une intimité rare au rythme du ressac de Kribi.',
      en: 'Nestled between the gentle Atlantic surf and century-old palms, the Grand Batanga Villa represents barefoot luxury at its purest. Built using noble Cameroonian timber with sliding floor-to-ceiling glass doors opening onto an iroko deck, it provides serene privacy to the hypnotic rhythm of Kribi waves.',
    },
    image: '/src/assets/images/room_kribi_ocean_1793714394549.jpg',
    gallery: [
      '/src/assets/images/room_kribi_ocean_1793714394549.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
      '/src/assets/images/luxury_suite_lounge_1794045154724.jpg',
      '/src/assets/images/hero_cameroon_luxury_1793714393134.jpg',
    ],
    rating: 4.95,
    reviewsCount: 38,
  },
  {
    id: 'douala-penthouse-wouri',
    name: {
      fr: 'Penthouse Wouri Executive',
      en: 'Wouri Executive River Penthouse',
    },
    subtitle: {
      fr: 'Vue plongeante sur l’estuaire, salon de réception d’affaires et acoustique feutrée',
      en: 'Panoramic river estuary views, executive meeting salon and acoustic serenity',
    },
    destination: 'douala',
    destinationLabel: {
      fr: 'Douala · Quartier Bonanjo',
      en: 'Douala · Bonanjo Financial District',
    },
    city: 'Douala',
    priceXAF: 220000,
    capacity: 2,
    bedding: {
      fr: '1 Lit King Size Haute Literie Française',
      en: '1 King Size Premium European Bedding',
    },
    sizeM2: 85,
    view: {
      fr: 'Fleuve Wouri & Skyline Portuaire',
      en: 'Wouri River & Maritime Port Skyline',
    },
    floor: {
      fr: '12ème étage · Dernier niveau panoramique',
      en: '12th Floor · Panoramic Rooftop',
    },
    amenities: ['wifi', 'ac', 'breakfast', 'shuttle', 'butler', 'workspace', 'balcony', 'spa'],
    features: {
      fr: [
        'Salon de travail privé avec écran de projection discret',
        'Baie vitrée double vitrage acoustique haute isolation',
        'Bar approvisionné en cafés grands crus et spiritueux sélectionnés',
        'Navette berline VIP aéroport Douala International (12 min)',
        'Salle de bain avec baignoire en îlot et vue panoramique',
      ],
      en: [
        'Private meeting lounge with discreet projection setup',
        'Double-glazed acoustic panoramic floor-to-ceiling glass',
        'Curated private bar with grand cru coffees and aged spirits',
        'VIP luxury sedan airport transfer (12 min from Douala Int Airport)',
        'Freestanding soak tub overlooking the shipping estuary',
      ],
    },
    description: {
      fr: 'Surplombant les reflets argentés du fleuve Wouri au cœur du quartier historique de Bonanjo, ce penthouse contemporain offre un havre de calme aux dirigeants, investisseurs et esthètes de passage dans la capitale économique camerounaise.',
      en: 'Hovering over the shimmering waters of the Wouri River in historic Bonanjo, this contemporary penthouse offers an oasis of quiet authority to corporate leaders, diplomats, and discerning travelers visiting Cameroon’s commercial capital.',
    },
    image: '/src/assets/images/room_douala_waterfront_1793714395315.jpg',
    gallery: [
      '/src/assets/images/room_douala_waterfront_1793714395315.jpg',
      '/src/assets/images/luxury_suite_lounge_1794045154724.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
      '/src/assets/images/hero_cameroon_luxury_1793714393134.jpg',
    ],
    rating: 4.92,
    reviewsCount: 42,
  },
  {
    id: 'yaounde-residence-bastos',
    name: {
      fr: 'Pavillon Mont Fébé & Bastos',
      en: 'Mont Fébé & Bastos Hilltop Pavilion',
    },
    subtitle: {
      fr: 'Brise fraîche d’altitude, architecture coloniale modernisée et jardins d’orchidées',
      en: 'Crisp upland breezes, modernized architectural lines and private orchid gardens',
    },
    destination: 'yaounde',
    destinationLabel: {
      fr: 'Yaoundé · Collines de Bastos',
      en: 'Yaoundé · Bastos Diplomatic Heights',
    },
    city: 'Yaoundé',
    priceXAF: 210000,
    capacity: 2,
    bedding: {
      fr: '1 Lit King Size Royal avec tête de lit sculptée',
      en: '1 Royal King Size Bed with carved wood artisan headboard',
    },
    sizeM2: 72,
    view: {
      fr: 'Collines verdoyantes & Canopée équatoriale',
      en: 'Misted Green Hills & Equatorial Canopy',
    },
    floor: {
      fr: 'Niveau Belvédère privé',
      en: 'Private Belvedere Terrace Level',
    },
    amenities: ['wifi', 'ac', 'breakfast', 'shuttle', 'butler', 'balcony', 'workspace', 'spa'],
    features: {
      fr: [
        'Vaste terrasse suspendue au-dessus de la brume matinale',
        'Cheminée d’ambiance pour les soirées fraîches de Yaoundé',
        'Œuvres d’art contemporaines d’artistes camerounais renommés',
        'Salle d’eau en marbre du Nord avec produits d’accueil artisanaux',
        'Service majordome dédié avec service du thé et café de l’Ouest',
      ],
      en: [
        'Expansive suspended balcony facing the morning mountain mist',
        'Ambient fireplace for crisp Yaoundé upland evenings',
        'Original contemporary art by celebrated Cameroonian masters',
        'North-quarried marble bathroom with artisanal botanicals',
        'Dedicated butler delivering Highland coffee and tea ceremonies',
      ],
    },
    description: {
      fr: 'Érigé sur les hauteurs aristocratiques de Yaoundé à proximité des ambassades de Bastos et du Mont Fébé, ce pavillon allie discrétion absolue, air pur et noblesse des volumes sous plafond. Un sanctuaire d’exception au cœur de la capitale politique.',
      en: 'Perched on the diplomatic slopes of Bastos and Mont Fébé, this pavilion merges utmost discretion with fresh highland air and soaring ceiling volumes. An aristocratic sanctuary in Cameroon’s political capital.',
    },
    image: '/src/assets/images/room_yaounde_palace_1793714396103.jpg',
    gallery: [
      '/src/assets/images/room_yaounde_palace_1793714396103.jpg',
      '/src/assets/images/luxury_suite_lounge_1794045154724.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
    ],
    rating: 4.97,
    reviewsCount: 31,
  },
  {
    id: 'limbe-villa-blacksands',
    name: {
      fr: 'Villa Botanique Black Sands',
      en: 'Black Sands Botanical Eco-Villa',
    },
    subtitle: {
      fr: 'Pierre volcanique de basalte, sable noir et silhouettes majestueuses du mont Cameroun',
      en: 'Basalt volcanic stonework, black volcanic sand and majestic Mount Cameroon backdrop',
    },
    destination: 'limbe',
    destinationLabel: {
      fr: 'Limbé · Baie Volcanique',
      en: 'Limbe · Volcanic Coast',
    },
    city: 'Limbe',
    priceXAF: 195000,
    capacity: 3,
    bedding: {
      fr: '1 Lit King Size + 1 Banquette-lit en acajou',
      en: '1 King Size Bed + 1 Hand-hewn Mahogany Daybed',
    },
    sizeM2: 70,
    view: {
      fr: 'Sable Noir, Forêt Humide & Flanc du Mont Cameroun',
      en: 'Black Sands, Rainforest & Mount Cameroon Slope',
    },
    floor: {
      fr: 'Pavillon de plain-pied entouré de fougères arborescentes',
      en: 'Ground level eco-pavilion framed by tree ferns',
    },
    amenities: ['wifi', 'ac', 'breakfast', 'shuttle', 'balcony', 'spa', 'pool'],
    features: {
      fr: [
        'Murs en pierre de lave taillée assurant une fraîcheur naturelle',
        'Piscine naturelle d’eau de source de montagne',
        'Accès privé aux jardins botaniques centenaires de Limbé',
        'Petit-déjeuner bio issu des fermes agroforestières de Buéa',
        'Terrasse d’observation ornithologique',
      ],
      en: [
        'Hand-chiseled lava stone walls providing natural cooling',
        'Natural mountain spring-fed swimming pool',
        'Direct gate into the historic century-old Limbe Botanic Garden',
        'Organic breakfast sourced from Mount Cameroon highland farms',
        'Private birdwatching veranda with binoculars provided',
      ],
    },
    description: {
      fr: 'Là où les coulées de lave du mont Cameroun rencontrent l’océan dans une profusion de fougères géantes et de sable noir, cette villa écologique offre une déconnexion intemporelle. Un hommage à la géologie fascinante de la côte sud-ouest camerounaise.',
      en: 'Where ancient lava flows of Mount Cameroon meet the Atlantic amidst giant ferns and dark volcanic sand, this eco-luxury lodge offers restorative tranquility. An authentic tribute to the majestic geology of southwest Cameroon.',
    },
    image: '/src/assets/images/room_limbe_bungalow_1793714396592.jpg',
    gallery: [
      '/src/assets/images/room_limbe_bungalow_1793714396592.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
      '/src/assets/images/luxury_suite_lounge_1794045154724.jpg',
    ],
    rating: 4.88,
    reviewsCount: 29,
  },
  {
    id: 'kribi-suite-robe',
    name: {
      fr: 'Suite Royale Chutes de la Lobé',
      en: 'Lobé Waterfalls Royal Suite',
    },
    subtitle: {
      fr: 'Baignade océane, pavillon ouvert sur la brise marine et menu dégustation de crevettes royales',
      en: 'Sea bathing, sea-breeze pavilion and signature royal king-prawn tasting menu',
    },
    destination: 'kribi',
    destinationLabel: {
      fr: 'Kribi · Fleuve & Océan',
      en: 'Kribi · River & Sea',
    },
    city: 'Kribi',
    priceXAF: 185000,
    capacity: 2,
    bedding: {
      fr: '1 Lit Queen Size avec moustiquaire de voile brodée',
      en: '1 Queen Bed with handcrafted embroidered voile drape',
    },
    sizeM2: 60,
    view: {
      fr: 'Golfe de Guinée & Embouchure de la Lobé',
      en: 'Gulf of Guinea & Lobé River Mouth',
    },
    floor: {
      fr: '1er étage avec loggia privative',
      en: 'First floor with secluded loggia',
    },
    amenities: ['wifi', 'oceanView', 'ac', 'breakfast', 'shuttle', 'balcony', 'spa'],
    features: {
      fr: [
        'Excursion en pirogue traditionnelle offerte sur la Lobé',
        'Loggia orientée face au coucher de soleil sur l’Atlantique',
        'Service de fruits tropicaux frais et eau de coco à discrétion',
        'Literie hypoallergénique et voilages aérés',
      ],
      en: [
        'Complimentary private pirogue journey on the Lobé River',
        'Private loggia perfectly aligned with Atlantic sunsets',
        'Fresh tropical fruits and coconut water served upon request',
        'Hypoallergenic bedding and breezy breathable linens',
      ],
    },
    description: {
      fr: 'Située à quelques encablures du seul endroit au monde où des chutes d’eau douce se précipitent directement dans la mer, cette suite célèbre l’union de la forêt équatoriale et des flots de l’Atlantique Sud.',
      en: 'Located moments away from the unique natural spectacle where freshwater waterfalls tumble directly into ocean surf, this suite honors the marriage between Cameroon’s rainforest and the Atlantic waters.',
    },
    image: '/src/assets/images/room_kribi_ocean_1793714394549.jpg',
    gallery: [
      '/src/assets/images/room_kribi_ocean_1793714394549.jpg',
      '/src/assets/images/hero_cameroon_luxury_1793714393134.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
    ],
    rating: 4.89,
    reviewsCount: 24,
  },
  {
    id: 'douala-suite-akwa',
    name: {
      fr: 'Suite Signature Akwa Prestige',
      en: 'Akwa Prestige Signature Suite',
    },
    subtitle: {
      fr: 'Atmosphère intimiste, mobilier en padouk ciré et salon de lecture contemporain',
      en: 'Intimate atmosphere, polished African padouk furniture and private reading salon',
    },
    destination: 'douala',
    destinationLabel: {
      fr: 'Douala · Triangle d’Or',
      en: 'Douala · Golden Triangle',
    },
    city: 'Douala',
    priceXAF: 160000,
    capacity: 2,
    bedding: {
      fr: '1 Lit King Size ergonomique',
      en: '1 Ergonomic King Size Bed',
    },
    sizeM2: 55,
    view: {
      fr: 'Jardin Intérieur & Voûte d’Arbres Tropicaux',
      en: 'Private Courtyard & Tropical Foliage',
    },
    floor: {
      fr: '4ème étage · Aile calme',
      en: '4th Floor · Quiet Wing',
    },
    amenities: ['wifi', 'ac', 'breakfast', 'shuttle', 'workspace', 'spa'],
    features: {
      fr: [
        'Isolation phonique renforcée pour un sommeil parfait',
        'Machine à espresso avec mouture de café noir de Melong',
        'Station de recharge universelle et éclairage circadian réglable',
        'Service de blanchisserie express le jour même',
      ],
      en: [
        'Enhanced acoustic soundproofing for restful sleep',
        'Espresso station featuring freshly roasted Melong black coffee',
        'Universal tech charging dock and circadian mood lighting',
        'Same-day complimentary express laundry service',
      ],
    },
    description: {
      fr: 'L’élégance urbaine à l’abri de l’effervescence de la métropole. Des tonalités chaudes de terre et de laiton confèrent à cette suite une atmosphère reposante et hautement productive.',
      en: 'Urban elegance sheltered from Douala’s vibrant city rhythm. Warm earth tones and burnished brass create an atmosphere of restorative calm and effortless productivity.',
    },
    image: '/src/assets/images/room_douala_waterfront_1793714395315.jpg',
    gallery: [
      '/src/assets/images/room_douala_waterfront_1793714395315.jpg',
      '/src/assets/images/luxury_suite_lounge_1794045154724.jpg',
      '/src/assets/images/luxury_suite_bath_1794045140963.jpg',
    ],
    rating: 4.85,
    reviewsCount: 19,
  },
];
