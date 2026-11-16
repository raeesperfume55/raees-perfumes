import React from 'react';
import { Crown, Sparkles, ShieldCheck, Truck, RotateCcw, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '../firebase/seedData';
import { Instagram } from 'lucide-react';

interface FooterProps {
  onCategoryClick: (category: string) => void;
  onTabClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategoryClick, onTabClick }) => {
  return (
    <footer className="bg-[#08090d] border-t border-[#d4af37]/20 text-gray-400 text-xs">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#d4af37]" />
              <span className="font-serif text-2xl font-extrabold tracking-[0.2em] gold-gradient-text">
                RAEES
              </span>
            </div>
            <p className="text-gray-400 font-editorial text-xs leading-relaxed max-w-sm">
              Artisanal Luxury Fragrance House dedicated to distilling the world's most opulent agarwood, damascena rose, and golden resin extracts into sovereign liquid luxury.
            </p>
            <div className="space-y-1.5 text-xs text-gray-400 pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                 <span>Concierge: +92 305 8476196</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{INITIAL_STORE_SETTINGS.supportEmail}</span>
              </p>
              <a 
       href="https://www.instagram.com/raees.fragrance/" 
      target="_blank" 
      rel="noopener noreferrer" 
        className="flex items-center gap-2 hover:underline">
  <Instagram className="w-3.5 h-3.5 text-[#d4af37]" />
  <span>@raees.fragrance</span>
</a>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Fragrance Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onCategoryClick('unisex')}
                  className="hover:text-[#eed78a] transition-colors"
                >
                  Unisex Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('men')}
                  className="hover:text-[#eed78a] transition-colors"
                >
                  Men's Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('women')}
                  className="hover:text-[#eed78a] transition-colors"
                >
                  Women's Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onCategoryClick('all')}
                  className="hover:text-[#eed78a] transition-colors"
                >
                  All Extrait Perfumes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Brand & Craft */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              The Maison
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onTabClick('heritage')}
                  className="hover:text-[#eed78a] transition-colors"
                >
                  Heritage & Alchemy
                </button>
              </li>
              
              <li>
                <a
                  href={`https://wa.me/923058476196`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#eed78a] transition-colors flex items-center gap-1 text-emerald-400"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Private Scent Consultation</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Guarantees */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Client Service
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-gray-300">
                <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Cash on Delivery Available</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Authentic Extrait Purity</span>
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <RotateCcw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Complimentary Discovery Sample</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <p>© {new Date().getFullYear()} RAEES Luxury Fragrance House. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Firebase Firestore & Authentication</span>
            <span>•</span>
            <span>Cash on Delivery & Secure Online Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
};