import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, PromoCode } from '../types';
import { PROMO_CODES, INITIAL_STORE_SETTINGS } from '../firebase/seedData';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'raees_luxury_cart';
const PROMO_STORAGE_KEY = 'raees_luxury_promo';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Cart persistence error:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Promo persistence error:', e);
    }
  }, [appliedPromo]);

  const addToCart = (product: Product, selectedSize?: string, quantity: number = 1) => {
    // Resolve size and price
    const sizeObj = selectedSize
      ? product.sizes.find((s) => s.size === selectedSize)
      : product.sizes[0];
    const sizeName = sizeObj ? sizeObj.size : product.sizes[0]?.size || '100ml';
    const itemPrice = sizeObj ? sizeObj.price : product.price;
    const originalPrice = sizeObj?.originalPrice || product.originalPrice;

    const cartItemId = `${product.id}-${sizeName}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        tagline: product.tagline,
        image: product.images[0] || '',
        size: sizeName,
        price: itemPrice,
        originalPrice,
        quantity,
        category: product.category,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const applyPromoCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code === trimmed && p.isActive);

    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "RAEES10"' };
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `This code requires a minimum spend of Rs. ${found.minSpend.toLocaleString()}`,
      };
    }

    setAppliedPromo(found);
    return {
      success: true,
      message: `Code "${found.code}" applied: ${found.discountPercent}% discount!`,
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const discountAmount = appliedPromo
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const freeShippingThreshold = INITIAL_STORE_SETTINGS.freeShippingThreshold;
  const shippingFee =
    cartSubtotal === 0 || cartSubtotal >= freeShippingThreshold
      ? 0
      : INITIAL_STORE_SETTINGS.shippingFee;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
