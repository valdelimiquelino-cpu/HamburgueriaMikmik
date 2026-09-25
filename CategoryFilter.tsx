'use client';

import React from 'react';
import { Flame, GlassWater, IceCream, UtensilsCrossed, Sparkles } from 'lucide-react';
import { ProductCategory } from '@/lib/types';

interface CategoryFilterProps {
  activeCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  counts: {
    all: number;
    combos?: number;
    burgers: number;
    drinks: number;
    desserts: number;
  };
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  counts,
}: CategoryFilterProps) {
  const tabs = [
    {
      id: 'all' as const,
      label: 'Todos os Itens',
      count: counts.all,
      icon: UtensilsCrossed,
    },
    {
      id: 'combos' as const,
      label: 'Combos Especiais',
      count: counts.combos ?? 0,
      icon: Sparkles,
    },
    {
      id: 'burgers' as const,
      label: 'Hambúrgueres',
      count: counts.burgers,
      icon: Flame,
    },
    {
      id: 'drinks' as const,
      label: 'Refrigerantes',
      count: counts.drinks,
      icon: GlassWater,
    },
    {
      id: 'desserts' as const,
      label: 'Sobremesas',
      count: counts.desserts,
      icon: IceCream,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            id={`filter-tab-${tab.id}`}
            onClick={() => onSelectCategory(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30'
                : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive
                  ? 'bg-stone-950/15 text-stone-950'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
