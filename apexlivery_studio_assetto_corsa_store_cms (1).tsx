import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  Car,
  Sparkles,
  ShoppingCart,
  Plus,
  Edit3,
  Trash2,
  Upload,
  CheckCircle2,
  X,
  Search,
  Layers,
  ShieldCheck,
  Download,
  Sliders,
  Eye,
  Image as ImageIcon,
  DollarSign,
  Send,
  Settings,
  Award,
  Zap,
  ExternalLink,
  Check,
  FolderArchive,
  FileCheck,
  CreditCard,
  Wallet,
  Building2,
  Lock,
} from 'lucide-react';

// ============================================================================
// CONFIGURACIÓN DE FIREBASE Y PERSISTENCIA (NUBE + RESPALDO LOCAL)
// ============================================================================
let db = null;
let auth = null;
let appId = 'apex-livery-studio-ac';

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  if (typeof __app_id !== 'undefined' && __app_id) {
    appId = __app_id;
  }
} catch (err) {
  console.warn('Usando almacenamiento local persistente como respaldo:', err);
}

// ============================================================================
// CATÁLOGO INICIAL DE DEMOSTRACIÓN (ASSETTO CORSA LIVERIES)
// ============================================================================
const INITIAL_LIVERIES = [
  {
    id: 'ac-porsche-992-gt3r-rex',
    title: 'Porsche 992 GT3 R — Neon Cyber Rexy #80',
    carModel: 'Porsche 911 (992) GT3 R',
    carBaseMod: 'URD Darche 992 / Kunos Competizione',
    category: 'GT3',
    price: 14.99,
    resolution: '8K',
    cspPbr: true,
    includesDriverSuit: true,
    includesNumberplates: true,
    featured: true,
    downloads: 184,
    authorNote:
      'Incluye mapa de materiales PBR en carbono forjado mate, escamas reflectantes con ext_config.ini para Custom Shaders Patch (CSP 0.1.79+) y casco Bell personalizado.',
    tags: ['IMSA', '992 GT3 R', 'PBR Carbon', '8K', 'Endurance'],
    zipFileName: 'skin_992_neon_rexy_8k.zip',
    zipDownloadUrl: '',
    zipFileSize: '42.8 MB',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
    ],
    createdAt: 1710000000000,
  },
  {
    id: 'ac-bmw-m4-gt3-valkyrie',
    title: 'BMW M4 GT3 — Motorsport Works Stealth Gold',
    carModel: 'BMW M4 GT3 (G82)',
    carBaseMod: 'Bayesian / URD Bayro GT3 v2',
    category: 'GT3',
    price: 12.5,
    resolution: '4K',
    cspPbr: true,
    includesDriverSuit: true,
    includesNumberplates: true,
    featured: true,
    downloads: 142,
    authorNote:
      'Vinilo negro satinado con líneas en pan de oro metálico real mediante mapas _map.dds y configuración PBR para lluvia y noche en Nürburgring.',
    tags: ['Nürburgring 24h', 'BMW M4', 'Gold Chrome', 'CSP PBR'],
    zipFileName: 'skin_bmw_m4_gt3_stealth_gold.zip',
    zipDownloadUrl: '',
    zipFileSize: '28.4 MB',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
    ],
    createdAt: 1711000000000,
  },
  {
    id: 'ac-nissan-s15-fd-shibuya',
    title: 'Nissan Silvia S15 — Shibuya D1GP Drift Spec',
    carModel: 'Nissan Silvia S15 Spec-R Aero',
    carBaseMod: 'WDT Street / DWG Drift Pack',
    category: 'Drift',
    price: 9.99,
    resolution: '4K',
    cspPbr: true,
    includesDriverSuit: false,
    includesNumberplates: false,
    featured: false,
    downloads: 230,
    authorNote:
      'Diseño estilo Formula Drift Japón con gráficos vectoriales de alta definición, llantas Work Meister cromadas y cristales tintados iridiscentes.',
    tags: ['D1GP', 'Drift', 'JDM', 'Silvia S15', 'WDT'],
    zipFileName: 'skin_s15_shibuya_d1gp.zip',
    zipDownloadUrl: '',
    zipFileSize: '19.6 MB',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1400&q=85',
    ],
    createdAt: 1712000000000,
  },
  {
    id: 'ac-rss-formula-hybrid-apex',
    title: 'Formula Hybrid 2026 — Scuderia Carbon Rosso Concept',
    carModel: 'RSS Formula Hybrid X / 2026',
    carBaseMod: 'Race Sim Studio (RSS)',
    category: 'Fórmula',
    price: 15.99,
    resolution: '8K',
    cspPbr: true,
    includesDriverSuit: true,
    includesNumberplates: true,
    featured: true,
    downloads: 310,
    authorNote:
      'Pintura roja tricapa metalizada combinada con fibra de carbono expuesta en pontones. Incluye traje Sparco, guantes, casco y texturas de pit-crew.',
    tags: ['F1', 'RSS', 'Formula Hybrid', '8K', 'Full Team Pack'],
    zipFileName: 'skin_rss_fh26_carbon_rosso.zip',
    zipDownloadUrl: '',
    zipFileSize: '54.2 MB',
    images: [
      'https://images.unsplash.com/photo-1532906619279-a4b7267faa66?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85',
    ],
    createdAt: 1713000000000,
  },
];

const CATEGORIES = ['Todos', 'GT3', 'Rally', 'Drift', 'Fórmula', 'Street', 'Cup / Touring'];

const DEFAULT_PAYOUT_CONFIG = {
  ownerPin: '1203',
  paypalEnabled: true,
  selectedPaypalId: 'pp-main',
  paypalAccounts: [
    {
      id: 'pp-main',
      alias: 'PayPal Principal del Estudio',
      email: 'pagos@apexworks-studio.com',
      paypalMeUrl: 'https://paypal.me/apexworksstudio',
      beneficiary: 'ApexWorks Livery Studio',
    },
  ],
  cardEnabled: true,
  selectedCardAccountId: 'card-main',
  cardAccounts: [
    {
      id: 'card-main',
      alias: 'Cuenta Bancaria Principal (Liquidación Visa / Mastercard)',
      holderName: 'ApexWorks Livery Studio',
      ibanOrAccount: 'ES91 2100 0418 4502 0005 1332',
      processorName: 'Stripe / TPV Virtual Visa & Mastercard',
      paymentLinkUrl: '',
    },
  ],
};

