import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Product, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from './seedData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';

const LOCAL_PRODUCTS_KEY = 'raees_local_products_cache';
const LOCAL_ORDERS_KEY = 'raees_local_orders_cache';

// Helper to get local cache
function getLocalProducts(): Product[] {
  try {
    const saved = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Local cache read error:', e);
  }
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Local cache save error:', e);
  }
}

function getLocalOrders(): Order[] {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Local orders read error:', e);
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Local orders save error:', e);
  }
}

/**
 * Seed initial products to Firestore if collection is empty
 */
export async function seedProductsIfEmpty(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.log('Seeding initial Raees luxury products to Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        const prodDocRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        await setDoc(prodDocRef, {
          ...prod,
          createdAt: Timestamp.now(),
        });
      }
      saveLocalProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    } else {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          ...(data as Product),
          id: docSnap.id,
        });
      });
      saveLocalProducts(items);
      return items;
    }
  } catch (error) {
    console.warn('Firestore seed/fetch fallback to local cache:', error);
    return getLocalProducts();
  }
}

/**
 * Fetch all products
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return await seedProductsIfEmpty();
    }

    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        ...(docSnap.data() as Product),
        id: docSnap.id,
      });
    });

    saveLocalProducts(items);
    return items;
  } catch (error) {
    console.warn('Firestore fetch failed, returning local cache:', error);
    return getLocalProducts();
  }
}

/**
 * Subscribe to real-time products
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      productsRef,
      (snapshot) => {
        if (snapshot.empty) {
          seedProductsIfEmpty().then(callback);
        } else {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            items.push({
              ...(docSnap.data() as Product),
              id: docSnap.id,
            });
          });
          saveLocalProducts(items);
          callback(items);
        }
      },
      (error) => {
        console.warn('Snapshot listener error, returning cache:', error);
        callback(getLocalProducts());
      }
    );
  } catch (error) {
    console.warn('Error setting up snapshot:', error);
    callback(getLocalProducts());
    return () => {};
  }
}

/**
 * Add a new product
 */
export async function addProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const prodId = product.id || `raees-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newProduct: Product = {
    ...product,
    id: prodId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, prodId);
    await setDoc(docRef, {
      ...newProduct,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.warn('Firestore add product failed, storing locally:', error);
  }

  // Update local cache
  const localList = getLocalProducts();
  const updated = [newProduct, ...localList.filter((p) => p.id !== prodId)];
  saveLocalProducts(updated);

  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.warn('Firestore update product failed, updating locally:', error);
  }

  const localList = getLocalProducts();
  const updated = localList.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveLocalProducts(updated);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete product failed, removing locally:', error);
  }

  const localList = getLocalProducts();
  const updated = localList.filter((p) => p.id !== id);
  saveLocalProducts(updated);
}

/**
 * Create a new customer order
 */
export async function createOrder(orderData: any): Promise<Order> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `RAEES-${new Date().getFullYear()}-${randomSuffix}`;
  const orderId = `ord-${Date.now()}-${randomSuffix}`;

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, {
      ...newOrder,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.warn('Firestore order creation failed, persisting in local order list:', error);
  }

  const localOrders = getLocalOrders();
  saveLocalOrders([newOrder, ...localOrders]);

  return newOrder;
}

// Export addOrder alias so CheckoutView imports work seamlessly
export const addOrder = createOrder;

/**
 * Fetch all orders for Admin
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersRef);

    if (snapshot.empty) {
      return getLocalOrders();
    }

    const items: Order[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        ...(data as Order),
        id: docSnap.id,
      });
    });

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    saveLocalOrders(items);
    return items;
  } catch (error) {
    console.warn('Firestore fetch orders failed, using local orders:', error);
    return getLocalOrders();
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: Order['orderStatus'],
  paymentStatus?: Order['paymentStatus']
): Promise<void> {
  const updatePayload: any = { orderStatus };
  if (paymentStatus) {
    updatePayload.paymentStatus = paymentStatus;
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.warn('Firestore update order status failed, updating locally:', error);
  }

  const localOrders = getLocalOrders();
  const updated = localOrders.map((ord) =>
    ord.id === orderId ? { ...ord, ...updatePayload } : ord
  );
  saveLocalOrders(updated);
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete order failed, removing locally:', error);
  }

  const localOrders = getLocalOrders();
  saveLocalOrders(localOrders.filter((o) => o.id !== orderId));
}

/**
 * Store settings
 */
export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StoreSettings;
    }
  } catch (e) {
    console.warn('Settings fetch error:', e);
  }
  return INITIAL_STORE_SETTINGS;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'general');
    await setDoc(docRef, settings, { merge: true });
  } catch (e) {
    console.warn('Settings update error:', e);
  }
}