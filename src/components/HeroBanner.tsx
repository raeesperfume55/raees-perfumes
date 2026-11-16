import React from 'react';
import { Sparkles, ArrowRight, Shield, Award } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onBestSellersClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onBestSellersClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#090a0e] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#d4af37]/15">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-96 h-96 bg-[#c49a26]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161822] border border-[#d4af37]/30 text-xs text-[#eed78a] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>The Sovereign Collection 2025</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Raees Fragrance House for{' '}
              <span className="gold-gradient-text block mt-1">Sovereign Souls</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-light leading-relaxed font-editorial lg:mx-0 mx-auto">
              Mastercrafted with aged Cambodian agarwood, wild harvested Damascena roses, and precious Baltic ambers. Each drop of Raees is an olfactory crown designed to leave an indelible impression.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-md gold-gradient-bg text-black font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <span>Explore Fragrances</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-bestsellers-btn"
                onClick={onBestSellersClick}
                className="w-full sm:w-auto px-7 py-4 rounded-md bg-[#13151f] hover:bg-[#1a1d2b] text-white border border-[#d4af37]/40 hover:border-[#d4af37] font-medium text-sm tracking-wider uppercase transition-all"
              >
                Discover Best Sellers
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Display */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl group">
              <img
                src="https://files.catbox.moe/pbg6kk.jpeg"
                alt="Raees Luxury Perfume Bottle"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/30" />

              {/* Floating Award Badge */}
              <div className="absolute top-4 right-4 bg-[#11131c]/90 backdrop-blur-md border border-[#d4af37]/40 px-3.5 py-2 rounded-lg text-right shadow-xl">
                <p className="text-[10px] text-[#d4af37] font-semibold tracking-widest uppercase">Signature Extrait</p>
                <p className="text-xs text-white font-serif font-bold">Oud Wood</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars of Brand Excellence */}
        <div className="mt-16 pt-10 border-t border-[#d4af37]/15 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#151722] border border-[#d4af37]/25 text-[#d4af37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide">100% Rare Essences</h2>
              <p className="text-xs text-gray-400 mt-0.5">Ethically sourced agarwood, roses & ambers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#151722] border border-[#d4af37]/25 text-[#d4af37] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide">Regal Unboxing</h2>
              <p className="text-xs text-gray-400 mt-0.5">Handcrafted black & gold collector box included.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};