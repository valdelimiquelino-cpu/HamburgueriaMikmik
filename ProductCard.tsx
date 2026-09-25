'use client';

import React from 'react';
import { Plus, Minus, Clock, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { InteractiveFoodImage } from './InteractiveFoodImage';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
}: ProductCardProps) {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300/90 transition-all duration-300"
    >
      {/* Next-Gen Interactive Image Container with 3D Tilt, Glare & Light Sweep */}
      <InteractiveFoodImage
        src={product.imageUrl}
        alt={product.name}
        category={product.category}
        tag={product.tag}
        roundedClassName="rounded-t-2xl"
        className="relative h-48 sm:h-52 w-full cursor-pointer shrink-0"
        onClick={() => onOpenDetail(product)}
        bottomContent={
          <div className="flex items-center justify-between text-[11px] text-white font-medium">
            {product.prepTime && (
              <span className="inline-flex items-center gap-1 bg-stone-900/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                <Clock className="w-3 h-3 text-amber-400" />
                {product.prepTime}
              </span>
            )}
            {product.weightOrVolume && (
              <span className="bg-stone-900/85 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                {product.weightOrVolume}
              </span>
            )}
          </div>
        }
      />

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onOpenDetail(product)}
              className="font-bold text-stone-900 text-base sm:text-lg hover:text-amber-600 transition-colors cursor-pointer leading-snug"
            >
              {product.name}
            </h3>
          </div>

          <p
            onClick={() => onOpenDetail(product)}
            className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 cursor-pointer hover:text-stone-800"
          >
            {product.description}
          </p>
        </div>

        {/* Footer with Price and Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-medium">
              Preço
            </span>
            <span className="text-lg sm:text-xl font-black text-stone-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div>
            {quantityInCart > 0 ? (
              <div className="flex items-center bg-stone-900 text-white rounded-xl p-1 shadow-sm">
                <button
                  id={`card-decrease-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(product.id, quantityInCart - 1);
                  }}
                  aria-label="Diminuir quantidade"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">
                  {quantityInCart}
                </span>
                <button
                  id={`card-increase-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(product.id, quantityInCart + 1);
                  }}
                  aria-label="Aumentar quantidade"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id={`add-product-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
