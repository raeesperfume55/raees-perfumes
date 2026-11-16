export interface FragranceNote {
  name: string;
  category: 'top' | 'heart' | 'base';
}

export interface BottleSize {
  size: string; // e.g. "50ml",
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice?: number;
  description: string;
  story?: string;
  images: string[];
  sizes: BottleSize[];
  selectedSize?: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: '8-10 Hours' | '10-14 Hours' | '14+ Hours' | '24h Beast Mode';
  sillage: 'Moderate' | 'Strong' | 'Intense' | 'Royal Aura';
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt?: any;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  productId: string;
  name: string;
  tagline: string;
  image: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  category: 'men' | 'women' | 'unisex';
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'card' | 'whatsapp';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: any;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsAppNumber: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  shippingFee: number;
  announcement: string;
  enableCod: boolean;
  enableJazzCash: boolean;
  enableEasyPaisa: boolean;
  enableCard: boolean;
}
