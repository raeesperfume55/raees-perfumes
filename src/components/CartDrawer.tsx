import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { INITIAL_STORE_SETTINGS } from '../firebase/seedData';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
}) => {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = INITIAL_STORE_SETTINGS.freeShippingThreshold;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleWhatsAppCartOrder = () => {
    const lines = cartItems.map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (${item.size}) x ${item.quantity} = Rs. ${(
          item.price * item.quantity
        ).toLocaleString()}`
    );
    const text = `👑 *NEW RAEES CONCIERGE ORDER INQUIRY*\n\n` +
      `Items:\n${lines.join('\n')}\n\n` +
      `Subtotal: Rs. ${cartSubtotal.toLocaleString()}\n` +
      (discountAmount > 0 ? `Discount: -Rs. ${discountAmount.toLocaleString()} (${appliedPromo?.code})\n` : '') +
      `Shipping: ${shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee.toLocaleString()}`}\n` +
      `*Estimated Total: Rs. ${cartTotal.toLocaleString()}*\n\n` +
      `Please confirm stock availability and shipping address!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${INITIAL_STORE_SETTINGS.whatsAppNumber.replace(/\+/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#0c0e15] border-l border-[#d4af37]/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#11131c]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Shopping Bag ({cartCount})
              </h3>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cash on Delivery Banner */}
          <div className="bg-[#151722] px-5 py-3 border-b border-gray-800 text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Cash on Delivery Available
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#161824] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">Your bag is empty</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Discover our collection of regal extrait perfumes and add an olfactory masterpiece to your bag.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-lg gold-gradient-bg text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-[#12141d] border border-gray-800/80 group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#090a0f] shrink-0 border border-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate font-serif">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#eed78a] font-mono mt-0.5">
                      {item.size}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-[#181a26] border border-gray-700 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-white font-serif">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-800 bg-[#10121a] space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-gray-800">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-200">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                  <span>Total Amount</span>
                  <span className="text-[#eed78a] font-serif text-base">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  id="checkout-proceed-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 rounded-lg gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCartOrder}
                  className="w-full py-2.5 rounded-lg bg-[#141620] hover:bg-[#1a1d2c] border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Fast WhatsApp Concierge Order</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>SSL Encrypted Checkout • Cash on Delivery Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};