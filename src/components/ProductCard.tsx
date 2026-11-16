import React, { useState } from 'react';
import { ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onWhatsAppInquiry: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onWhatsAppInquiry,
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0]?.size || '100ml'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const originalPrice = currentSizeObj?.originalPrice || product.originalPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'men':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/40';
      case 'women':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/40';
      default:
        return 'bg-amber-950/80 text-[#e8cf78] border-[#d4af37]/40';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="luxury-card rounded-xl overflow-hidden flex flex-col group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-[4/5] bg-[#12131b] overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 filter brightness-95"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider border backdrop-blur-md ${getCategoryBadgeClass(
              product.category
            )}`}
          >
            {product.category === 'unisex' ? 'Unisex / Oud' : product.category}
          </span>
        </div>

        {/* Quick View Button overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-x-4 bottom-4 py-2.5 rounded-lg bg-[#141622]/90 hover:bg-[#1d2030] backdrop-blur-md border border-[#d4af37]/40 text-xs font-semibold tracking-wider uppercase text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg font-bold text-white group-hover:text-[#eed78a] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-light">
            {product.description}
          </p>
        </div>

        {/* Bottle Sizes Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">Size:</span>
            {product.sizes.map((s) => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s.size)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  selectedSize === s.size
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#151722] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {s.size.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Pricing & Add to Cart row */}
        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-white font-serif">
                Rs. {currentPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400">
              {product.stock > 0 ? `${product.stock} In Stock` : 'Backorder'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* WhatsApp Quick Ask */}
            <button
              onClick={() => onWhatsAppInquiry(product)}
              className="p-2 rounded-lg bg-[#141620] hover:bg-[#1a1d2c] border border-gray-800 hover:border-emerald-500/40 text-emerald-400 transition-colors"
              title={`Inquire about ${product.name} on WhatsApp`}
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Quick Add Button */}
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleQuickAdd}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'gold-gradient-bg text-black hover:brightness-110 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {addedAnimation ? 'Added!' : 'Add'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};