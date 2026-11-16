import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Menu, X, Sparkles, Heart, Crown, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenAdmin,
}) => {
  const { cartCount, setIsCartOpen, cartSubtotal } = useCart();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (tab: string, category?: string) => {
    setCurrentTab(tab);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0c10]/90 border-b border-[#d4af37]/20 transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#12131a] via-[#1f1a10] to-[#12131a] border-b border-[#d4af37]/15 py-1.5 px-4 text-center text-xs tracking-widest text-[#e6ca65]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse shrink-0" />
          <span className="font-medium truncate">
            CASH ON DELIVERY AVAILABLE All OVER PAKISTAN
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse shrink-0 hidden sm:inline" />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#d4af37] hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo / Insignia */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-center cursor-pointer group select-none py-2"
          >
            <img
              src="https://files.catbox.moe/nl6qjj.png"
              alt="RAEES Logo"
              className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.55)]"
            />
            <span className="font-serif text-base sm:text-lg font-extrabold tracking-[0.25em] gold-gradient-text mt-0.5">
              RAEES
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 ${
                currentTab === 'home'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              Home
            </button>
            <button
              id="nav-shop-all"
              onClick={() => handleNavClick('shop', 'all')}
              className={`transition-colors py-1 ${
                currentTab === 'shop' && selectedCategory === 'all'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              All Fragrances
            </button>
            <button
              id="nav-shop-men"
              onClick={() => handleNavClick('shop', 'men')}
              className={`transition-colors py-1 ${
                currentTab === 'shop' && selectedCategory === 'men'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              Men
            </button>
            <button
              id="nav-shop-women"
              onClick={() => handleNavClick('shop', 'women')}
              className={`transition-colors py-1 ${
                currentTab === 'shop' && selectedCategory === 'women'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              Women
            </button>
            <button
              id="nav-shop-unisex"
              onClick={() => handleNavClick('shop', 'unisex')}
              className={`transition-colors py-1 ${
                currentTab === 'shop' && selectedCategory === 'unisex'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              Unisex 
            </button>
            <button
              id="nav-heritage"
              onClick={() => handleNavClick('heritage')}
              className={`transition-colors py-1 ${
                currentTab === 'heritage'
                  ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                  : 'text-[#d1d5db] hover:text-[#d4af37]'
              }`}
            >
              Heritage
            </button>
          </nav>

          {/* Right Action Icons: Search, Admin, Cart */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Toggle / Input */}
            <div className="relative flex items-center">
              {showSearchInput ? (
                <div className="flex items-center bg-[#181a24] border border-[#d4af37]/40 rounded-full px-3 py-1.5 text-xs">
                  <input
                    type="text"
                    placeholder="Search fragrance, notes..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentTab !== 'shop') setCurrentTab('shop');
                    }}
                    autoFocus
                    className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-36 sm:w-48 text-xs"
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="search-icon-btn"
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-gray-300 hover:text-[#d4af37] transition-colors"
                  title="Search perfumes"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Admin Portal Button */}
            <button
              id="admin-portal-nav-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isAdmin
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f4e295]'
                  : 'bg-[#151720] border-gray-800 text-gray-300 hover:border-[#d4af37]/50 hover:text-white'
              }`}
              title="Admin Portal (Firebase Auth & Management)"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">{isAdmin ? 'Admin Live' : 'Admin'}</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              id="cart-drawer-toggle"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#171922] hover:bg-[#202330] border border-[#d4af37]/30 hover:border-[#d4af37] rounded-full transition-all group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#d4af37] to-[#aa8212] text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1017] border-b border-[#d4af37]/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              All Fragrances
            </button>
            <button
              onClick={() => handleNavClick('shop', 'men')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              Men's Collection
            </button>
            <button
              onClick={() => handleNavClick('shop', 'women')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              Women's Collection
            </button>
            <button
              onClick={() => handleNavClick('shop', 'unisex')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              Unisex 
            </button>
            <button
              onClick={() => handleNavClick('heritage')}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium tracking-wider uppercase text-gray-200 hover:bg-[#1a1d28] hover:text-[#d4af37]"
            >
              Brand Heritage & Craft
            </button>
          </div>

          <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>Customer Concierge: +92 305 8476196 </span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-[#d4af37] underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};