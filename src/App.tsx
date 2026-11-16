import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ShopView } from './components/ShopView';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { AdminDashboard } from './components/AdminDashboard';
import { BrandHeritage } from './components/BrandHeritage';
import { Footer } from './components/Footer';
import { Product } from './types';
import { fetchProducts, subscribeToProducts } from './firebase/db';
import { Sparkles, ArrowRight, Crown, Flame, Droplets, Compass } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from './firebase/seedData';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<'home' | 'shop' | 'heritage' | 'checkout'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Subscribe to real-time products
  useEffect(() => {
    const unsub = subscribeToProducts((loadedProds) => {
      setProducts(loadedProds);
      setLoadingProducts(false);
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const handleQuickView = (product: Product) => {
    setActiveProductModal(product);
  };

  const handleWhatsAppInquiry = (product: Product, size?: string) => {
    const phone = INITIAL_STORE_SETTINGS.whatsAppNumber.replace(/\+/g, '').replace(/\s/g, '');
    const chosenSize = size || product.sizes[0]?.size || '100ml';
    const message = `Hi Raees Luxury Fragrance House, I am interested in ordering *${product.name}* (${chosenSize}). Please share delivery timeline and payment details!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const flagged = products.filter((p) => p.isFeatured || p.isBestSeller);
  const featuredProducts = (flagged.length >= 4 ? flagged : products).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-gray-100 flex flex-col selection:bg-[#d4af37]/30 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as any)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ================= VIEW 1: HOME PAGE ================= */}
        {currentTab === 'home' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Hero Section */}
            <HeroBanner
              onExploreClick={() => {
                setCurrentTab('shop');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBestSellersClick={() => {
                const el = document.getElementById('featured-fragrances-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Featured Best Sellers Section */}
            <section
              id="featured-fragrances-section"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#eed78a] font-serif uppercase tracking-widest">
                    <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>The Masterpiece Collection</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
                    Signature Fragrances
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('shop');
                    setSelectedCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-[#eed78a] hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  <span>View All Creations ({products.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/5] bg-[#141622] rounded-xl animate-pulse border border-gray-800"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onQuickView={handleQuickView}
                      onWhatsAppInquiry={handleWhatsAppInquiry}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 3 Regal Categories Highlight Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Unisex & Oud */}
                <div
                  onClick={() => {
                    setCurrentTab('shop');
                    setSelectedCategory('unisex');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-[#d4af37]/30 shadow-xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
                    alt="Unisex and Oud"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-1">
                    <span className="text-[10px] text-[#eed78a] uppercase tracking-widest font-semibold block">
                      Aged Agarwood & Smoked Resins
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#eed78a] transition-colors">
                      Unisex & Oud Elixirs
                    </h3>
                    <p className="text-xs text-gray-300 font-editorial flex items-center gap-1 pt-1">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />
                    </p>
                  </div>
                </div>

                {/* Men's Collection */}
                <div
                  onClick={() => {
                    setCurrentTab('shop');
                    setSelectedCategory('men');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-blue-900/40 shadow-xl"
                >
                  <img
                    src="https://files.catbox.moe/3gdrr2.jpeg"
                    alt="Men's Collection"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-1">
                    <span className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold block">
                      Smoked Bourbon & Vetiver
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      Men's Sovereign Editions
                    </h3>
                    <p className="text-xs text-gray-300 font-editorial flex items-center gap-1 pt-1">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                    </p>
                  </div>
                </div>

                {/* Women's Collection */}
                <div
                  onClick={() => {
                    setCurrentTab('shop');
                    setSelectedCategory('women');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-rose-900/40 shadow-xl"
                >
                  <img
                    src="https://files.catbox.moe/q67fbu.jpeg"
                    alt="Women's Collection"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 space-y-1">
                    <span className="text-[10px] text-rose-300 uppercase tracking-widest font-semibold block">
                      Taif Rose & Jasmine Sambac
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-rose-300 transition-colors">
                      Women's Velvet Florals
                    </h3>
                    <p className="text-xs text-gray-300 font-editorial flex items-center gap-1 pt-1">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Brand Heritage Preview */}
            <BrandHeritage
              onShopNow={() => {
                setCurrentTab('shop');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* ================= VIEW 2: SHOP CATALOG ================= */}
        {currentTab === 'shop' && (
          <ShopView
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onQuickView={handleQuickView}
            onWhatsAppInquiry={handleWhatsAppInquiry}
          />
        )}

        {/* ================= VIEW 3: BRAND HERITAGE ================= */}
        {currentTab === 'heritage' && (
          <BrandHeritage
            onShopNow={() => {
              setCurrentTab('shop');
              setSelectedCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= VIEW 4: CHECKOUT ================= */}
        {currentTab === 'checkout' && (
          <CheckoutView
            onBackToShop={() => {
              setCurrentTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onCategoryClick={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onTabClick={(tab) => {
          setCurrentTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* ================= MODALS & SLIDE-OVERS ================= */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onWhatsAppInquiry={handleWhatsAppInquiry}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setCurrentTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Panel Console */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Floating WhatsApp Concierge Icon (Fixed Bottom Right) */}
      <WhatsAppConcierge
        currentProduct={
          activeProductModal
            ? { name: activeProductModal.name, size: activeProductModal.sizes[0]?.size }
            : null
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}