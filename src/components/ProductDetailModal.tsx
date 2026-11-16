import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Star,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Flame,
  Wind,
  Clock,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { INITIAL_STORE_SETTINGS } from '../firebase/seedData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onWhatsAppInquiry: (product: Product, selectedSize: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onWhatsAppInquiry,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0]?.size || '100ml'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentSizeObj =
    product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const originalPrice = currentSizeObj?.originalPrice || product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-4xl bg-[#0e1017] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-[#1a1d2b] border border-gray-700 text-gray-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-[#12141d] flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800">
            <div>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#d4af37]/20 shadow-inner bg-[#0b0c10]">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#d4af37] scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">
                  {product.category.toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  {product.name}
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 py-2 border-y border-gray-800">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#eed78a]">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 ml-auto font-medium">
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
                    Select Bottle Size & Edition:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`p-2.5 rounded-lg text-left border transition-all ${
                          selectedSize === s.size
                            ? 'bg-[#1e202d] border-[#d4af37] text-white shadow-md'
                            : 'bg-[#12141c] border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{s.size}</span>
                          <span className="text-xs font-bold text-[#eed78a]">
                            Rs. {s.price.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center bg-[#151722] border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4">
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-lg text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'gold-gradient-bg text-black hover:brightness-110 active:scale-[0.99] shadow-lg'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Shopping Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </>
                )}
              </button>

              <button
                id="modal-whatsapp-order-btn"
                onClick={() => onWhatsAppInquiry(product, selectedSize)}
                className="w-full py-3 rounded-lg bg-[#141620] hover:bg-[#1a1d2c] border border-emerald-500/50 hover:border-emerald-400 text-emerald-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Fast Order or Inquire via WhatsApp</span>
              </button>

              {/* Guarantees */}
              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" /> 100% Authentic Extrait
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#d4af37]" /> Cash on Delivery • Delivery Rs. {INITIAL_STORE_SETTINGS.shippingFee}
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" /> Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};