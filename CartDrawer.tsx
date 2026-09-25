'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { RESTAURANT_INFO } from '@/lib/data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        id="cart-drawer-panel"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">Seu Carrinho</h2>
              <span className="text-xs text-stone-500">
                {itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-stone-500 hover:text-red-600 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                title="Esvaziar carrinho"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar carrinho"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">
                Seu carrinho está vazio
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Escolha um dos nossos deliciosos hambúrgueres artesanais, refrigerantes ou sobremesas para começar!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Explorar Cardápio
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/80 hover:border-amber-300 transition-all"
              >
                <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200 group-hover:border-amber-400/60 transition-all shadow-xs">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-xs font-semibold text-stone-600 block">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      aria-label="Remover item"
                      className="text-stone-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-200 line-clamp-1 mt-1">
                      Obs: {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                    <span className="text-xs font-bold text-stone-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>

                    <div className="flex items-center bg-white border border-stone-300 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-stone-100 text-stone-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with subtotal & CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal dos itens</span>
                <span className="font-semibold text-stone-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Entrega / Retirada</span>
                <span>Calculada no checkout</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">Total Estimado</span>
              <span className="text-xl font-black text-stone-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <button
              id="proceed-to-checkout-button"
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer text-sm sm:text-base"
            >
              <span>Avançar para o Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
