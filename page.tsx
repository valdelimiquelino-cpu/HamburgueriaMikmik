'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { InteractiveFoodImage } from '@/components/InteractiveFoodImage';
import { PRODUCTS, RESTAURANT_INFO, FEATURED_COMBO } from '@/lib/data';
import { Product, ProductCategory, CartItem, CompletedOrder } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Flame,
  GlassWater,
  IceCream,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Bike,
  Search,
  MessageCircle,
  Plus,
  Minus,
} from 'lucide-react';

export default function HomePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Cart helper functions
  const handleAddToCart = (product: Product, quantity: number = 1, notes?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          notes: notes ? (updated[existingIndex].notes ? `${updated[existingIndex].notes}; ${notes}` : notes) : updated[existingIndex].notes,
        };
        return updated;
      }
      return [...prev, { product, quantity, notes }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prev) => {
      if (newQuantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tag && product.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Grouped by category for structured catalogue display
  const combos = useMemo(
    () => filteredProducts.filter((p) => p.category === 'combos'),
    [filteredProducts]
  );
  const burgers = useMemo(
    () => filteredProducts.filter((p) => p.category === 'burgers'),
    [filteredProducts]
  );
  const drinks = useMemo(
    () => filteredProducts.filter((p) => p.category === 'drinks'),
    [filteredProducts]
  );
  const desserts = useMemo(
    () => filteredProducts.filter((p) => p.category === 'desserts'),
    [filteredProducts]
  );

  const counts = {
    all: PRODUCTS.length,
    combos: PRODUCTS.filter((p) => p.category === 'combos').length,
    burgers: PRODUCTS.filter((p) => p.category === 'burgers').length,
    drinks: PRODUCTS.filter((p) => p.category === 'drinks').length,
    desserts: PRODUCTS.filter((p) => p.category === 'desserts').length,
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const getQuantityInCart = (productId: string) => {
    const found = cartItems.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: CompletedOrder) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
    setCartItems([]);
  };

  const handleCloseAndReset = () => {
    setCompletedOrder(null);
  };

  const comboProduct = PRODUCTS.find((p) => p.id === 'combo-1') || PRODUCTS[0];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col antialiased">
      {/* Navbar */}
      <Navbar
        cartItemCount={cartItemCount}
        cartSubtotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Banner Hero with Featured Burger & Dessert Images */}
        <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 lg:p-8 shadow-md border border-stone-800 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Headline & Info */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Super Combo & Cardápio Especial</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Combo Família: Burger, Batata Frita & Refri 2 Litros
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                A melhor combinação para matar a fome: Hambúrguer artesanal Angus na brasa, porção generosa de batatas fritas crocantes e refrigerante de 2 Litros estupidamente gelado para dividir!
              </p>

              {/* Delivery, Pickup & WhatsApp badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-stone-300 pt-1">
                <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
                  <Bike className="w-3.5 h-3.5 text-amber-400" />
                  Entrega: {formatCurrency(RESTAURANT_INFO.deliveryFee)} ({RESTAURANT_INFO.estimatedDelivery})
                </span>
                <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Retirada: {RESTAURANT_INFO.estimatedPickup}
                </span>
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors border border-emerald-500/40"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>WhatsApp: {RESTAURANT_INFO.whatsappDisplay}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Featured Combo (Burger + Batata Frita + Refrigerante 2L) */}
            <div className="lg:col-span-6">
              <div
                id="hero-featured-combo"
                className="relative bg-stone-900/95 border-2 border-amber-500/50 hover:border-amber-400 rounded-3xl p-3.5 sm:p-5 shadow-2xl transition-all duration-300 flex flex-col backdrop-blur-xs"
              >
                {/* Top Badge & Discount Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>SUPER COMBO EM DESTAQUE</span>
                  </div>
                  <span className="bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                    Economize R$ 16,00
                  </span>
                </div>

                {/* Main Combo Image with Next-Gen 3D Tilt, Specular Glare & Ambient Ember Underglow */}
                <InteractiveFoodImage
                  src={FEATURED_COMBO.imageUrl}
                  alt={FEATURED_COMBO.name}
                  category="combos"
                  priority={true}
                  className="h-64 sm:h-76 lg:h-84 w-full cursor-pointer"
                  onClick={() => setSelectedProduct(comboProduct)}
                  topContent={
                    <div className="flex flex-wrap gap-2 pointer-events-auto">
                      <span className="inline-flex items-center gap-1 bg-stone-900/90 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <Flame className="w-3 h-3 text-amber-400" />
                        Grelhado na Brasa
                      </span>
                      <span className="inline-flex items-center gap-1 bg-stone-900/90 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        🍟 Batata Crocante
                      </span>
                    </div>
                  }
                  bottomContent={
                    <div className="flex items-end justify-between gap-2 pointer-events-auto">
                      <div className="bg-stone-950/85 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-stone-800/80 max-w-[70%] shadow-lg">
                        <h3 className="text-white font-black text-sm sm:text-base md:text-lg leading-tight group-hover/food-img:text-amber-300 transition-colors drop-shadow-sm">
                          {FEATURED_COMBO.name}
                        </h3>
                        <p className="text-stone-300 text-[11px] sm:text-xs font-normal mt-0.5 line-clamp-1">
                          {FEATURED_COMBO.description}
                        </p>
                      </div>
                      <div className="bg-stone-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-amber-500/40 text-right shrink-0 shadow-lg">
                        <span className="text-[11px] text-stone-400 line-through block leading-none mb-0.5">
                          {formatCurrency(FEATURED_COMBO.originalPrice)}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
                          {formatCurrency(FEATURED_COMBO.price)}
                        </span>
                      </div>
                    </div>
                  }
                />

                {/* The 3 Specific Combo Items Highlighted with Appetizing Photos & Hover Sheen */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3.5 pt-3.5 border-t border-stone-800">
                  {FEATURED_COMBO.items.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedProduct(comboProduct)}
                      className="group/item relative bg-stone-950/80 border border-stone-800 hover:border-amber-400/70 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center text-center transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:bg-stone-900/90 overflow-hidden"
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden mb-1.5 bg-stone-900 border-2 border-amber-400/40 group-hover/item:border-amber-400 group-hover/item:scale-105 transition-all duration-300 shadow-md">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="100px"
                          className="object-cover group-hover/item:scale-115 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        {/* Shimmer sweep effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 pointer-events-none" />
                        <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-md z-10">
                          {item.emoji}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs leading-tight line-clamp-1 group-hover/item:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-stone-400 leading-tight mt-0.5 line-clamp-2">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Controls / Action Button */}
                <div className="mt-3.5 pt-3 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-stone-300 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Preparo artesanal: <strong>{comboProduct.prepTime || '20-25 min'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      id="hero-combo-customize-btn"
                      onClick={() => setSelectedProduct(comboProduct)}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs rounded-xl border border-stone-700 transition-colors cursor-pointer text-center"
                    >
                      Personalizar
                    </button>
                    {getQuantityInCart(comboProduct.id) > 0 ? (
                      <div className="flex items-center bg-stone-950 border border-amber-500/50 text-white rounded-xl p-1 shadow-md">
                        <button
                          id="hero-combo-decrease"
                          onClick={() => handleUpdateQuantity(comboProduct.id, getQuantityInCart(comboProduct.id) - 1)}
                          aria-label="Diminuir quantidade"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-amber-400">
                          {getQuantityInCart(comboProduct.id)}
                        </span>
                        <button
                          id="hero-combo-increase"
                          onClick={() => handleUpdateQuantity(comboProduct.id, getQuantityInCart(comboProduct.id) + 1)}
                          aria-label="Aumentar quantidade"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors font-bold cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id="hero-combo-add-btn"
                        onClick={() => handleAddToCart(comboProduct, 1)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg hover:shadow-amber-500/20 cursor-pointer text-xs sm:text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Combo ({formatCurrency(comboProduct.price)})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Navegar por Categorias
            </h3>
            {searchQuery && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                Filtrando por: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={counts}
          />
        </section>

        {/* Product Catalog Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Nenhum item encontrado
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mb-4">
              Não encontramos resultados para &quot;{searchQuery}&quot;. Tente buscar por outros termos ou redefina os filtros.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ver Cardápio Completo
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 0. SEÇÃO DE COMBOS ESPECIAIS */}
            {(activeCategory === 'all' || activeCategory === 'combos') && combos.length > 0 && (
              <section id="section-combos" className="space-y-4">
                <div className="flex items-end justify-between border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        Combos Promocionais
                      </h3>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Melhor Escolha
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Combinações completas com hambúrguer artesanal, batatas fritas crocantes e refrigerante de 2 Litros com preço promocional.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {combos.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQuantityInCart(product.id)}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetail={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 1. SEÇÃO DE HAMBÚRGUERES */}
            {(activeCategory === 'all' || activeCategory === 'burgers') && burgers.length > 0 && (
              <section id="section-burgers" className="space-y-4">
                <div className="flex items-end justify-between border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Flame className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        Hambúrgueres Artesanais
                      </h3>
                      <span className="text-xs font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
                        {burgers.length} opções
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Blends nobres moídos diariamente, grelhados no ponto perfeito em pão brioche selado.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {burgers.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQuantityInCart(product.id)}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetail={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. SEÇÃO DE REFRIGERANTES */}
            {(activeCategory === 'all' || activeCategory === 'drinks') && drinks.length > 0 && (
              <section id="section-drinks" className="space-y-4">
                <div className="flex items-end justify-between border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <GlassWater className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        Refrigerantes Gelados
                      </h3>
                      <span className="text-xs font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
                        {drinks.length} opções
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Latas de 350ml estupidamente geladas para acompanhar com perfeição o seu hambúrguer.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {drinks.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQuantityInCart(product.id)}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetail={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. SEÇÃO DE SOBREMESAS */}
            {(activeCategory === 'all' || activeCategory === 'desserts') && desserts.length > 0 && (
              <section id="section-desserts" className="space-y-4">
                <div className="flex items-end justify-between border-b border-stone-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                        <IceCream className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                        Sobremesas Irresistíveis
                      </h3>
                      <span className="text-xs font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
                        {desserts.length} opções
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      Fechamento com chave de ouro: receitas clássicas, brownies quentinhos e milkshakes cremosos.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {desserts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQuantityInCart(product.id)}
                      onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      onUpdateQuantity={handleUpdateQuantity}
                      onOpenDetail={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar for Mobile & Quick Access */}
      {cartItemCount > 0 && (
        <aside
          aria-label="Resumo do carrinho"
          className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto md:hidden animate-in slide-in-from-bottom duration-300"
        >
          <div className="bg-stone-950 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center border-2 border-stone-950">
                  {cartItemCount}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'itens'} no carrinho
                </span>
                <span className="text-base font-black text-amber-400">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-stone-300 hover:text-white"
              >
                Ver Itens
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-xs active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">
              {RESTAURANT_INFO.name}
            </span>
            <span className="text-stone-500">•</span>
            <span>Cardápio Artesanal & Delivery</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-stone-400">
            <span>{RESTAURANT_INFO.address}</span>
            <span>{RESTAURANT_INFO.hours}</span>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: {RESTAURANT_INFO.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        order={completedOrder}
        onCloseAndReset={handleCloseAndReset}
      />
    </div>
  );
}
