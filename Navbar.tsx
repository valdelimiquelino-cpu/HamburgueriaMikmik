'use client';

import React from 'react';
import { ShoppingBag, MapPin, Clock, Search, Flame, MessageCircle } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

interface NavbarProps {
  cartItemCount: number;
  cartSubtotal: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({
  cartItemCount,
  cartSubtotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top micro bar with address & status */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Aberto Agora
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-stone-400">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {RESTAURANT_INFO.hours}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {RESTAURANT_INFO.address}
            </span>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {RESTAURANT_INFO.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  {RESTAURANT_INFO.name}
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  Artesanal
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                {RESTAURANT_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar hambúrguer, bebida ou sobremesa..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100/90 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 p-1"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Cart Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="open-cart-button"
              onClick={onOpenCart}
              className="group relative flex items-center gap-2 sm:gap-3 bg-stone-900 hover:bg-stone-800 text-white pl-3.5 pr-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-orange-600 text-white text-[11px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center border-2 border-stone-900">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-stone-300 font-medium leading-tight">
                  Carrinho
                </span>
                <span className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {cartItemCount > 0 ? formatCurrency(cartSubtotal) : 'Vazio'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