// ============================================================================
// UTILIDADES DE IMAGEN Y GENERACIÓN DE PACK .ZIP FUNCIONAL
// ============================================================================
const compressImageFile = (file, maxWidth = 1400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const buildFallbackAssettoZipBlob = (livery) => {
  const encoder = new TextEncoder();
  const folderSlug = (livery.id || 'apex_livery').replace(/[^a-z0-9_-]/gi, '_');

  const uiSkinJson = JSON.stringify(
    {
      skinname: livery.title,
      drivername: 'ApexWorks Driver',
      country: 'ESP',
      team: 'ApexWorks Livery Studio',
      number: '80',
      priority: 1,
    },
    null,
    2
  );

  const extConfigIni = `; Generado por ApexWorks Livery Studio para Assetto Corsa Content Manager
; Modelo: ${livery.carModel} (${livery.carBaseMod})
; Resolución: ${livery.resolution} | CSP PBR: ${livery.cspPbr ? 'Activado' : 'Estándar'}

[INCLUDE: common/materials_carpaint.ini]

[Material_CarPaint_Metallic]
Materials = EXT_BODY, CARPAINT
Specular = 1.0
SpecularSun = 1.0
FresnelMax = 1.0
FresnelC = 0.12
BrightnessAdjustment = 0.95
`;

  const readmeTxt = `============================================================
APEXWORKS LIVERY STUDIO - ASSETTO CORSA SKIN PACK
Proyecto: ${livery.title}
Coche: ${livery.carModel}
Mod Base: ${livery.carBaseMod}
============================================================

INSTRUCCIONES DE INSTALACIÓN:
1. Arrastra y suelta este archivo .ZIP directamente dentro de Content Manager.
2. Pulsa en el icono de las 3 barras verdes arriba a la derecha y haz clic en "Install".
3. O descomprime la carpeta dentro de:
   assettocorsa/content/cars/<nombre_del_coche>/skins/${folderSlug}/
`;

  const files = [
    { name: `${folderSlug}/ui_skin.json`, data: encoder.encode(uiSkinJson) },
    { name: `${folderSlug}/ext_config.ini`, data: encoder.encode(extConfigIni) },
    { name: `${folderSlug}/LEEME_INSTALACION.txt`, data: encoder.encode(readmeTxt) },
  ];

  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  const crc32 = (bytes) => {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  };

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  files.forEach((f) => {
    const nameBytes = encoder.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;

    const local = new Uint8Array(30 + nameBytes.length + size);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    local.set(f.data, 30 + nameBytes.length);
    localHeaders.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralHeaders.push(central);

    offset += local.length;
  });

  const centralSize = centralHeaders.reduce((acc, b) => acc + b.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localHeaders, ...centralHeaders, eocd], {
    type: 'application/zip',
  });
};

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================
export default function App() {
  // Estados de Usuario y Datos
  const [user, setUser] = useState(null);
  const [liveries, setLiveries] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_liveries_v1');
      return saved ? JSON.parse(saved) : INITIAL_LIVERIES;
    } catch {
      return INITIAL_LIVERIES;
    }
  });
  const [commissions, setCommissions] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_commissions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Estados de Navegación y Modo Admin / Propietario
  const [activeTab, setActiveTab] = useState('catalogo');
  const [adminSubTab, setAdminSubTab] = useState('proyectos');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pendingOwnerAction, setPendingOwnerAction] = useState(null);
  const [newOwnerPinInput, setNewOwnerPinInput] = useState('');

  // Estados de Filtros del Catálogo y Visor Showroom
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedResolution, setSelectedResolution] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Estados de Vista Detallada (Showroom Modal)
  const [selectedLivery, setSelectedLivery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showroomLighting, setShowroomLighting] = useState('day');
  const [quickPhotoUrl, setQuickPhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estados de Carrito, Pasarela de Pago (PayPal / Tarjeta) y Cuentas de Cobro
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerDiscord, setBuyerDiscord] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardForm, setCardForm] = useState({
    holderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // Estado persistente de Cuentas Destino
  const [payoutConfig, setPayoutConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_payout_config_v1');
      const savedPin = localStorage.getItem('apex_owner_pin_v1');
      const parsed = saved ? JSON.parse(saved) : {};
      const resolvedPin =
        savedPin && savedPin !== '1234'
          ? savedPin
          : parsed.ownerPin && parsed.ownerPin !== '1234'
          ? parsed.ownerPin
          : '1203';
      return {
        ...DEFAULT_PAYOUT_CONFIG,
        ...parsed,
        ownerPin: resolvedPin,
      };
    } catch {
      return DEFAULT_PAYOUT_CONFIG;
    }
  });

  // Historial de ventas recibidas
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estados para añadir una nueva cuenta de PayPal o de Tarjeta/Banco en el panel
  const [newPaypalForm, setNewPaypalForm] = useState({
    alias: '',
    email: '',
    paypalMeUrl: '',
    beneficiary: '',
  });
  const [newCardAccountForm, setNewCardAccountForm] = useState({
    alias: '',
    holderName: '',
    ibanOrAccount: '',
    processorName: 'Stripe / TPV Visa & Mastercard',
    paymentLinkUrl: '',
  });

  // Estados del Editor / Creador de Proyecto (Modal Admin)
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingLiveryId, setEditingLiveryId] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    carModel: '',
    carBaseMod: 'Kunos Simulazioni',
    category: 'GT3',
    price: 12.99,
    resolution: '4K',
    cspPbr: true,
    includesDriverSuit: true,
    includesNumberplates: true,
    featured: false,
    authorNote: '',
    tagsInput: 'GT3, PBR, 4K, Custom',
    images: [],
    newImageUrl: '',
    zipFileName: '',
    zipDownloadUrl: '',
    zipDataUrl: '',
    zipFileSize: '',
  });

  // Estados del Cotizador de Encargos Personalizados (Commissions)
  const [commissionForm, setCommissionForm] = useState({
    clientName: '',
    discordOrEmail: '',
    carModName: '',
    category: 'GT3',
    finishType: 'standard',
    resolution: '4K',
    replicaOrOriginal: 'original',
    sponsorCount: 'medium',
    includeDriverKit: false,
    rushDelivery: false,
    referenceNotes: '',
  });
  const [commissionSentMessage, setCommissionSentMessage] = useState(false);

  // Notificaciones Toast y Referencias
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const detailFileInputRef = useRef(null);
  const zipFileInputRef = useRef(null);
  const zipSectionRef = useRef(null);
  const [isUploadingZip, setIsUploadingZip] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // ==========================================================================
  // PROTECCIÓN DE PROPIETARIO (PIN / CONTRASEÑA)
  // ==========================================================================
  const requestOwnerAccess = (actionCallback) => {
    if (isOwnerUnlocked) {
      actionCallback();
      return;
    }
    setPendingOwnerAction(() => actionCallback);
    setPinInput('');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const handleVerifyOwnerPin = (e) => {
    e.preventDefault();
    const rawSavedPin =
      localStorage.getItem('apex_owner_pin_v1') || payoutConfig.ownerPin || '1203';
    const activePin = rawSavedPin === '1234' ? '1203' : rawSavedPin;
    if (pinInput.trim() === String(activePin).trim()) {
      setIsOwnerUnlocked(true);
      setIsAdminMode(true);
      setIsPinModalOpen(false);
      setPinError('');
      showToast('Modo Propietario desbloqueado.');
      if (pendingOwnerAction) {
        pendingOwnerAction();
        setPendingOwnerAction(null);
      }
    } else {
      setPinError('Contraseña / PIN incorrecto. Inténtalo de nuevo.');
    }
  };

  const handleLockOwnerPanel = () => {
    setIsOwnerUnlocked(false);
    setIsAdminMode(false);
    if (activeTab === 'admin') {
      setActiveTab('catalogo');
    }
    showToast('Panel de propietario bloqueado para visitantes.', 'info');
  };

  // ==========================================================================
  // SINCRONIZACIÓN CON FIREBASE Y LOCALSTORAGE
  // ==========================================================================
  useEffect(() => {
    try {
      localStorage.setItem('apex_liveries_v1', JSON.stringify(liveries));
    } catch (e) {
      console.warn('Error guardando liveries en localStorage:', e);
    }
  }, [liveries]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_commissions_v1', JSON.stringify(commissions));
    } catch (e) {
      console.warn('Error guardando encargos en localStorage:', e);
    }
  }, [commissions]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_payout_config_v1', JSON.stringify(payoutConfig));
      if (payoutConfig.ownerPin) {
        localStorage.setItem('apex_owner_pin_v1', String(payoutConfig.ownerPin));
      }
    } catch (e) {
      console.warn('Error guardando configuración de cobro:', e);
    }
  }, [payoutConfig]);

  const savePayoutConfigToStorage = async (updatedConfig) => {
    setPayoutConfig(updatedConfig);
    try {
      localStorage.setItem('apex_payout_config_v1', JSON.stringify(updatedConfig));
      if (updatedConfig.ownerPin) {
        localStorage.setItem('apex_owner_pin_v1', String(updatedConfig.ownerPin));
      }
    } catch (e) {
      console.warn('Error guardando PIN en memoria local:', e);
    }

    if (user && db) {
      try {
        const settingsRef = doc(
          db,
          'artifacts',
          appId,
          'public',
          'data',
          'settings',
          'payout_config'
        );
        await setDoc(settingsRef, updatedConfig);
      } catch (err) {
        console.warn('Aviso al sincronizar configuración en la nube:', err);
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('apex_orders_v1', JSON.stringify(orders));
    } catch (e) {
      console.warn('Error guardando pedidos:', e);
    }
  }, [orders]);

  useEffect(() => {
    if (!auth || !db) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn('Fallo en autenticación Firebase:', err);
      }
    };

    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const liveriesCol = collection(db, 'artifacts', appId, 'public', 'data', 'liveries');
    const unsubscribeLiveries = onSnapshot(
      liveriesCol,
      (snapshot) => {
        setIsCloudSynced(true);
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setLiveries(loaded);
        }
      },
      (err) => {
        console.warn('Error leyendo liveries de Firestore:', err);
      }
    );

    const settingsRef = doc(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'settings',
      'payout_config'
    );
    const unsubscribeSettings = onSnapshot(
      settingsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudConfig = docSnap.data();
          setPayoutConfig((prev) => {
            const rawCloudPin = cloudConfig.ownerPin || prev.ownerPin || DEFAULT_PAYOUT_CONFIG.ownerPin;
            const validPin = rawCloudPin === '1234' ? '1203' : rawCloudPin;
            const merged = {
              ...DEFAULT_PAYOUT_CONFIG,
              ...prev,
              ...cloudConfig,
              ownerPin: validPin,
            };
            try {
              localStorage.setItem('apex_payout_config_v1', JSON.stringify(merged));
              localStorage.setItem('apex_owner_pin_v1', String(merged.ownerPin));
            } catch (e) {
              console.warn('Error actualizando caché local:', e);
            }
            return merged;
          });
        }
      },
      (err) => {
        console.warn('Error leyendo configuración de Firestore:', err);
      }
    );

    return () => {
      unsubscribeLiveries();
      unsubscribeSettings();
    };
  }, [user]);

  const saveLiveryToStorage = async (liveryObj) => {
    setLiveries((prev) => {
      const exists = prev.some((item) => item.id === liveryObj.id);
      const updated = exists
        ? prev.map((item) => (item.id === liveryObj.id ? liveryObj : item))
        : [liveryObj, ...prev];
      return updated;
    });

    if (selectedLivery && selectedLivery.id === liveryObj.id) {
      setSelectedLivery(liveryObj);
    }

    if (user && db) {
      try {
        const ref = doc(db, 'artifacts', appId, 'public', 'data', 'liveries', liveryObj.id);
        await setDoc(ref, liveryObj);
      } catch (err) {
        console.warn('Guardado local completado; aviso en nube:', err);
      }
    }
  };

  const deleteLiveryFromStorage = async (liveryId) => {
    setLiveries((prev) => prev.filter((item) => item.id !== liveryId));
    if (selectedLivery?.id === liveryId) {
      setSelectedLivery(null);
    }
    if (user && db) {
      try {
        const ref = doc(db, 'artifacts', appId, 'public', 'data', 'liveries', liveryId);
        await deleteDoc(ref);
      } catch (err) {
        console.warn('Eliminado localmente:', err);
      }
    }
    showToast('Proyecto eliminado del catálogo.', 'info');
  };

  // ==========================================================================
  // CUENTAS DE COBRO ACTIVAS (PAYPAL Y TARJETA VISA/MASTERCARD)
  // ==========================================================================
  const activePaypalAccount = useMemo(() => {
    return (
      payoutConfig.paypalAccounts.find((a) => a.id === payoutConfig.selectedPaypalId) ||
      payoutConfig.paypalAccounts[0] ||
      DEFAULT_PAYOUT_CONFIG.paypalAccounts[0]
    );
  }, [payoutConfig]);

  const activeCardAccount = useMemo(() => {
    return (
      payoutConfig.cardAccounts.find((a) => a.id === payoutConfig.selectedCardAccountId) ||
      payoutConfig.cardAccounts[0] ||
      DEFAULT_PAYOUT_CONFIG.cardAccounts[0]
    );
  }, [payoutConfig]);

  const detectCardBrand = (numStr) => {
    const clean = (numStr || '').replace(/\D/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
    return 'VISA / MASTERCARD';
  };

  const handleAddPaypalAccount = (e) => {
    e.preventDefault();
    if (!newPaypalForm.email.trim()) {
      showToast('Introduce el correo electrónico de tu cuenta PayPal.', 'error');
      return;
    }
    const newAcc = {
      id: `pp-${Date.now()}`,
      alias: newPaypalForm.alias.trim() || `PayPal (${newPaypalForm.email.trim()})`,
      email: newPaypalForm.email.trim(),
      paypalMeUrl: newPaypalForm.paypalMeUrl.trim(),
      beneficiary: newPaypalForm.beneficiary.trim() || 'ApexWorks Studio',
    };
    const updated = {
      ...payoutConfig,
      selectedPaypalId: newAcc.id,
      paypalAccounts: [...payoutConfig.paypalAccounts, newAcc],
    };
    savePayoutConfigToStorage(updated);
    setNewPaypalForm({ alias: '', email: '', paypalMeUrl: '', beneficiary: '' });
    showToast('Nueva cuenta de PayPal añadida y guardada en la nube.');
  };

  const handleAddCardAccount = (e) => {
    e.preventDefault();
    if (!newCardAccountForm.ibanOrAccount.trim()) {
      showToast('Introduce el IBAN o cuenta donde recibirás los pagos con tarjeta.', 'error');
      return;
    }
    const newAcc = {
      id: `card-${Date.now()}`,
      alias:
        newCardAccountForm.alias.trim() ||
        `Cuenta Tarjetas (${newCardAccountForm.ibanOrAccount.trim().slice(-4)})`,
      holderName: newCardAccountForm.holderName.trim() || 'ApexWorks Studio',
      ibanOrAccount: newCardAccountForm.ibanOrAccount.trim(),
      processorName:
        newCardAccountForm.processorName.trim() || 'Stripe / TPV Visa & Mastercard',
      paymentLinkUrl: newCardAccountForm.paymentLinkUrl.trim(),
    };
    const updated = {
      ...payoutConfig,
      selectedCardAccountId: newAcc.id,
      cardAccounts: [...payoutConfig.cardAccounts, newAcc],
    };
    savePayoutConfigToStorage(updated);
    setNewCardAccountForm({
      alias: '',
      holderName: '',
      ibanOrAccount: '',
      processorName: 'Stripe / TPV Visa & Mastercard',
      paymentLinkUrl: '',
    });
    showToast('Nueva cuenta para Visa/Mastercard añadida y guardada en la nube.');
  };

  // ==========================================================================
  // FILTRADO DE CATÁLOGO Y PRESUPUESTO DE ENCARGOS
  // ==========================================================================
  const filteredLiveries = useMemo(() => {
    return liveries
      .filter((item) => {
        const matchesCat =
          selectedCategory === 'Todos' || item.category === selectedCategory;
        const matchesRes =
          selectedResolution === 'Todas' || item.resolution === selectedResolution;
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.carModel.toLowerCase().includes(q) ||
          (item.carBaseMod && item.carBaseMod.toLowerCase().includes(q)) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));
        return matchesCat && matchesRes && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [liveries, selectedCategory, selectedResolution, searchQuery, sortBy]);

  const estimatedCommissionPrice = useMemo(() => {
    let total = 10;
    if (commissionForm.finishType === 'pbr_matte') total += 10;
    if (commissionForm.finishType === 'pbr_chrome') total += 18;
    if (commissionForm.resolution === '8K') total += 12;
    if (commissionForm.replicaOrOriginal === 'replica') total += 15;
    if (commissionForm.sponsorCount === 'many') total += 12;
    if (commissionForm.includeDriverKit) total += 10;
    if (commissionForm.rushDelivery) total += 20;
    return total;
  }, [commissionForm]);

  // ==========================================================================
  // FUNCIONES DE EDICIÓN, FOTOS Y ARCHIVOS .ZIP
  // ==========================================================================
  const openCreateModal = () => {
    setEditingLiveryId(null);
    setFormState({
      title: '',
      carModel: '',
      carBaseMod: 'Kunos / RSS / URD',
      category: 'GT3',
      price: 12.99,
      resolution: '4K',
      cspPbr: true,
      includesDriverSuit: true,
      includesNumberplates: true,
      featured: false,
      authorNote:
        'Incluye archivos .dds comprimidos en BC7, mapa de materiales PBR y ext_config.ini listo para instalar arrastrando a Content Manager.',
      tagsInput: 'GT3, CSP PBR, 4K, Ready to Race',
      images: [
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1400&q=85',
      ],
      newImageUrl: '',
      zipFileName: '',
      zipDownloadUrl: '',
      zipDataUrl: '',
      zipFileSize: '',
    });
    setIsEditorModalOpen(true);
  };

  const openEditModal = (livery, scrollToZip = false) => {
    setEditingLiveryId(livery.id);
    setFormState({
      title: livery.title || '',
      carModel: livery.carModel || '',
      carBaseMod: livery.carBaseMod || '',
      category: livery.category || 'GT3',
      price: livery.price ?? 12.99,
      resolution: livery.resolution || '4K',
      cspPbr: Boolean(livery.cspPbr),
      includesDriverSuit: Boolean(livery.includesDriverSuit),
      includesNumberplates: Boolean(livery.includesNumberplates),
      featured: Boolean(livery.featured),
      authorNote: livery.authorNote || '',
      tagsInput: Array.isArray(livery.tags) ? livery.tags.join(', ') : '',
      images: Array.isArray(livery.images) ? [...livery.images] : [],
      newImageUrl: '',
      zipFileName: livery.zipFileName || '',
      zipDownloadUrl: livery.zipDownloadUrl || '',
      zipDataUrl: livery.zipDataUrl || '',
      zipFileSize: livery.zipFileSize || '',
    });
    setIsEditorModalOpen(true);
    if (scrollToZip) {
      setTimeout(() => {
        zipSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  };

  const handleFileUploadInModal = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploadingPhoto(true);
    try {
      const compressedList = [];
      for (const file of files) {
        const dataUrl = await compressImageFile(file);
        compressedList.push(dataUrl);
      }
      setFormState((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedList],
      }));
      showToast(`${compressedList.length} foto(s) añadida(s) al proyecto.`);
    } catch (err) {
      showToast('No se pudo procesar la imagen seleccionada.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleZipFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingZip(true);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    if (file.size <= 15 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormState((prev) => ({
          ...prev,
          zipFileName: file.name,
          zipFileSize: sizeMB,
          zipDataUrl: ev.target.result,
        }));
        setIsUploadingZip(false);
        showToast(`Archivo "${file.name}" (${sizeMB}) cargado y listo.`);
      };
      reader.onerror = () => {
        setIsUploadingZip(false);
        showToast('Error al leer el archivo .ZIP.', 'error');
      };
      reader.readAsDataURL(file);
    } else {
      const tempBlobUrl = URL.createObjectURL(file);
      setFormState((prev) => ({
        ...prev,
        zipFileName: file.name,
        zipFileSize: sizeMB,
        zipDownloadUrl: prev.zipDownloadUrl || tempBlobUrl,
      }));
      setIsUploadingZip(false);
      showToast(`Archivo "${file.name}" (${sizeMB}) vinculado correctamente.`);
    }
  };

  const handleDownloadLiveryZip = (livery) => {
    const cleanFileName =
      livery.zipFileName && livery.zipFileName.trim() !== ''
        ? livery.zipFileName.trim()
        : `${(livery.id || 'livery_pack').replace(/[^a-z0-9_-]/gi, '_')}.zip`;

    if (livery.zipDataUrl) {
      const link = document.createElement('a');
      link.href = livery.zipDataUrl;
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Descargando ${cleanFileName}...`);
      return;
    }

    if (livery.zipDownloadUrl && livery.zipDownloadUrl.trim() !== '') {
      window.open(livery.zipDownloadUrl.trim(), '_blank', 'noopener,noreferrer');
      showToast(`Abriendo descarga de ${cleanFileName}...`);
      return;
    }

    const blob = buildFallbackAssettoZipBlob(livery);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast(`Descargando pack ${cleanFileName} listo para Content Manager.`);
  };

  const handleQuickAddPhotoToSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedLivery) return;

    setIsUploadingPhoto(true);
    try {
      const newPhotos = [];
      for (const file of files) {
        const compressed = await compressImageFile(file);
        newPhotos.push(compressed);
      }
      const updatedLivery = {
        ...selectedLivery,
        images: [...(selectedLivery.images || []), ...newPhotos],
      };
      await saveLiveryToStorage(updatedLivery);
      setActiveImageIndex(updatedLivery.images.length - 1);
      showToast('Nuevas fotos subidas directamente a la galería del proyecto.');
    } catch {
      showToast('Error al subir la foto.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (detailFileInputRef.current) detailFileInputRef.current.value = '';
    }
  };

  const handleQuickAddUrlToSelected = async () => {
    if (!quickPhotoUrl.trim() || !selectedLivery) return;
    const updatedLivery = {
      ...selectedLivery,
      images: [...(selectedLivery.images || []), quickPhotoUrl.trim()],
    };
    await saveLiveryToStorage(updatedLivery);
    setQuickPhotoUrl('');
    setActiveImageIndex(updatedLivery.images.length - 1);
    showToast('Imagen añadida por URL a la galería.');
  };

  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.carModel.trim()) {
      showToast('Completa al menos el título del proyecto y el modelo de coche.', 'error');
      return;
    }

    const parsedTags = formState.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const existingObj = liveries.find((l) => l.id === editingLiveryId);
    const liveryObject = {
      id: editingLiveryId || `ac-livery-${Date.now()}`,
      title: formState.title.trim(),
      carModel: formState.carModel.trim(),
      carBaseMod: formState.carBaseMod.trim() || 'Kunos / Custom Mod',
      category: formState.category,
      price: parseFloat(formState.price) || 0,
      resolution: formState.resolution,
      cspPbr: formState.cspPbr,
      includesDriverSuit: formState.includesDriverSuit,
      includesNumberplates: formState.includesNumberplates,
      featured: formState.featured,
      downloads: existingObj ? existingObj.downloads : 1,
      authorNote: formState.authorNote.trim(),
      tags: parsedTags.length ? parsedTags : ['Assetto Corsa', formState.category],
      zipFileName:
        formState.zipFileName.trim() ||
        `${(editingLiveryId || 'skin_pack').replace(/[^a-z0-9_-]/gi, '_')}.zip`,
      zipDownloadUrl: formState.zipDownloadUrl.trim(),
      zipDataUrl: formState.zipDataUrl || '',
      zipFileSize: formState.zipFileSize || 'Listo para CM',
      images:
        formState.images.length > 0
          ? formState.images
          : [
              'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
            ],
      createdAt: existingObj ? existingObj.createdAt : Date.now(),
    };

    await saveLiveryToStorage(liveryObject);
    setIsEditorModalOpen(false);
    showToast(
      editingLiveryId
        ? 'Proyecto actualizado correctamente.'
        : 'Nuevo proyecto publicado en el catálogo.'
    );
  };

  // ==========================================================================
  // CARRITO Y PROCESO DE PAGO (PAYPAL / VISA & MASTERCARD)
  // ==========================================================================
  const addToCart = (livery) => {
    if (cart.some((item) => item.id === livery.id)) {
      setIsCartOpen(true);
      showToast('Esta livery ya está en tu carrito.', 'info');
      return;
    }
    setCart((prev) => [...prev, livery]);
    showToast(`"${livery.title}" añadida al carrito.`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price || 0), 0),
    [cart]
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!buyerEmail.trim()) {
      showToast('Introduce tu email para enviarte el recibo y acceso al .ZIP', 'error');
      return;
    }

    if (selectedPaymentMethod === 'card') {
      const digits = cardForm.cardNumber.replace(/\D/g, '');
      if (digits.length < 12 || !cardForm.cardExpiry.trim() || !cardForm.cardCvc.trim()) {
        showToast('Completa los datos de tu tarjeta Visa o Mastercard.', 'error');
        return;
      }
    }

    setIsProcessingPayment(true);
    const destinationSummary =
      selectedPaymentMethod === 'paypal'
        ? `PayPal: ${activePaypalAccount.email} (${activePaypalAccount.alias})`
        : `${detectCardBrand(cardForm.cardNumber)} → ${activeCardAccount.ibanOrAccount} (${activeCardAccount.alias})`;

    setTimeout(() => {
      const purchasedItems = [...cart];
      const newOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        buyerEmail: buyerEmail.trim(),
        buyerDiscord: buyerDiscord.trim(),
        items: purchasedItems,
        total: cartTotal,
        paymentMethod:
          selectedPaymentMethod === 'paypal'
            ? 'PayPal'
            : detectCardBrand(cardForm.cardNumber),
        destinationAccount: destinationSummary,
        createdAt: Date.now(),
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCheckoutSuccess(newOrder);
      setIsProcessingPayment(false);
      setCart([]);
      showToast('¡Pago completado! Ya puedes descargar tus archivos .ZIP.');
    }, 900);
  };

  // ==========================================================================
  // ENVÍO DE ENCARGO PERSONALIZADO
  // ==========================================================================
  const handleSendCommission = (e) => {
    e.preventDefault();
    if (!commissionForm.clientName.trim() || !commissionForm.discordOrEmail.trim()) {
      showToast('Indica tu nombre y tu usuario de Discord o Email.', 'error');
      return;
    }
    const newComm = {
      id: `comm-${Date.now()}`,
      ...commissionForm,
      estimatedPrice: estimatedCommissionPrice,
      status: 'Pendiente de revisión',
      createdAt: Date.now(),
    };
    setCommissions((prev) => [newComm, ...prev]);
    setCommissionSentMessage(true);
    showToast('Solicitud de encargo enviada al estudio.');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* NOTIFICACIÓN TOAST FLOTANTE */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl backdrop-blur-md">
          <CheckCircle2
            className={`w-5 h-5 shrink-0 ${
              toast.type === 'error'
                ? 'text-red-500'
                : toast.type === 'info'
                ? 'text-sky-400'
                : 'text-emerald-400'
            }`}
          />
          <span className="text-sm font-medium text-zinc-100">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-zinc-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN PRINCIPAL */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090a0f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo del Estudio */}
          <div
            onClick={() => setActiveTab('catalogo')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-600/25 group-hover:scale-105 transition">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-lg text-white">
                  APEX<span className="text-red-500">WORKS</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700">
                  AC Livery Studio
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Custom Shaders Patch PBR • 4K & 8K Skins • Content Manager Ready
              </p>
            </div>
          </div>

          {/* Pestañas Centrales */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('catalogo')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'catalogo'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Catálogo ({liveries.length})
            </button>
            <button
              onClick={() => setActiveTab('encargos')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'encargos'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Encargos a Medida
            </button>
            <button
              onClick={() =>
                requestOwnerAccess(() => {
                  setActiveTab('admin');
                })
              }
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {isOwnerUnlocked ? (
                <Settings className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              Panel Propietario
            </button>
          </nav>

          {/* Acciones Derecha: Modo Editor + Carrito */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (isAdminMode && isOwnerUnlocked) {
                  setIsAdminMode(false);
                  showToast('Modo Vista Cliente activado', 'info');
                } else {
                  requestOwnerAccess(() => {
                    setIsAdminMode(true);
                  });
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                isAdminMode && isOwnerUnlocked
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Desbloquea los botones para subir más fotos, gestionar archivos .ZIP o configurar tus cuentas de cobro"
            >
              {isAdminMode && isOwnerUnlocked ? (
                <Edit3 className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
              {isAdminMode && isOwnerUnlocked
                ? 'Modo Editor: ON'
                : 'Acceso Propietario'}
            </button>

            {isOwnerUnlocked && (
              <button
                onClick={handleLockOwnerPanel}
                className="px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-amber-300 flex items-center gap-1"
                title="Cerrar sesión de propietario para que nadie vea tus cuentas de cobro"
              >
                <Lock className="w-3.5 h-3.5" />
                Bloquear
              </button>
            )}

            <button
              onClick={() => {
                setCheckoutSuccess(null);
                setIsCartOpen(true);
              }}
              className="relative px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 flex items-center gap-2 transition"
            >
              <ShoppingCart className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* ====================================================================
            PESTAÑA 1: CATÁLOGO Y TIENDA DE LIVERIES
        ==================================================================== */}
        {activeTab === 'catalogo' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-10">
              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" /> Compatible con Assetto Corsa & Content Manager
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Diseños & Liveries <span className="text-red-500">PBR 4K/8K</span> Listos para Pista
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Explora nuestra colección de skins para GT3, Rally, Drift y Fórmula con mapas de reflexión reales, fibra de carbono expuesta y descarga inmediata en formato{' '}
                  <code className="text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded">.ZIP</code>.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('encargos')}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Pedir Livery Personalizada
                  </button>
                  {isOwnerUnlocked && (
                    <button
                      onClick={openCreateModal}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Subir Nuevo Proyecto / Fotos
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800/90">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-zinc-950/70 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar Porsche, RSS, Rally, GT3..."
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                >
                  <option value="Todas">Resolución: Todas</option>
                  <option value="4K">Calidad 4K</option>
                  <option value="8K">Ultra 8K</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                >
                  <option value="featured">Destacados</option>
                  <option value="newest">Más recientes</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </div>
            </div>

            {/* Cuadrícula de Proyectos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLiveries.map((livery) => (
                <div
                  key={livery.id}
                  className="group bg-zinc-900/80 border border-zinc-800/90 hover:border-red-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-lg"
                >
                  <div>
                    <div
                      onClick={() => {
                        setSelectedLivery(livery);
                        setActiveImageIndex(0);
                      }}
                      className="relative h-56 bg-zinc-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={livery.images?.[0]}
                        alt={livery.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase">
                          {livery.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-zinc-950/90 border border-zinc-700 text-zinc-200 text-[11px] font-bold">
                          {livery.resolution}
                        </span>
                        {livery.cspPbr && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                            CSP PBR
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg bg-zinc-950/90 border border-zinc-800 text-white font-black text-sm">
                          {Number(livery.price).toFixed(2)} €
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 text-zinc-300 text-xs flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                          {livery.images?.length || 1} fotos
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="text-xs text-zinc-400 font-medium">
                        {livery.carModel} • <span className="text-zinc-500">{livery.carBaseMod}</span>
                      </div>
                      <h3
                        onClick={() => {
                          setSelectedLivery(livery);
                          setActiveImageIndex(0);
                        }}
                        className="text-lg font-bold text-white group-hover:text-red-400 transition cursor-pointer line-clamp-1"
                      >
                        {livery.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {livery.authorNote}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(livery)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Comprar ({Number(livery.price).toFixed(2)} €)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLivery(livery);
                          setActiveImageIndex(0);
                        }}
                        className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                        title="Ver galería completa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {isAdminMode && isOwnerUnlocked && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                        <button
                          onClick={() => openEditModal(livery, false)}
                          className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Editar / Fotos
                        </button>
                        <button
                          onClick={() => openEditModal(livery, true)}
                          className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1"
                        >
                          <FolderArchive className="w-3.5 h-3.5" />
                          Archivo .ZIP
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 2: COTIZADOR DE ENCARGOS A MEDIDA
        ==================================================================== */}
        {activeTab === 'encargos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Configura tu Encargo Personalizado (Assetto Corsa)
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Diseñamos réplicas históricas o liveries 100% originales para tu equipo de SimRacing o campeonato.
                </p>
              </div>

              {commissionSentMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between">
                  <span>
                    ¡Solicitud enviada! Revisaremos los detalles y te contactaremos por Discord/Email.
                  </span>
                  <button
                    onClick={() => setCommissionSentMessage(false)}
                    className="text-xs underline ml-3"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <form onSubmit={handleSendCommission} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Tu Nombre / Equipo
                    </label>
                    <input
                      type="text"
                      value={commissionForm.clientName}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, clientName: e.target.value })
                      }
                      placeholder="Ej. Team Iberia SimRacing"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Discord o Email de contacto
                    </label>
                    <input
                      type="text"
                      value={commissionForm.discordOrEmail}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          discordOrEmail: e.target.value,
                        })
                      }
                      placeholder="usuario#0000 o correo@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Coche / Mod en Assetto Corsa
                    </label>
                    <input
                      type="text"
                      value={commissionForm.carModName}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, carModName: e.target.value })
                      }
                      placeholder="Ej. Skoda Fabia RS Rally2 / Porsche 992 GT3"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Categoría / Disciplina
                    </label>
                    <select
                      value={commissionForm.category}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    >
                      {CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Acabado de Materiales (CSP PBR)
                    </label>
                    <select
                      value={commissionForm.finishType}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, finishType: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    >
                      <option value="standard">Pintura Estándar Gloss</option>
                      <option value="pbr_matte">PBR Mate + Carbono (+10 €)</option>
                      <option value="pbr_chrome">PBR Cromado / Metálico Flake (+18 €)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Resolución del .DDS
                    </label>
                    <select
                      value={commissionForm.resolution}
                      onChange={(e) =>
                        setCommissionForm({ ...commissionForm, resolution: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                    >
                      <option value="4K">4K (4096 x 4096 px)</option>
                      <option value="8K">8K Ultra (8192 x 8192 px) (+12 €)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Notas, colores corporativos y logos que deseas incluir
                  </label>
                  <textarea
                    rows={3}
                    value={commissionForm.referenceNotes}
                    onChange={(e) =>
                      setCommissionForm({
                        ...commissionForm,
                        referenceNotes: e.target.value,
                      })
                    }
                    placeholder="Describe los colores, dorsales, patrocinadores o ideas..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Solicitud de Encargo ({estimatedCommissionPrice} € est.)
                </button>
              </form>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-bold text-white">Presupuesto Estimado</h3>
              <div className="text-4xl font-black text-red-500">
                {estimatedCommissionPrice}.00 €
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Incluye entrega en archivo <strong>.ZIP</strong> listo para arrastrar y soltar en Content Manager, archivo <code>ext_config.ini</code> y vista previa en el showroom.
              </p>
            </div>
          </div>
        )}

        {/* ====================================================================
            PESTAÑA 3: PANEL PROPIETARIO (PROYECTOS, CUENTAS DE COBRO Y VENTAS)
        ==================================================================== */}
        {activeTab === 'admin' && isOwnerUnlocked && (
          <div className="space-y-6">
            {/* Selector Rápido de Cuentas Destino en Vivo */}
            <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <Lock className="w-3.5 h-3.5" /> Panel Privado del Propietario (Oculto al público)
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Gestión de Proyectos, Archivos .ZIP y Cuentas de Cobro
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1 sm:flex-initial">
                  <label className="block text-[10px] uppercase text-sky-400 font-bold">
                    PayPal Destino Activo
                  </label>
                  <select
                    value={payoutConfig.selectedPaypalId}
                    onChange={(e) =>
                      savePayoutConfigToStorage({
                        ...payoutConfig,
                        selectedPaypalId: e.target.value,
                      })
                    }
                    className="bg-transparent text-xs text-white font-semibold focus:outline-none mt-0.5"
                  >
                    {payoutConfig.paypalAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id} className="bg-zinc-900">
                        {acc.alias} ({acc.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex-1 sm:flex-initial">
                  <label className="block text-[10px] uppercase text-amber-400 font-bold">
                    Cuenta Visa / Mastercard Activa
                  </label>
                  <select
                    value={payoutConfig.selectedCardAccountId}
                    onChange={(e) =>
                      savePayoutConfigToStorage({
                        ...payoutConfig,
                        selectedCardAccountId: e.target.value,
                      })
                    }
                    className="bg-transparent text-xs text-white font-semibold focus:outline-none mt-0.5"
                  >
                    {payoutConfig.cardAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id} className="bg-zinc-900">
                        {acc.alias} ({acc.ibanOrAccount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-navegación del Panel Propietario */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAdminSubTab('proyectos')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    adminSubTab === 'proyectos'
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  1. Mis Liveries y Archivos .ZIP ({liveries.length})
                </button>
                <button
                  onClick={() => setAdminSubTab('cuentas')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    adminSubTab === 'cuentas'
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  2. Cuentas de Cobro (PayPal / Visa & Mastercard)
                </button>
                <button
                  onClick={() => setAdminSubTab('ventas')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    adminSubTab === 'ventas'
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  3. Ventas y Encargos ({orders.length + commissions.length})
                </button>
              </div>

              <button
                onClick={openCreateModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuevo Proyecto Livery
              </button>
            </div>

            {/* SUB-PESTAÑA 1: PROYECTOS Y SUBIDA DE .ZIP */}
            {adminSubTab === 'proyectos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveries.map((item) => {
                  const hasCustomZip = Boolean(item.zipDataUrl || item.zipDownloadUrl);
                  return (
                    <div
                      key={item.id}
                      className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5 w-full sm:w-auto">
                        <img
                          src={item.images?.[0]}
                          alt={item.title}
                          className="w-20 h-16 rounded-xl object-cover bg-zinc-950 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {item.category} • {Number(item.price).toFixed(2)} €
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-400">
                            {hasCustomZip
                              ? `ZIP propio: ${item.zipFileName}`
                              : `Pack autogenerado: ${item.zipFileName || 'skin.zip'}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => openEditModal(item, false)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                          Editar / Fotos
                        </button>
                        <button
                          onClick={() => openEditModal(item, true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-1.5"
                        >
                          <FolderArchive className="w-3.5 h-3.5" />
                          Subir .ZIP
                        </button>
                        <button
                          onClick={() => deleteLiveryFromStorage(item.id)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-red-600/20 text-zinc-400 hover:text-red-400"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SUB-PESTAÑA 2: CONFIGURACIÓN DE CUENTAS DE COBRO Y PIN */}
            {adminSubTab === 'cuentas' && (
              <div className="space-y-6">
                {/* Cambio de Contraseña / PIN */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newOwnerPinInput.trim()) {
                      showToast('Escribe tu nueva contraseña o PIN antes de guardar.', 'error');
                      return;
                    }
                    const updated = {
                      ...payoutConfig,
                      ownerPin: newOwnerPinInput.trim(),
                    };
                    savePayoutConfigToStorage(updated);
                    setNewOwnerPinInput('');
                    showToast('Contraseña / PIN guardada permanentemente en la nube y en memoria.');
                  }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      Contraseña / PIN Privado de Propietario
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Se sincroniza en la nube para que no se borre al recargar. Clave activa actual:{' '}
                      <span className="text-amber-300 font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {payoutConfig.ownerPin}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={newOwnerPinInput}
                      onChange={(e) => setNewOwnerPinInput(e.target.value)}
                      placeholder="Escribe tu nueva clave..."
                      className="flex-1 sm:w-48 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0"
                    >
                      Guardar PIN
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cuentas PayPal */}
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-sky-400" />
                      Cuentas Destino PayPal
                    </h3>

                    <div className="space-y-2">
                      {payoutConfig.paypalAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          onClick={() =>
                            savePayoutConfigToStorage({
                              ...payoutConfig,
                              selectedPaypalId: acc.id,
                            })
                          }
                          className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            payoutConfig.selectedPaypalId === acc.id
                              ? 'bg-sky-500/10 border-sky-500 text-white'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{acc.alias}</div>
                            <div className="text-xs text-sky-400">{acc.email}</div>
                          </div>
                          {payoutConfig.selectedPaypalId === acc.id && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500 text-zinc-950">
                              Recibiendo Pagos
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddPaypalAccount} className="space-y-3 pt-3 border-t border-zinc-800">
                      <div className="text-xs font-bold text-zinc-300">
                        Añadir otra cuenta de PayPal
                      </div>
                      <input
                        type="text"
                        placeholder="Alias (ej. PayPal Personal)"
                        value={newPaypalForm.alias}
                        onChange={(e) =>
                          setNewPaypalForm({ ...newPaypalForm, alias: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="email"
                        placeholder="Email de PayPal que recibirá el dinero"
                        value={newPaypalForm.email}
                        onChange={(e) =>
                          setNewPaypalForm({ ...newPaypalForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Enlace PayPal.me opcional (ej. https://paypal.me/tucuenta)"
                        value={newPaypalForm.paypalMeUrl}
                        onChange={(e) =>
                          setNewPaypalForm({
                            ...newPaypalForm,
                            paypalMeUrl: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs"
                      >
                        Guardar y Seleccionar Cuenta PayPal
                      </button>
                    </form>
                  </div>

                  {/* Cuentas Bancarias / Visa & Mastercard */}
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      Cuentas Destino Visa / Mastercard
                    </h3>

                    <div className="space-y-2">
                      {payoutConfig.cardAccounts.map((acc) => (
                        <div
                          key={acc.id}
                          onClick={() =>
                            savePayoutConfigToStorage({
                              ...payoutConfig,
                              selectedCardAccountId: acc.id,
                            })
                          }
                          className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            payoutConfig.selectedCardAccountId === acc.id
                              ? 'bg-amber-500/10 border-amber-500 text-white'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{acc.alias}</div>
                            <div className="text-xs text-amber-300">{acc.ibanOrAccount}</div>
                          </div>
                          {payoutConfig.selectedCardAccountId === acc.id && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-zinc-950">
                              Recibiendo Pagos
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddCardAccount} className="space-y-3 pt-3 border-t border-zinc-800">
                      <div className="text-xs font-bold text-zinc-300">
                        Añadir otra cuenta para pagos con Visa / Mastercard
                      </div>
                      <input
                        type="text"
                        placeholder="Alias (ej. Cuenta BBVA / Revolut / Stripe)"
                        value={newCardAccountForm.alias}
                        onChange={(e) =>
                          setNewCardAccountForm({
                            ...newCardAccountForm,
                            alias: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="IBAN o Identificador de Cuenta Destino"
                        value={newCardAccountForm.ibanOrAccount}
                        onChange={(e) =>
                          setNewCardAccountForm({
                            ...newCardAccountForm,
                            ibanOrAccount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Titular de la cuenta"
                        value={newCardAccountForm.holderName}
                        onChange={(e) =>
                          setNewCardAccountForm({
                            ...newCardAccountForm,
                            holderName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs"
                      >
                        Guardar y Seleccionar Cuenta Visa/Mastercard
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PESTAÑA 3: HISTORIAL DE VENTAS Y ENCARGOS */}
            {adminSubTab === 'ventas' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    Ventas Recibidas ({orders.length})
                  </h3>
                  {orders.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Aún no hay compras registradas.
                    </p>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold text-white">
                          <span>
                            {ord.id} — {ord.buyerEmail}
                          </span>
                          <span className="text-emerald-400">
                            +{Number(ord.total).toFixed(2)} €
                          </span>
                        </div>
                        <div className="text-zinc-400">
                          Método: <strong>{ord.paymentMethod}</strong> → {ord.destinationAccount}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    Solicitudes de Encargos ({commissions.length})
                  </h3>
                  {commissions.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      No hay solicitudes de encargos pendientes.
                    </p>
                  ) : (
                    commissions.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold text-white">
                          <span>
                            {c.clientName} ({c.category})
                          </span>
                          <span className="text-amber-400">{c.estimatedPrice} € est.</span>
                        </div>
                        <div className="text-zinc-400">
                          Coche: {c.carModName} | Contacto: {c.discordOrEmail}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================================
          MODAL VISOR DE DETALLE / GALERÍA Y SUBIDA RÁPIDA DE FOTOS
      ====================================================================== */}
      {selectedLivery && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-8">
            <div className="relative h-72 sm:h-96 bg-zinc-950">
              <img
                src={
                  selectedLivery.images?.[activeImageIndex] || selectedLivery.images?.[0]
                }
                alt={selectedLivery.title}
                className={`w-full h-full object-cover transition duration-500 ${
                  showroomLighting === 'night'
                    ? 'brightness-75 contrast-125'
                    : showroomLighting === 'rain'
                    ? 'saturate-150 contrast-110'
                    : ''
                }`}
              />
              <button
                onClick={() => setSelectedLivery(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/80 text-white hover:bg-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Controles de iluminación Showroom */}
              <div className="absolute bottom-4 left-4 flex gap-1.5 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800">
                {['day', 'night', 'rain'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setShowroomLighting(mode)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase ${
                      showroomLighting === mode
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode === 'day' ? 'Día' : mode === 'night' ? 'Noche' : 'Wet PBR'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Miniaturas de la galería */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {(selectedLivery.images || []).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                      activeImageIndex === idx ? 'border-red-500' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {isOwnerUnlocked && (
                  <>
                    <input
                      ref={detailFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleQuickAddPhotoToSelected}
                      className="hidden"
                    />
                    <button
                      onClick={() => detailFileInputRef.current?.click()}
                      className="px-3 h-14 rounded-xl border border-dashed border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-emerald-500/10"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploadingPhoto ? 'Subiendo...' : '+ Subir Foto'}
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase">
                    {selectedLivery.category} • {selectedLivery.carModel}
                  </span>
                  <h2 className="text-2xl font-black text-white">{selectedLivery.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white">
                    {Number(selectedLivery.price).toFixed(2)} €
                  </span>
                  <button
                    onClick={() => {
                      addToCart(selectedLivery);
                      setSelectedLivery(null);
                      setIsCartOpen(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Añadir al Carrito
                  </button>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {selectedLivery.authorNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL EDITOR / CREADOR DE LIVERY (FOTOS Y ARCHIVO .ZIP)
      ====================================================================== */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {editingLiveryId ? 'Editar Proyecto Livery' : 'Publicar Nueva Livery'}
              </h3>
              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Título de la Livery
                  </label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Modelo de Coche
                  </label>
                  <input
                    type="text"
                    value={formState.carModel}
                    onChange={(e) =>
                      setFormState({ ...formState, carModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Resolución
                  </label>
                  <select
                    value={formState.resolution}
                    onChange={(e) =>
                      setFormState({ ...formState, resolution: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    <option value="4K">4K</option>
                    <option value="8K">8K</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Descripción / Notas técnicas
                </label>
                <textarea
                  rows={2}
                  value={formState.authorNote}
                  onChange={(e) =>
                    setFormState({ ...formState, authorNote: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              {/* Galería de fotos */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">
                    Fotos del Proyecto ({formState.images.length})
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUploadInModal}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Subir Fotos desde tu PC/Móvil
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto py-1">
                  {formState.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="absolute top-0.5 right-0.5 bg-black/80 text-red-400 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archivo .ZIP de Entrega */}
              <div
                ref={zipSectionRef}
                className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <FolderArchive className="w-4 h-4" />
                    Archivo .ZIP de Entrega (Descarga al comprar)
                  </span>
                  <input
                    ref={zipFileInputRef}
                    type="file"
                    accept=".zip,.rar,.7z"
                    onChange={handleZipFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => zipFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
                  >
                    {isUploadingZip ? 'Cargando...' : 'Seleccionar .ZIP de tu PC'}
                  </button>
                </div>

                {formState.zipFileName && (
                  <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    Archivo listo: {formState.zipFileName} ({formState.zipFileSize || 'OK'})
                  </div>
                )}

                <input
                  type="text"
                  placeholder="O pega un enlace directo de Mega / Google Drive / MediaFire para packs 8K pesados"
                  value={formState.zipDownloadUrl}
                  onChange={(e) =>
                    setFormState({ ...formState, zipDownloadUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Guardar Cambios del Proyecto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL CARRITO Y PASARELA DE PAGO (VISA/MASTERCARD Y PAYPAL)
      ====================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                Tu Carrito de Descarga Instantánea
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                  <div className="font-bold text-sm text-white">
                    ¡Pago verificado! Pedido {checkoutSuccess.id}
                  </div>
                  <div>
                    Descarga tus paquetes <strong>.ZIP</strong> listos para Content Manager:
                  </div>
                </div>

                <div className="space-y-2.5">
                  {checkoutSuccess.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-zinc-400">
                          {item.zipFileName || 'skin_pack.zip'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadLiveryZip(item)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        Descargar .ZIP
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-sm text-zinc-400 py-8 text-center">
                Tu carrito está vacío. Añade cualquier livery del catálogo.
              </p>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-xs text-red-400">
                          {Number(item.price).toFixed(2)} €
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Tu Email para recibir el enlace de respaldo
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="piloto@simracing.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  />
                </div>

                {/* Selector de Método de Pago: Visa/Mastercard o PayPal */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    Visa / Mastercard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      selectedPaymentMethod === 'paypal'
                        ? 'bg-sky-500/15 border-sky-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-sky-400" />
                    PayPal
                  </button>
                </div>

                {selectedPaymentMethod === 'card' ? (
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Pago seguro con tarjeta</span>
                      <span className="font-bold text-amber-400">
                        {detectCardBrand(cardForm.cardNumber)}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Número de tarjeta Visa o Mastercard"
                      value={cardForm.cardNumber}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, cardNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardForm.cardExpiry}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, cardExpiry: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardForm.cardCvc}
                        onChange={(e) =>
                          setCardForm({ ...cardForm, cardCvc: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                    <div>
                      Pago directo a <strong>{activePaypalAccount.beneficiary}</strong>
                    </div>
                    {activePaypalAccount.paypalMeUrl && (
                      <a
                        href={activePaypalAccount.paypalMeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sky-400 underline font-semibold"
                      >
                        Abrir PayPal.me en nueva pestaña <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isProcessingPayment
                    ? 'Procesando pago...'
                    : `Pagar ${cartTotal.toFixed(2)} € y Descargar .ZIP`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL DE DESBLOQUEO POR PIN PARA PROPIETARIO
      ====================================================================== */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Acceso Privado del Propietario
              </h3>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              Introduce tu contraseña/PIN privado para subir fotos, gestionar archivos .ZIP o configurar tus cuentas de cobro.
            </p>
            <form onSubmit={handleVerifyOwnerPin} className="space-y-3">
              <input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Introduce tu PIN..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
              />
              {pinError && <p className="text-xs text-red-400">{pinError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Desbloquear Panel Propietario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}