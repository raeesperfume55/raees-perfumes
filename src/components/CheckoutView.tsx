import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CheckCircle2, Truck, ShieldCheck, Smartphone } from 'lucide-react';
import { addOrder } from '../firebase/db';
import { INITIAL_STORE_SETTINGS } from '../firebase/seedData';

interface CheckoutViewProps {
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBackToShop }) => {
  const { cartItems, cartSubtotal, shippingFee, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        notes: formData.notes,
        paymentMethod:
          paymentMethod === 'cod' ? 'Cash on Delivery' : 'JazzCash',
        items: cartItems,
        totalAmount: cartTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const itemLines = cartItems
        .map((i) => `- ${i.name} x${i.quantity} (Rs. ${(i.price * i.quantity).toLocaleString()})`)
        .join('\n');
      setWaMessage(
        `Hello Raees, I have placed an order on your website.\n\n` +
          `Name: ${formData.fullName}\n` +
          `Phone: ${formData.phone}\n` +
          `Address: ${formData.address}, ${formData.city}\n\n` +
          `${itemLines}\n\n` +
          `Delivery: Rs. ${shippingFee.toLocaleString()}\n` +
          `Total: Rs. ${cartTotal.toLocaleString()}\n` +
          `Payment: ${orderData.paymentMethod}\n\n` +
          `Please confirm my order.`
      );

      await addOrder(orderData);
      clearCart();
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('We could not place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-20 h-20 mx-auto flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white">Order Placed!</h2>
        <p className="text-gray-400 text-sm">
          Thank you! Your order has been received. Please tap the button below to confirm it with us on WhatsApp. Your order will be processed once confirmed.
        </p>
        <a
          href={`https://wa.me/${INITIAL_STORE_SETTINGS.whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-6 py-3 bg-[#25D366] text-black font-bold rounded-xl hover:brightness-110 transition-all"
        >
          Confirm Order on WhatsApp
        </a>
        <button
          onClick={onBackToShop}
          className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#b8952b] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Customer Details & Payment */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-[#12141d] p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="font-semibold text-white text-base">Shipping Address</h3>
            
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#1a1d2b] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#1a1d2b] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (03xxxxxxxxx) *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#1a1d2b] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Complete Address *"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#1a1d2b] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
              <input
                type="text"
                required
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#1a1d2b] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Payment Option */}
          <div className="bg-[#12141d] p-6 rounded-2xl border border-gray-800 space-y-3">
            <h3 className="font-semibold text-white text-base">Payment Method</h3>

            <div
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                paymentMethod === 'cod' ? 'border-[#d4af37]/40 bg-[#1a1d2b]' : 'border-gray-800 bg-[#161824]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#d4af37]"
                />
                <label htmlFor="cod" className="text-sm font-medium text-white cursor-pointer">
                  Cash on Delivery (COD)
                </label>
              </div>
              <Truck className="w-5 h-5 text-[#d4af37]" />
            </div>

            <div
              onClick={() => setPaymentMethod('jazzcash')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                paymentMethod === 'jazzcash' ? 'border-[#d4af37]/40 bg-[#1a1d2b]' : 'border-gray-800 bg-[#161824]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="jazzcash"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="accent-[#d4af37]"
                />
                <label htmlFor="jazzcash" className="text-sm font-medium text-white cursor-pointer">
                  JazzCash
                </label>
              </div>
              <Smartphone className="w-5 h-5 text-[#d4af37]" />
            </div>

            {paymentMethod === 'jazzcash' && (
              <div className="rounded-xl border border-[#d4af37]/30 bg-[#161824] p-4 space-y-2 text-xs text-gray-300">
                <p className="font-semibold text-[#eed78a] text-sm">Pay via JazzCash</p>
                <p>
                  Send <span className="text-white font-semibold">Rs. {cartTotal.toLocaleString()}</span> to JazzCash number:
                </p>
                <p className="text-base font-bold text-white tracking-wider">{INITIAL_STORE_SETTINGS.whatsAppNumber}</p>
                <p className="text-gray-400">
                  After sending, place your order and share the payment screenshot with us on WhatsApp. We will confirm and dispatch your order.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full py-4 bg-gradient-to-r from-[#8a702c] via-[#d4af37] to-[#8a702c] text-black font-bold rounded-xl shadow-lg hover:brightness-110 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Order...' : 'Complete Order'}
          </button>

        </form>

        {/* Order Summary Right Box */}
        <div className="lg:col-span-5 bg-[#12141d] p-6 rounded-2xl border border-gray-800 h-fit space-y-4">
          <h3 className="font-semibold text-white text-base border-b border-gray-800 pb-3">Order Summary</h3>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-[#eed78a]">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-3 space-y-1.5 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee.toLocaleString()}`}</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-3 flex justify-between text-base font-bold text-[#d4af37]">
            <span>Total:</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Safe & Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};