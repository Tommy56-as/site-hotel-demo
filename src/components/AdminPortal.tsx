import React, { useState } from 'react';
import { Booking, Room, Language, Currency, DestinationId, AdminUser, AdminRole } from '../types';
import { formatPrice } from '../utils/currency';
import { translations } from '../utils/i18n';
import { getStoredAdminUsers, saveAdminUsers, getRoleLabel, saveAdminSession } from '../utils/auth';
import { getWhatsAppConfirmationLink, getGmailWebLink } from '../utils/confirmation';
import { InvoiceView } from './InvoiceView';
import { Logo } from './Logo';
import {
  Calendar,
  MapPin,
  Users,
  Building,
  Trash2,
  Printer,
  X,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Car,
  Upload,
  MessageSquare,
  Mail,
  UserPlus,
  Shield,
  LogOut,
  UserCheck,
  AlertCircle,
  Image as ImageIcon,
  Edit3,
  Star,
  Images,
  Plus,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser;
  onLogout: () => void;
  bookings: Booking[];
  rooms: Room[];
  language: Language;
  currency: Currency;
  onAddRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  bookings,
  rooms,
  language,
  currency,
  onAddRoom,
  onDeleteRoom,
  onCancelBooking,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'addRoom' | 'users'>('bookings');
  const [regionFilter, setRegionFilter] = useState<DestinationId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  // User Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => getStoredAdminUsers());
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('CHEF_RECEPTION');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState<string | null>(null);
  const [userErrorMessage, setUserErrorMessage] = useState<string | null>(null);

  // Form state for adding a new room
  const [newRoomDestination, setNewRoomDestination] = useState<'kribi' | 'douala' | 'yaounde' | 'limbe'>('kribi');
  const [newRoomNameFr, setNewRoomNameFr] = useState('');
  const [newRoomNameEn, setNewRoomNameEn] = useState('');
  const [newRoomSubtitleFr, setNewRoomSubtitleFr] = useState('');
  const [newRoomSubtitleEn, setNewRoomSubtitleEn] = useState('');
  const [newRoomPriceXAF, setNewRoomPriceXAF] = useState<number>(180000);
  const [newRoomCapacity, setNewRoomCapacity] = useState<number>(2);
  const [newRoomSizeM2, setNewRoomSizeM2] = useState<number>(65);
  const [newRoomBeddingFr, setNewRoomBeddingFr] = useState('1 Lit King Size Impérial en bois d’iroko');
  const [newRoomBeddingEn, setNewRoomBeddingEn] = useState('1 Imperial King Size Bed in solid iroko timber');
  const [newRoomViewFr, setNewRoomViewFr] = useState('Vue Océan Atlantique & Canopée de Palmiers');
  const [newRoomViewEn, setNewRoomViewEn] = useState('Atlantic Ocean & Palm Canopy View');
  const [newRoomFloorFr, setNewRoomFloorFr] = useState('Rez-de-jardin avec terrasse privative');
  const [newRoomFloorEn, setNewRoomFloorEn] = useState('Garden level with private terrace');
  const [newRoomDescFr, setNewRoomDescFr] = useState('');
  const [newRoomDescEn, setNewRoomDescEn] = useState('');
  const [newRoomAmenities, setNewRoomAmenities] = useState<string[]>([
    'wifi',
    'ac',
    'breakfast',
    'shuttle',
    'balcony',
  ]);

  // Image Selection / Upload state
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedGalleryPhotos, setUploadedGalleryPhotos] = useState<
    { id: string; url: string; name: string }[]
  >([]);
  const [primaryCoverIndex, setPrimaryCoverIndex] = useState<number>(0);
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(
    '/src/assets/images/room_kribi_ocean_1793714394549.jpg'
  );
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Edit User State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editUserName, setEditUserName] = useState<string>('');
  const [editUserEmail, setEditUserEmail] = useState<string>('');
  const [editUserRole, setEditUserRole] = useState<AdminRole>('CHEF_RECEPTION');
  const [editUserPassword, setEditUserPassword] = useState<string>('');
  const [editUserIsActive, setEditUserIsActive] = useState<boolean>(true);

  if (!isOpen) return null;

  // Architectural Image Presets
  const imagePresets = [
    {
      label: 'Kribi — Océan & Plage',
      url: '/src/assets/images/room_kribi_ocean_1793714394549.jpg',
    },
    {
      label: 'Douala — Estuaire & Verrière',
      url: '/src/assets/images/room_douala_waterfront_1793714395315.jpg',
    },
    {
      label: 'Yaoundé — Collines de Bastos',
      url: '/src/assets/images/room_yaounde_palace_1793714396103.jpg',
    },
    {
      label: 'Limbé — Villa Volcanique',
      url: '/src/assets/images/room_limbe_bungalow_1793714396592.jpg',
    },
    {
      label: 'Terrasse Panoramique Kribi',
      url: '/src/assets/images/hero_cameroon_luxury_1793714393134.jpg',
    },
  ];

  // Financial Metrics
  const totalRevenueXAF = bookings.reduce((sum, b) => sum + b.payment.totalXAF, 0);
  const totalTvaXAF = bookings.reduce((sum, b) => sum + b.payment.tvaXAF, 0);
  const totalNights = bookings.reduce((sum, b) => sum + b.nights, 0);

  // Bookings filtering
  const filteredBookings = bookings.filter((b) => {
    if (regionFilter !== 'all') {
      const destMap: Record<string, DestinationId> = {
        'Kribi · Littoral Sud': 'kribi',
        'Kribi · South Coast': 'kribi',
        'Douala · Quartier Bonanjo': 'douala',
        'Douala · Bonanjo Financial District': 'douala',
        'Yaoundé · Collines de Bastos': 'yaounde',
        'Yaoundé · Bastos Diplomatic Heights': 'yaounde',
        'Limbé · Baie Volcanique': 'limbe',
        'Limbe · Volcanic Coast': 'limbe',
      };
      if (destMap[b.destination] && destMap[b.destination] !== regionFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${b.guestInfo.firstName} ${b.guestInfo.lastName}`.toLowerCase().includes(q);
      const matchPhone = b.guestInfo.phone.includes(q);
      const matchRef = b.id.toLowerCase().includes(q);
      const matchRoom = b.roomName.toLowerCase().includes(q);
      return matchName || matchPhone || matchRef || matchRoom;
    }
    return true;
  });

  // Rooms filtering
  const filteredRooms = rooms.filter((r) => {
    if (regionFilter !== 'all' && r.destination !== regionFilter) {
      return false;
    }
    return true;
  });

  const handleToggleAmenity = (key: string) => {
    setNewRoomAmenities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Real File Upload handler (single or multiple)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setFormErrorMessage('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setFormErrorMessage(null);

    Array.from(validFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const photoItem = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            url: reader.result,
            name: `${file.name} (${(file.size / 1024).toFixed(1)} Ko)`,
          };
          setUploadedGalleryPhotos((prev) => [...prev, photoItem]);
          setUploadedImageDataUrl(reader.result);
          setUploadedFileName(file.name);
          setImageSourceMode('upload');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryPhoto = (photoId: string) => {
    setUploadedGalleryPhotos((prev) => {
      const next = prev.filter((p) => p.id !== photoId);
      if (primaryCoverIndex >= next.length) {
        setPrimaryCoverIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleAddPresetToGallery = (presetUrl: string, label: string) => {
    setUploadedGalleryPhotos((prev) => [
      ...prev,
      {
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: presetUrl,
        name: label,
      },
    ]);
  };

  const handleAddCustomUrlToGallery = () => {
    if (!customImageUrl.trim()) return;
    setUploadedGalleryPhotos((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        url: customImageUrl.trim(),
        name: 'Photo URL Externe',
      },
    ]);
    setCustomImageUrl('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoomNameFr.trim() || !newRoomNameEn.trim()) {
      setFormErrorMessage(
        language === 'fr'
          ? 'Le nom de la chambre est requis en français et en anglais.'
          : 'Suite name is required in French and English.'
      );
      return;
    }
    if (!newRoomDescFr.trim()) {
      setFormErrorMessage(
        language === 'fr'
          ? 'Une description complète en français est requise.'
          : 'Full description in French is required.'
      );
      return;
    }

    // Determine final gallery and primary cover
    let finalGallery: string[] = [];
    if (uploadedGalleryPhotos.length > 0) {
      finalGallery = uploadedGalleryPhotos.map((p) => p.url);
    } else if (imageSourceMode === 'upload' && uploadedImageDataUrl) {
      finalGallery = [uploadedImageDataUrl];
    } else if (imageSourceMode === 'url' && customImageUrl.trim()) {
      finalGallery = [customImageUrl.trim()];
    } else {
      finalGallery = [selectedImagePreset];
    }

    const primaryImage =
      finalGallery[primaryCoverIndex] || finalGallery[0] || selectedImagePreset;

    const cityMap: Record<string, string> = {
      kribi: 'Kribi',
      douala: 'Douala',
      yaounde: 'Yaoundé',
      limbe: 'Limbe',
    };

    const labelMap: Record<string, { fr: string; en: string }> = {
      kribi: { fr: 'Kribi · Littoral Sud', en: 'Kribi · South Coast' },
      douala: { fr: 'Douala · Quartier Bonanjo', en: 'Douala · Bonanjo Financial District' },
      yaounde: { fr: 'Yaoundé · Collines de Bastos', en: 'Yaoundé · Bastos Diplomatic Heights' },
      limbe: { fr: 'Limbé · Baie Volcanique', en: 'Limbe · Volcanic Coast' },
    };

    const newRoom: Room = {
      id: `${newRoomDestination}-residence-${Date.now()}`,
      name: { fr: newRoomNameFr, en: newRoomNameEn },
      subtitle: {
        fr: newRoomSubtitleFr || 'Sanctuaire d’exception au confort absolu',
        en: newRoomSubtitleEn || 'Exceptional sanctuary with pristine comfort',
      },
      destination: newRoomDestination,
      destinationLabel: labelMap[newRoomDestination],
      city: cityMap[newRoomDestination],
      priceXAF: Number(newRoomPriceXAF),
      capacity: Number(newRoomCapacity),
      bedding: { fr: newRoomBeddingFr, en: newRoomBeddingEn },
      sizeM2: Number(newRoomSizeM2),
      view: { fr: newRoomViewFr, en: newRoomViewEn },
      floor: { fr: newRoomFloorFr, en: newRoomFloorEn },
      amenities: newRoomAmenities,
      features: {
        fr: [
          'Literie haut de gamme hypoallergénique',
          'Service de conciergerie VIP 24/7',
          'Accès direct aux infrastructures de détente',
          'Climatisation silencieuse et isolation phonique',
        ],
        en: [
          'High-end hypoallergenic luxury bedding',
          '24/7 dedicated VIP concierge service',
          'Direct access to resort amenities',
          'Silent climate control and enhanced acoustic insulation',
        ],
      },
      description: {
        fr: newRoomDescFr,
        en: newRoomDescEn || newRoomDescFr,
      },
      image: primaryImage,
      gallery: finalGallery,
      rating: 4.9,
      reviewsCount: 1,
      isCustom: true,
    };

    onAddRoom(newRoom);
    setFormSuccessMessage(t.admin.successAdded);
    setFormErrorMessage(null);

    // Reset form
    setNewRoomNameFr('');
    setNewRoomNameEn('');
    setNewRoomSubtitleFr('');
    setNewRoomSubtitleEn('');
    setNewRoomDescFr('');
    setNewRoomDescEn('');
    setUploadedImageDataUrl(null);
    setUploadedFileName(null);
    setUploadedGalleryPhotos([]);
    setPrimaryCoverIndex(0);
    setCustomImageUrl('');

    setTimeout(() => {
      setFormSuccessMessage(null);
      setActiveTab('rooms');
    }, 1500);
  };

  // Add Staff User Handler
  const handleAddStaffUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setUserErrorMessage('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    if (adminUsers.some((u) => u.email.toLowerCase() === newUserEmail.trim().toLowerCase())) {
      setUserErrorMessage('Un compte avec cette adresse email existe déjà.');
      return;
    }

    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      password: newUserPassword,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const updated = [newUser, ...adminUsers];
    setAdminUsers(updated);
    saveAdminUsers(updated);

    setUserSuccessMessage(`Collaborateur "${newUser.name}" ajouté avec succès.`);
    setUserErrorMessage(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');

    setTimeout(() => {
      setUserSuccessMessage(null);
    }, 3000);
  };

  const handleDeleteStaffUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte actuellement connecté.');
      return;
    }

    if (window.confirm('Voulez-vous vraiment révoquer l’accès de ce collaborateur ?')) {
      const updated = adminUsers.filter((u) => u.id !== userId);
      setAdminUsers(updated);
      saveAdminUsers(updated);
    }
  };

  const handleStartEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserPassword('');
    setEditUserIsActive(user.isActive !== false);
    setUserErrorMessage(null);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUserName.trim() || !editUserEmail.trim()) {
      setUserErrorMessage('Veuillez renseigner un nom et un email valides.');
      return;
    }

    if (
      adminUsers.some(
        (u) =>
          u.id !== editingUser.id &&
          u.email.toLowerCase() === editUserEmail.trim().toLowerCase()
      )
    ) {
      setUserErrorMessage('Un autre compte utilise déjà cette adresse email.');
      return;
    }

    const updatedUsers = adminUsers.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editUserName.trim(),
          email: editUserEmail.trim(),
          role: editUserRole,
          isActive: editUserIsActive,
          password: editUserPassword.trim() ? editUserPassword.trim() : u.password,
        };
      }
      return u;
    });

    setAdminUsers(updatedUsers);
    saveAdminUsers(updatedUsers);

    if (editingUser.id === currentUser.id) {
      const self = updatedUsers.find((u) => u.id === currentUser.id);
      if (self) saveAdminSession(self);
    }

    setUserSuccessMessage(`Collaborateur "${editUserName}" mis à jour avec succès.`);
    setUserErrorMessage(null);
    setEditingUser(null);

    setTimeout(() => {
      setUserSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex animate-in fade-in duration-200">
      <div className="w-full h-full bg-[#FAF8F5] text-[#1A1A1A] flex flex-col overflow-hidden">
        {/* Executive Header */}
        <header className="bg-[#163024] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#C5A059]" />
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                {t.admin.portalTitle}
              </h1>
              <span className="text-[10px] uppercase font-semibold bg-[#8C4A32] text-white px-2 py-0.5 rounded-xs">
                Back-Office Direction
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              {t.admin.portalSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Logged in User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xs text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block text-[11px] leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-[#C5A059] block uppercase tracking-wider font-semibold">
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="px-3 py-2 bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-200 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Se déconnecter de l’administration"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>

            {/* Close portal button */}
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>{t.admin.closeAdmin}</span>
            </button>
          </div>
        </header>

        {/* Executive Metrics Bar */}
        <div className="bg-white border-b border-[#163024]/10 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold block">
              {t.admin.metricsTotalRevenue}
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#163024] tabular-nums font-mono">
              {formatPrice(totalRevenueXAF, currency)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold block">
              {t.admin.metricsTvaCollected}
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#8C4A32] tabular-nums font-mono">
              {formatPrice(totalTvaXAF, currency)}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold block">
              {t.admin.metricsActiveBookings}
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#163024] tabular-nums">
              {bookings.length} {t.admin.statusConfirmed}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/60 font-semibold block">
              {t.admin.metricsNightsBooked}
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#163024] tabular-nums">
              {totalNights} {t.checkout.nights}
            </span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-[#FAF8F5] border-b border-[#163024]/15 px-6 pt-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedInvoice(null);
                setActiveTab('bookings');
              }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'border-[#163024] text-[#163024] bg-white rounded-t-xs'
                  : 'border-transparent text-[#1A1A1A]/70 hover:text-[#163024]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.admin.tabBookings} ({bookings.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedInvoice(null);
                setActiveTab('rooms');
              }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'rooms'
                  ? 'border-[#163024] text-[#163024] bg-white rounded-t-xs'
                  : 'border-transparent text-[#1A1A1A]/70 hover:text-[#163024]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{t.admin.tabRooms} ({rooms.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedInvoice(null);
                setActiveTab('addRoom');
              }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'addRoom'
                  ? 'border-[#163024] text-[#163024] bg-white rounded-t-xs'
                  : 'border-transparent text-[#1A1A1A]/70 hover:text-[#163024]'
              }`}
            >
              <Upload className="w-4 h-4 text-[#8C4A32]" />
              <span className="font-bold text-[#8C4A32]">{t.admin.tabAddRoom}</span>
            </button>

            <button
              onClick={() => {
                setSelectedInvoice(null);
                setActiveTab('users');
              }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'border-[#163024] text-[#163024] bg-white rounded-t-xs'
                  : 'border-transparent text-[#1A1A1A]/70 hover:text-[#163024]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#163024]" />
              <span>Collaborateurs & Accès ({adminUsers.length})</span>
            </button>
          </div>

          {/* Regional Selector Filter */}
          {activeTab !== 'addRoom' && activeTab !== 'users' && (
            <div className="flex items-center gap-2 pb-2">
              <Filter className="w-3.5 h-3.5 text-[#163024]" />
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value as DestinationId)}
                className="bg-white border border-[#163024]/20 rounded-xs px-2.5 py-1 text-xs text-[#1A1A1A] font-medium cursor-pointer"
              >
                <option value="all">{t.admin.allRegions}</option>
                <option value="kribi">Kribi (Océan)</option>
                <option value="douala">Douala (Wouri)</option>
                <option value="yaounde">Yaoundé (Mont Fébé)</option>
                <option value="limbe">Limbé (Sable Noir)</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Invoice Modal Preview inside Admin */}
          {selectedInvoice ? (
            <div className="max-w-4xl mx-auto space-y-4">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-xs font-semibold text-[#163024] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Retour au registre des réservations
              </button>
              <InvoiceView
                booking={selectedInvoice}
                language={language}
                currency={currency}
                onClose={() => setSelectedInvoice(null)}
              />
            </div>
          ) : activeTab === 'bookings' ? (
            /* TAB 1: ALL BOOKINGS RECEIVED WITH WHATSAPP & GMAIL TRANSMISSION */
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* Search Bar */}
              <div className="flex items-center gap-3 bg-white border border-[#163024]/15 rounded-xs p-2.5 shadow-2xs">
                <Search className="w-4 h-4 text-[#163024]/60 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom client, téléphone +237, référence MLC ou demeure..."
                  className="w-full text-xs bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#1A1A1A]/50 hover:text-[#1A1A1A] mr-2 cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="py-20 text-center bg-white border border-[#163024]/10 rounded-sm">
                  <FileText className="w-12 h-12 text-[#163024]/20 mx-auto mb-3" />
                  <p className="text-sm text-[#1A1A1A]/70 font-medium">
                    {t.admin.noBookings}
                  </p>
                  <p className="text-xs text-[#1A1A1A]/50 mt-1">
                    Les nouvelles réservations passées sur le site apparaîtront automatiquement ici en temps réel.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((b) => {
                    const waLink = getWhatsAppConfirmationLink(b, language);
                    const gmLink = getGmailWebLink(b, language);

                    return (
                      <div
                        key={b.id}
                        className="bg-white border border-[#163024]/15 rounded-sm p-6 shadow-xs space-y-4 transition-all hover:border-[#163024]/30"
                      >
                        {/* Top Row: Ref, Room, Price, Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#163024]/10 pb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-[#8C4A32]">
                                {b.id}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {t.admin.statusConfirmed}
                              </span>
                              <span className="text-xs text-[#1A1A1A]/60">·</span>
                              <span className="text-xs text-[#1A1A1A]/70">
                                Enregistré le {new Date(b.createdAt).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-[#163024]">
                              {b.roomName}
                            </h3>
                          </div>

                          <div className="sm:text-right">
                            <div className="font-serif text-xl font-bold text-[#163024] tabular-nums font-mono">
                              {formatPrice(b.payment.totalXAF, currency)}
                            </div>
                            <div className="text-[11px] text-[#1A1A1A]/60">
                              {b.payment.method === 'momo'
                                ? 'MTN MoMo (*126#)'
                                : b.payment.method === 'orange'
                                ? 'Orange Money (#150#)'
                                : 'Carte Bancaire'} · {b.payment.transactionId}
                            </div>
                          </div>
                        </div>

                        {/* Middle Grid: Client & Stay Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                          {/* Client details */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#8C4A32] font-semibold block mb-1">
                              {t.admin.clientDetails}
                            </span>
                            <p className="font-bold text-sm text-[#163024]">
                              {b.guestInfo.civility} {b.guestInfo.firstName} {b.guestInfo.lastName}
                            </p>
                            <p className="font-mono text-[#1A1A1A]/80 font-bold">
                              +237 {b.guestInfo.phone}
                            </p>
                            <p className="text-[#1A1A1A]/70">
                              {b.guestInfo.email}
                            </p>
                          </div>

                          {/* Stay parameters */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#8C4A32] font-semibold block mb-1">
                              Séjour & Destination
                            </span>
                            <p className="flex items-center gap-1.5 font-medium text-[#163024]">
                              <MapPin className="w-3.5 h-3.5 text-[#8C4A32]" />
                              <span>{b.destination}</span>
                            </p>
                            <p className="flex items-center gap-1.5 text-[#1A1A1A]/80 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-[#163024]" />
                              <span>Du {b.checkIn} au {b.checkOut} ({b.nights} {t.checkout.nights})</span>
                            </p>
                            <p className="flex items-center gap-1.5 text-[#1A1A1A]/70">
                              <Users className="w-3.5 h-3.5" />
                              <span>{b.guestsCount} {t.hero.guestPlural}</span>
                            </p>
                          </div>

                          {/* Options & Protocoles */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-[#8C4A32] font-semibold block mb-1">
                              Options & Protocoles
                            </span>
                            {b.guestInfo.airportShuttle ? (
                              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                                <Car className="w-3.5 h-3.5" />
                                <span>Navette aéroport VIP requise</span>
                              </p>
                            ) : (
                              <p className="text-[#1A1A1A]/50">Sans navette aéroport</p>
                            )}
                            {b.guestInfo.arrivalTime && (
                              <p className="text-[#1A1A1A]/70">
                                Arrivée estimée : {b.guestInfo.arrivalTime}
                              </p>
                            )}
                            {b.guestInfo.specialRequests && (
                              <p className="text-[11px] italic text-[#1A1A1A]/80 pt-1">
                                « {b.guestInfo.specialRequests} »
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions Bottom Bar with WhatsApp & Gmail Buttons */}
                        <div className="pt-3 border-t border-[#163024]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                          {/* Transmission Buttons */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#163024]">
                              Notifier le client :
                            </span>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-xs transition-colors flex items-center gap-1 shadow-2xs text-[11px]"
                              title={`Envoyer la confirmation WhatsApp à +237 ${b.guestInfo.phone}`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={gmLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-[#EA4335] hover:bg-[#D93025] text-white font-semibold rounded-xs transition-colors flex items-center gap-1 shadow-2xs text-[11px]"
                              title={`Envoyer la confirmation Gmail à ${b.guestInfo.email}`}
                            >
                              <Mail className="w-3 h-3" />
                              <span>Gmail</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedInvoice(b)}
                              className="px-3.5 py-1.5 bg-[#163024] hover:bg-[#0E2018] text-white font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{t.admin.viewVoucher}</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Confirmer l’annulation de cette réservation client ?')) {
                                  onCancelBooking(b.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                              title={t.admin.cancelBooking}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'rooms' ? (
            /* TAB 2: ROOM INVENTORY */
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#163024]">
                    Parc des Suites & Villas ({filteredRooms.length})
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
                    Inventaire actif des résidences proposées à la réservation par région camerounaise.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('addRoom')}
                  className="px-4 py-2 bg-[#8C4A32] hover:bg-[#723B28] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t.admin.tabAddRoom}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-[#163024]/15 rounded-sm overflow-hidden flex flex-col justify-between shadow-2xs transition-all hover:shadow-xs"
                  >
                    <div className="relative h-48 bg-[#FAF8F5]">
                      <img
                        src={r.image}
                        alt={r.name[language]}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#163024] text-white text-[10px] font-semibold px-2 py-0.5 rounded-xs">
                        {r.destinationLabel[language]}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-xs">
                        {r.sizeM2} m² · {r.capacity} pers.
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8C4A32] font-semibold">
                            {r.city}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-xs font-medium ${
                            r.isCustom
                              ? 'bg-[#8C4A32]/10 text-[#8C4A32] font-bold'
                              : 'bg-[#163024]/10 text-[#163024]'
                          }`}>
                            {r.isCustom ? t.admin.customRoomBadge : t.admin.defaultRoomBadge}
                          </span>
                        </div>

                        <h4 className="font-serif text-base font-bold text-[#163024] mb-1">
                          {r.name[language]}
                        </h4>
                        <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mb-3">
                          {r.subtitle[language]}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#163024]/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#1A1A1A]/60 block uppercase">
                            Tarif nuitée
                          </span>
                          <span className="font-serif text-base font-bold text-[#163024] tabular-nums font-mono">
                            {formatPrice(r.priceXAF, currency)}
                          </span>
                        </div>

                        {r.isCustom && (
                          <button
                            onClick={() => {
                              if (window.confirm(t.admin.deleteRoomConfirm)) {
                                onDeleteRoom(r.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                            title={t.admin.deleteRoom}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'addRoom' ? (
            /* TAB 3: ADD NEW ROOM WITH REAL FILE UPLOAD */
            <div className="max-w-3xl mx-auto bg-white border border-[#163024]/15 rounded-sm p-8 shadow-xs">
              <div className="border-b border-[#163024]/10 pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C4A32] font-semibold block mb-1">
                  Extension du Domaine Hôtelier
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#163024]">
                  {t.admin.addRoomTitle}
                </h3>
                <p className="text-xs text-[#1A1A1A]/70 mt-1">
                  Enregistrez une nouvelle suite ou villa d’exception avec téléversement direct de photos.
                </p>
              </div>

              {formSuccessMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{formSuccessMessage}</span>
                </div>
              )}

              {formErrorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xs text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateRoom} className="space-y-6">
                {/* 1. Destination / Region Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#163024] mb-2 uppercase tracking-wider">
                    1. {t.admin.destination} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'kribi', label: 'Kribi (Océan)' },
                        { id: 'douala', label: 'Douala (Wouri)' },
                        { id: 'yaounde', label: 'Yaoundé (Bastos)' },
                        { id: 'limbe', label: 'Limbé (Sable Noir)' },
                      ] as const
                    ).map((dest) => (
                      <button
                        type="button"
                        key={dest.id}
                        onClick={() => setNewRoomDestination(dest.id)}
                        className={`p-3 text-xs font-semibold rounded-xs border text-center transition-all cursor-pointer ${
                          newRoomDestination === dest.id
                            ? 'bg-[#163024] text-white border-[#163024] shadow-xs'
                            : 'bg-[#FAF8F5] text-[#1A1A1A] border-[#163024]/20 hover:bg-[#F3EFE6]'
                        }`}
                      >
                        {dest.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Room Names (FR & EN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.nameFr} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoomNameFr}
                      onChange={(e) => setNewRoomNameFr(e.target.value)}
                      placeholder="ex: Pavillon Équatorial Grand Batanga"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.nameEn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoomNameEn}
                      onChange={(e) => setNewRoomNameEn(e.target.value)}
                      placeholder="ex: Grand Batanga Equatorial Pavilion"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>

                {/* 3. Subtitles / Taglines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.subtitleFr}
                    </label>
                    <input
                      type="text"
                      value={newRoomSubtitleFr}
                      onChange={(e) => setNewRoomSubtitleFr(e.target.value)}
                      placeholder="ex: Terrasse panoramique en iroko et baignade privative"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.subtitleEn}
                    </label>
                    <input
                      type="text"
                      value={newRoomSubtitleEn}
                      onChange={(e) => setNewRoomSubtitleEn(e.target.value)}
                      placeholder="ex: Panoramic iroko terrace and secluded plunge bath"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* 4. Price, Capacity, Living Space */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.priceXAF} *
                    </label>
                    <input
                      type="number"
                      step={5000}
                      min={80000}
                      max={800000}
                      required
                      value={newRoomPriceXAF}
                      onChange={(e) => setNewRoomPriceXAF(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.capacity}
                    </label>
                    <select
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium cursor-pointer"
                    >
                      <option value={1}>1 voyageur</option>
                      <option value={2}>2 voyageurs (Couple / Exécutif)</option>
                      <option value={3}>3 voyageurs</option>
                      <option value={4}>4 voyageurs (Famille / Suite)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.sizeM2}
                    </label>
                    <input
                      type="number"
                      min={25}
                      max={250}
                      value={newRoomSizeM2}
                      onChange={(e) => setNewRoomSizeM2(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* 5. Bedding, View & Floor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.beddingFr}
                    </label>
                    <input
                      type="text"
                      value={newRoomBeddingFr}
                      onChange={(e) => setNewRoomBeddingFr(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.viewFr}
                    </label>
                    <input
                      type="text"
                      value={newRoomViewFr}
                      onChange={(e) => setNewRoomViewFr(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.floorFr}
                    </label>
                    <input
                      type="text"
                      value={newRoomFloorFr}
                      onChange={(e) => setNewRoomFloorFr(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* 6. Included Amenities Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-[#163024] mb-2 uppercase tracking-wider">
                    {t.admin.amenitiesSelect}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {(
                      [
                        { key: 'wifi', label: 'Fibre Optique Dédiée' },
                        { key: 'ac', label: 'Climatisation Silencieuse' },
                        { key: 'pool', label: 'Bassin Privatif / Piscine' },
                        { key: 'oceanView', label: 'Vue Océan Atlantique' },
                        { key: 'breakfast', label: 'Petit-déjeuner du terroir' },
                        { key: 'shuttle', label: 'Navette aéroport VIP' },
                        { key: 'butler', label: 'Conciergerie 24/7' },
                        { key: 'balcony', label: 'Terrasse en bois d’iroko' },
                        { key: 'workspace', label: 'Espace de travail exécutif' },
                      ] as const
                    ).map((amenity) => (
                      <label
                        key={amenity.key}
                        className="flex items-center gap-2 p-2 bg-[#FAF8F5] border border-[#163024]/15 rounded-xs cursor-pointer hover:bg-[#F3EFE6]"
                      >
                        <input
                          type="checkbox"
                          checked={newRoomAmenities.includes(amenity.key)}
                          onChange={() => handleToggleAmenity(amenity.key)}
                          className="accent-[#163024] w-4 h-4 rounded-xs"
                        />
                        <span className="text-[11px] font-medium text-[#1A1A1A]/85">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 7. Full Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.descFr} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newRoomDescFr}
                      onChange={(e) => setNewRoomDescFr(e.target.value)}
                      placeholder="Décrivez l'atmosphère, les essences de bois, l'harmonie avec le climat et les paysages camerounais..."
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A]/80 mb-1">
                      {t.admin.descEn}
                    </label>
                    <textarea
                      rows={4}
                      value={newRoomDescEn}
                      onChange={(e) => setNewRoomDescEn(e.target.value)}
                      placeholder="Describe the mood, noble materials, climate harmony and unique setting..."
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* 8. Multi-Photo Gallery Upload & Selection System */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#163024] uppercase tracking-wider flex items-center gap-2">
                      <Images className="w-4 h-4 text-[#8C4A32]" />
                      <span>8. Galerie Multi-Photos de la Demeure *</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#8C4A32] bg-[#FAF8F5] px-2.5 py-0.5 border border-[#163024]/15 rounded-xs">
                      {uploadedGalleryPhotos.length > 0
                        ? `${uploadedGalleryPhotos.length} photo(s) dans la galerie`
                        : '1 photo par défaut'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed">
                    Ajoutez plusieurs clichés haute résolution (chambre, salle de bain, terrasse, salon). Les clients pourront naviguer dans la galerie interactive depuis le site public.
                  </p>

                  {/* Mode Tabs */}
                  <div className="flex border border-[#163024]/20 rounded-xs overflow-hidden text-xs font-medium bg-[#FAF8F5] w-fit">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer ${
                        imageSourceMode === 'upload' ? 'bg-[#163024] text-white font-semibold' : 'text-[#1A1A1A] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Téléverser des Fichiers (Multiples)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('preset')}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer ${
                        imageSourceMode === 'preset' ? 'bg-[#163024] text-white font-semibold' : 'text-[#1A1A1A] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Vues Prédéfinies</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`px-3 py-1.5 flex items-center gap-1.5 cursor-pointer ${
                        imageSourceMode === 'url' ? 'bg-[#163024] text-white font-semibold' : 'text-[#1A1A1A] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      <span>Lien Web URL</span>
                    </button>
                  </div>

                  {/* Mode 1: Real Multi-File Upload */}
                  {imageSourceMode === 'upload' && (
                    <div className="p-4 border-2 border-dashed border-[#163024]/25 bg-[#FAF8F5] rounded-xs text-center">
                      <input
                        type="file"
                        id="room-image-file-input"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="room-image-file-input"
                        className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                      >
                        <Upload className="w-8 h-8 text-[#8C4A32]" />
                        <span className="text-xs font-bold text-[#163024]">
                          Cliquez pour ajouter une ou plusieurs photos depuis votre appareil
                        </span>
                        <span className="text-[10px] text-[#1A1A1A]/60">
                          Sélection multiple supportée · Formats : JPG, PNG, WEBP
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Mode 2: Presets */}
                  {imageSourceMode === 'preset' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imagePresets.map((img) => (
                        <div
                          key={img.url}
                          className="rounded-xs border border-[#163024]/20 overflow-hidden bg-white shadow-2xs group flex flex-col justify-between"
                        >
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-full h-20 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="p-1.5 flex items-center justify-between gap-1 text-[10px]">
                            <span className="font-semibold text-[#163024] truncate">{img.label}</span>
                            <button
                              type="button"
                              onClick={() => handleAddPresetToGallery(img.url, img.label)}
                              className="px-2 py-0.5 bg-[#163024] hover:bg-[#0E2018] text-white font-bold rounded-2xs cursor-pointer shrink-0"
                            >
                              + Ajouter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mode 3: Custom URL */}
                  {imageSourceMode === 'url' && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://... (URL directe d'une photographie de la suite)"
                        className="flex-1 bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomUrlToGallery}
                        className="px-4 py-2 bg-[#163024] hover:bg-[#0E2018] text-white text-xs font-bold rounded-xs cursor-pointer shrink-0"
                      >
                        + Ajouter à la galerie
                      </button>
                    </div>
                  )}

                  {/* VISUAL GALLERY MANAGER: Display all added photos with Cover Selector & Delete */}
                  {uploadedGalleryPhotos.length > 0 && (
                    <div className="mt-4 p-4 bg-white border border-[#163024]/15 rounded-xs space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#163024] border-b border-[#163024]/10 pb-2">
                        <span>Photographies enregistrées pour cette suite ({uploadedGalleryPhotos.length})</span>
                        <span className="text-[10px] text-[#8C4A32] font-normal">
                          Cliquez sur l'étoile pour définir la photo principale de couverture
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedGalleryPhotos.map((photo, idx) => {
                          const isPrimary = primaryCoverIndex === idx;
                          return (
                            <div
                              key={photo.id}
                              className={`relative rounded-xs overflow-hidden border transition-all ${
                                isPrimary
                                  ? 'border-[#8C4A32] ring-2 ring-[#8C4A32]/40 shadow-xs'
                                  : 'border-[#163024]/20'
                              }`}
                            >
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-24 object-cover"
                              />

                              {/* Primary Cover Badge / Selector */}
                              <button
                                type="button"
                                onClick={() => setPrimaryCoverIndex(idx)}
                                className={`absolute top-1.5 left-1.5 p-1 rounded-2xs text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  isPrimary
                                    ? 'bg-[#8C4A32] text-white'
                                    : 'bg-black/60 text-white/80 hover:bg-black/90'
                                }`}
                                title="Définir comme photo de couverture principale"
                              >
                                <Star className={`w-3 h-3 ${isPrimary ? 'fill-current' : ''}`} />
                                <span>{isPrimary ? 'Couverture' : 'Définir'}</span>
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryPhoto(photo.id)}
                                className="absolute top-1.5 right-1.5 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-2xs cursor-pointer transition-colors"
                                title="Retirer cette photo"
                              >
                                <X className="w-3 h-3" />
                              </button>

                              {/* Photo metadata index */}
                              <div className="p-1 bg-[#FAF8F5] text-[9px] text-[#1A1A1A]/70 truncate text-center font-mono">
                                Visuel {idx + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-[#163024]/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('rooms')}
                    className="px-4 py-2.5 text-xs font-semibold text-[#1A1A1A]/70 hover:bg-black/5 rounded-xs cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#163024] hover:bg-[#0E2018] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.admin.submitAdd}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TAB 4: USER MANAGEMENT (Collaborateurs & Accès) */
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#163024]/10 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#163024]">
                    Gestion des Accès & Collaborateurs Hôteliers
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
                    Contrôlez les comptes du personnel habilité à consulter les réservations et administrer les demeures.
                  </p>
                </div>
              </div>

              {/* Add New Staff Account Form */}
              <div className="bg-white border border-[#163024]/15 rounded-sm p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 font-serif text-base font-bold text-[#163024]">
                  <UserPlus className="w-5 h-5 text-[#8C4A32]" />
                  <span>Ajouter un Nouveau Collaborateur</span>
                </div>

                {userSuccessMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{userSuccessMessage}</span>
                  </div>
                )}

                {userErrorMessage && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xs text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{userErrorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleAddStaffUser} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="ex: Samuel Eto'o"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="nom@mboacollection.cm"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                      Rôle & Habilitation
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-2.5 py-1.5 text-xs font-medium cursor-pointer"
                    >
                      <option value="DIRECTEUR_GENERAL">Directeur Général</option>
                      <option value="CHEF_RECEPTION">Chef de Réception</option>
                      <option value="RESPONSABLE_RESERVATIONS">Responsable Réservations</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-12 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#163024] hover:bg-[#0E2018] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Créer le compte</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff Accounts Table */}
              <div className="bg-white border border-[#163024]/15 rounded-sm overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#163024]/10 font-serif text-sm font-bold text-[#163024]">
                  Comptes Actifs & Rôles Déclarés ({adminUsers.length})
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#163024]/15 bg-white text-[10px] uppercase font-bold text-[#1A1A1A]/60 text-left">
                        <th className="py-3 px-6">Collaborateur</th>
                        <th className="py-3 px-4">Rôle</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4">Dernier accès</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#163024]/10">
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="font-bold text-[#163024] flex items-center gap-2">
                              <span>{user.name}</span>
                              {user.id === currentUser.id && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-[#8C4A32] text-white rounded-xs">
                                  Vous
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#1A1A1A]/60 font-mono">
                              {user.email}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#163024] text-[11px]">
                              {getRoleLabel(user.role)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-xs bg-emerald-100 text-emerald-800">
                              Actif
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-[#1A1A1A]/70 text-[11px]">
                            {user.lastLogin
                              ? new Date(user.lastLogin).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Jamais connecté'}
                          </td>

                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditUser(user)}
                                className="px-2.5 py-1 bg-[#163024]/5 hover:bg-[#163024]/10 text-[#163024] border border-[#163024]/15 rounded-xs transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                title="Modifier ce collaborateur"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#8C4A32]" />
                                <span>Modifier</span>
                              </button>
                              {user.id !== currentUser.id && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStaffUser(user.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                                  title="Révoquer l’accès de ce collaborateur"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit User Modal */}
              {editingUser && (
                <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                  <div className="bg-white border border-[#163024]/20 rounded-sm shadow-2xl max-w-md w-full overflow-hidden">
                    <div className="bg-[#163024] text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="font-serif text-base font-bold">
                          Modifier le Collaborateur
                        </h4>
                      </div>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-xs cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditUser} className="p-6 space-y-4 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                          Email professionnel *
                        </label>
                        <input
                          type="email"
                          required
                          value={editUserEmail}
                          onChange={(e) => setEditUserEmail(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                          Rôle & Habilitation
                        </label>
                        <select
                          value={editUserRole}
                          onChange={(e) => setEditUserRole(e.target.value as AdminRole)}
                          className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs font-medium cursor-pointer"
                        >
                          <option value="DIRECTEUR_GENERAL">Directeur Général (Accès complet)</option>
                          <option value="CHEF_RECEPTION">Chef de Réception (Gestion réservations)</option>
                          <option value="RESPONSABLE_RESERVATIONS">Responsable Réservations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A1A1A]/70 mb-1">
                          Nouveau mot de passe (laisser vide pour ne pas modifier)
                        </label>
                        <input
                          type="password"
                          value={editUserPassword}
                          onChange={(e) => setEditUserPassword(e.target.value)}
                          placeholder="Laisser vide pour conserver l'actuel"
                          className="w-full bg-[#FAF8F5] border border-[#163024]/20 rounded-xs px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={editUserIsActive}
                            onChange={(e) => setEditUserIsActive(e.target.checked)}
                            className="w-4 h-4 accent-[#163024] rounded-xs"
                          />
                          <span className="font-semibold text-[#163024] text-xs">
                            Compte actif et autorisé à se connecter
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-[#163024]/10 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 text-xs font-semibold text-[#1A1A1A]/70 hover:bg-black/5 rounded-xs cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#163024] hover:bg-[#0E2018] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-xs"
                        >
                          Enregistrer les modifications
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
