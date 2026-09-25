'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { InteractiveFoodImage } from './InteractiveFoodImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, notes.trim() || undefined);
    onClose();
    setQuantity(1);
    setNotes('');
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="product-detail-modal"
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md transition-colors cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image with Next-Gen 3D Tilt & HD Zoom Lens */}
        <div className="relative w-full shrink-0">
          <InteractiveFoodImage
            src={product.imageUrl}
            alt={product.name}
            category={product.category}
            tag={product.tag}
            enableZoomLens={true}
            enableTilt={true}
            roundedClassName="rounded-t-3xl"
            className="h-64 sm:h-72 w-full"
            bottomContent={
              <div className="flex items-center justify-between text-white text-xs">
                {product.prepTime && (
                  <span className="inline-flex items-center gap-1.5 bg-stone-900/85 px-2.5 py-1 rounded-lg backdrop-blur-md font-medium border border-white/10 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Preparo: {product.prepTime}
                  </span>
                )}
                {product.weightOrVolume && (
                  <span className="bg-stone-900/85 px-2.5 py-1 rounded-lg backdrop-blur-md font-medium border border-white/10 shadow-sm">
                    Porção: {product.weightOrVolume}
                  </span>
                )}
              </div>
            }
          />
        </div>

        {/* Scrollable details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
              {product.name}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.category === 'combos' && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Itens inclusos no Combo:</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-amber-200/90 shadow-xs flex flex-col items-center">
                  <div className="group/mini relative w-14 h-14 rounded-lg overflow-hidden mb-1.5 border border-stone-200 shadow-2xs">
                    <Image
                      src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                      alt="Hambúrguer Artesanal"
                      fill
                      sizes="60px"
                      className="object-cover group-hover/mini:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-stone-900 block text-[11px] leading-tight">1x Hambúrguer</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Angus 180g</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-amber-200/90 shadow-xs flex flex-col items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-1.5 border border-stone-200 shadow-2xs">
                    <Image
                      src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80"
                      alt="Batatas Fritas Crocantes"
                      fill
                      sizes="60px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-stone-900 block text-[11px] leading-tight">1x Batata Frita</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Dourada & Crocante</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-amber-200/90 shadow-xs flex flex-col items-center">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden mb-1.5 border border-stone-200 shadow-2xs">
                    <Image
                      src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80"
                      alt="Refrigerante 2 Litros"
                      fill
                      sizes="60px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-stone-900 block text-[11px] leading-tight">1x Refri 2 Litros</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Garrafa Família</span>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-bold text-amber-900 mb-1.5">
                  Escolha o seu Refrigerante de 2 Litros:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = 'Refri: Coca-Cola 2L';
                      setNotes((prev) => (prev.includes('Refri:') ? prev.replace(/Refri: [^,]+/, prefix) : prev ? `${prefix}, ${prev}` : prefix));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      notes.includes('Coca-Cola 2L')
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                        : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    🥤 Coca-Cola 2L
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const prefix = 'Refri: Guaraná 2L';
                      setNotes((prev) => (prev.includes('Refri:') ? prev.replace(/Refri: [^,]+/, prefix) : prev ? `${prefix}, ${prev}` : prefix));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      notes.includes('Guaraná 2L')
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                        : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    🥤 Guaraná Antarctica 2L
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-1">
            <label
              htmlFor="item-notes"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
            >
              Observações especiais do item
            </label>
            <input
              id="item-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem picles, carne bem passada, refrigerante com limão..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center bg-white border border-stone-300 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 disabled:opacity-40 text-stone-700 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            id="modal-add-to-cart-button"
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-3 rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer text-sm"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Adicionar ao Pedido
            </span>
            <span>{formatCurrency(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
