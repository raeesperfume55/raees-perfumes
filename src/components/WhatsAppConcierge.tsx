import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Shield } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '../firebase/seedData';

interface WhatsAppConciergeProps {
  currentProduct?: { name: string; size?: string } | null;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({ currentProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '923058476196';
  const quickPrompts = [
    '✨ Help me choose a perfume for an evening event',
    '👑 I would like to order new perfume please guide me ',
    '📦 Track my perfume parcel shipment status',
    '🎁 Inquire about custom luxury gift packaging',
  ];

  const handleSendToWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/923058476196?text=${encoded}`, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  const defaultInitialMessage = currentProduct
    ? `Hi Raees Team, I'm interested in *${currentProduct.name}* (${currentProduct.size || '50ml'}). Can you assist me?`
    : `Hi Raees Luxury Fragrance House, I would like to inquire about your luxury fragrance collection.`;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Concierge Chat Popup Box */}
      {isOpen && (
        <div
          id="whatsapp-chat-popup"
          className="absolute bottom-16 right-0 w-[340px] sm:w-[380px] bg-[#0f1118] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#181a26] to-[#12131c] p-4 border-b border-[#d4af37]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1e2230] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-serif font-bold">
                  R
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f1118]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Raees Perfumer Concierge</span>
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">Online • Instant Response</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#0d0e14]/90 max-h-80 overflow-y-auto">
            <div className="p-3 rounded-xl bg-[#171924] border border-gray-800 text-xs text-gray-300 leading-relaxed">
              <p className="font-semibold text-[#eed78a] flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Welcome to Raees Perfume Collections
              </p>
              How may our Master Olfactory Consultant assist you today? Tap any prompt or message directly on WhatsApp.
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Suggested Inquiries:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendToWhatsApp(prompt)}
                  className="w-full text-left p-2 rounded-lg bg-[#141620] hover:bg-[#1f2230] border border-gray-800 hover:border-[#d4af37]/50 text-xs text-gray-200 transition-all block"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Input */}
          <div className="p-3 bg-[#11131c] border-t border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendToWhatsApp(customMsg || defaultInitialMessage);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={currentProduct ? `Inquire about ${currentProduct.name}...` : 'Type your message...'}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 bg-[#181a26] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-emerald-400/40 cursor-pointer"
        aria-label="Open WhatsApp Chat Concierge"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />

        {/* Pulsing Aura Badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d4af37] border-2 border-[#0b0c10]"></span>
        </span>
      </button>
    </div>
  );
};