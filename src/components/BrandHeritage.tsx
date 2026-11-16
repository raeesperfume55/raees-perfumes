import React from 'react';
import { Crown, Sparkles, Award, Compass, Heart, Shield, Star, Droplet } from 'lucide-react';

interface BrandHeritageProps {
  onShopNow: () => void;
}

export const BrandHeritage: React.FC<BrandHeritageProps> = ({ onShopNow }) => {
  const testimonials = [
    {
      name: 'Sheikh Hamdan Al-Maktoum (Reviewer)',
      quote: 'Oud Noir Royale has that rare, smoky depth only found in vintage artisanal agarwood. The sillage lasts well into the next evening.',
      fragrance: 'Oud Noir Royale',
      rating: 5,
    },
    {
      name: 'Dr. Ayesha Siddiqui',
      quote: 'Sultana Velvet Rose is pure poetry. The Damascena roses blend with white musk so effortlessly on the skin. It feels like wearing liquid velvet.',
      fragrance: 'Sultana Velvet Rose',
      rating: 5,
    },
    {
      name: 'Hamza Farooq',
      quote: 'Imperial Amber 1888 is majestic. The warmth of the Baltic amber and bourbon accords got me compliments everywhere I went.',
      fragrance: 'Imperial Amber 1888',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 py-12 sm:py-16">
      {/* Heritage Main Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl aspect-[3/4] group">
              <img
                src="https://files.catbox.moe/dr0okt.png"
                alt="Artisanal Perfume Crafting"
                className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/30" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0e1017]/90 backdrop-blur-md border border-[#d4af37]/30">
                <p className="text-[10px] text-[#eed78a] uppercase tracking-widest font-semibold">
                  Hand-Distilled in Grasse & Pursat
                </p>
                <h4 className="text-sm font-serif font-bold text-white mt-0.5">
                  The Ancient Alchemy of Sovereign Perfumery
                </h4>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151722] border border-[#d4af37]/30 text-xs text-[#eed78a] tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>The Maison's Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Where Imperial Heritage Meets{' '}
              <span className="gold-gradient-text">Raees Fragrance House</span>
            </h2>

            <p className="text-base text-gray-300 font-editorial leading-relaxed">
              Founded on the belief that fragrance is the invisible crown worn by sovereign souls, Raees crafts each elixir in small, dedicated batches using time-honored artisanal methods.
            </p>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Our master distillers journey across wild mountainous groves in Southeast Asia, high-altitude rose valleys in Taif and Damascus, and ancient amber beds across the Baltic Sea to procure raw natural essences untouched by synthetic shortcuts.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#131520] border border-gray-800 space-y-1">
                <Droplet className="w-5 h-5 text-[#d4af37] mb-2" />
                <h3 className="font-serif font-bold text-sm text-white">Extrait Purity</h3>
                <p className="text-xs text-gray-400">Up to 35% pure perfume oils for extraordinary projection.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#131520] border border-gray-800 space-y-1">
                <Award className="w-5 h-5 text-[#d4af37] mb-2" />
                <h3 className="font-serif font-bold text-sm text-white">3-Year Ageing</h3>
                <p className="text-xs text-gray-400">Resting in seasoned sandalwood vats to develop smooth resinous depths.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#131520] border border-gray-800 space-y-1">
                <Compass className="w-5 h-5 text-[#d4af37] mb-2" />
                <h3 className="font-serif font-bold text-sm text-white">Rare Sourcing</h3>
                <p className="text-xs text-gray-400">100% natural, Grade-A Cambodian Oud & Taif Rose.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopNow}
                className="px-8 py-3.5 rounded-lg gold-gradient-bg text-black font-semibold text-xs tracking-wider uppercase hover:brightness-110 shadow-lg transition-all"
              >
                Experience the Fragrances
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0e1017] border-y border-[#d4af37]/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-serif uppercase tracking-widest text-[#d4af37]">
              Voices of Distinction
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Praised by Fragrance Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="luxury-card p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex text-[#d4af37]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic font-editorial leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-[#eed78a] font-serif">{t.fragrance}</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};