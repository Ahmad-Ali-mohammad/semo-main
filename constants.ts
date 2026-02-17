import { Reptile, Order, Address, NotificationSettings } from './types';

export const MASCOT_IMAGE_URL = '/assets/photo_2026-02-04_07-13-35.jpg';

export const featuredReptiles: Reptile[] = [
  {
    id: 1,
    name: 'تنين ملتحٍ',
    species: 'Agamid (Bearded Dragon)',
    description: 'تنين ملتحٍ أليف وهادئ مناسب للمبتدئين، بصحة ممتازة وتغذية متوازنة.',
    price: 280,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 5.0,
    isAvailable: true,
    status: 'متوفر',
    category: 'lizard',
    specifications: [
      { label: 'العمر', value: '8 أشهر' },
      { label: 'الطول', value: '35 سم' },
      { label: 'الجنس', value: 'ذكر' }
    ],
    reviews: [
      { user: 'أحمد', rating: 5, comment: 'صحي ونشط، التغذية ممتازة.', date: '2024-05-10' },
      { user: 'ليلى', rating: 5, comment: 'سريع التأقلم وهادئ جداً.', date: '2024-05-15' }
    ]
  },
  {
    id: 2,
    name: 'بايثون كروي باستل',
    species: 'Ball Python',
    description: 'بايثون كروي أليف بعمر سنة، لون باستل نادر، معتاد على التعامل اليومي.',
    price: 350,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.9,
    isAvailable: true,
    status: 'متوفر',
    category: 'snake'
  },
  {
    id: 3,
    name: 'أبرة شوك مبدئية',
    species: 'Hedgehog',
    description: 'قنفذ صغير مميز، ملائم للهواة مع دليل عناية كامل.',
    price: 150,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.7,
    isAvailable: false,
    status: 'غير متوفر',
    category: 'lizard'
  },
  {
    id: 4,
    name: 'سلحفاة إفريقية (سولكاتا)',
    species: 'Sulcata Tortoise',
    description: 'سلحفاة قوية وصحية، مثالية للحدائق الواسعة، غذاء وأشعة UVB مرفقة بالتوصيات.',
    price: 420,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.9,
    isAvailable: true,
    status: 'متوفر',
    category: 'turtle'
  },
  {
    id: 5,
    name: 'جيكو فهد مرقط',
    species: 'Leopard Gecko',
    description: 'جيكو فهد هادئ، مثالي للمبتدئين، مع نمط نقطي واضح.',
    price: 110,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.8,
    isAvailable: true,
    status: 'متوفر',
    category: 'lizard'
  }
];

export const defaultSpecies = [
  'Agamid (Bearded Dragon)',
  'Ball Python',
  'Leopard Gecko',
  'Sulcata Tortoise',
  'Corn Snake',
  'Kingsnake',
  'Milk Snake',
  'Boa constrictor',
  'Blue Tongue Skink',
  'Crested Gecko'
];

export const defaultCategories = [
  { value: 'snake', label: 'ثعابين' },
  { value: 'lizard', label: 'سحالي' },
  { value: 'turtle', label: 'سلاحف' },
  { value: 'amphibian', label: 'برمائيات' },
  { value: 'invertebrate', label: 'لافقاريات' }
];

export const mockAddresses: Address[] = [
  {
    id: 1,
    label: 'المنزل',
    street: 'شارع بغداد 12',
    city: 'دمشق',
    country: 'سوريا',
    isDefault: true
  },
  {
    id: 2,
    label: 'العمل',
    street: 'شارع الثورة 45',
    city: 'دمشق',
    country: 'سوريا',
    isDefault: false
  }
];

export const mockOrders: Order[] = [
  {
    id: 'RH-9821',
    date: '2024-05-15',
    status: 'تم التأكيد',
    total: 390,
    items: [
      { reptileId: 2, name: 'بايثون كروي - باستل', quantity: 1, price: 350, imageUrl: MASCOT_IMAGE_URL },
      { reptileId: 5, name: 'جيكو فهد مرقط - مستلزمات', quantity: 1, price: 40, imageUrl: MASCOT_IMAGE_URL }
    ],
    paymentVerificationStatus: 'قيد المراجعة'
  },
  {
    id: 'RH-1025',
    date: '2024-05-20',
    status: 'قيد المعالجة',
    total: 150,
    items: [
      { reptileId: 3, name: 'أبرة شوك مبدئية', quantity: 1, price: 150, imageUrl: MASCOT_IMAGE_URL }
    ],
    paymentVerificationStatus: 'مقبول'
  }
];

export const hierarchicalSpecies = [
  {
    mainCategoryArabic: 'ثعابين',
    categoryValue: 'snake',
    subspecies: ['Ball Python', 'Corn Snake', 'Kingsnake', 'Milk Snake', 'Boa constrictor']
  },
  {
    mainCategoryArabic: 'سحالي',
    categoryValue: 'lizard',
    subspecies: ['Agamid (Bearded Dragon)', 'Leopard Gecko', 'Blue Tongue Skink', 'Crested Gecko']
  },
  {
    mainCategoryArabic: 'سلاحف',
    categoryValue: 'turtle',
    subspecies: ['Sulcata Tortoise']
  }
];

export const mockNotificationSettings: NotificationSettings = {
  orders: true,
  promotions: true,
  system: false,
  messages: true
};

