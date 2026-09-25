'use client';

import React, { useState } from 'react';
import {
  X,
  Bike,
  Store,
  QrCode,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  User,
  Phone,
  MessageSquare,
  MessageCircle,
} from 'lucide-react';
import { CartItem, CustomerOrderData, DeliveryMethod, PaymentMethod, CompletedOrder } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { RESTAURANT_INFO } from '@/lib/data';
import { getWhatsAppOrderUrl } from '@/lib/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: CompletedOrder) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}: CheckoutModalProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cashChange, setCashChange] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? RESTAURANT_INFO.deliveryFee : 0;
  // 5% discount for PIX payments
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal + deliveryFee - pixDiscount);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Por favor, informe seu nome completo.';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Por favor, informe um telefone/WhatsApp válido.';
    }

    if (deliveryMethod === 'delivery') {
      if (!street.trim()) errs.street = 'Informe a rua ou avenida.';
      if (!number.trim()) errs.number = 'Informe o número.';
      if (!neighborhood.trim()) errs.neighborhood = 'Informe o bairro.';
    }

    if (paymentMethod === 'cash' && cashChange.trim()) {
      const changeVal = parseFloat(cashChange.replace(',', '.'));
      if (isNaN(changeVal) || changeVal < total) {
        errs.cashChange = `O valor para troco deve ser maior que o total (${formatCurrency(total)}).`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate fast order processing
    setTimeout(() => {
      const orderId = `HB-${Math.floor(1000 + Math.random() * 9000)}`;
      const completedOrder: CompletedOrder = {
        orderId,
        createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        items: [...items],
        customerData: {
          name: name.trim(),
          phone: phone.trim(),
          deliveryMethod,
          address: {
            street: street.trim(),
            number: number.trim(),
            neighborhood: neighborhood.trim(),
            complement: complement.trim() || undefined,
            reference: reference.trim() || undefined,
          },
          paymentMethod,
          cashChange: cashChange.trim() || undefined,
          notes: generalNotes.trim() || undefined,
        },
        subtotal,
        deliveryFee,
        total,
        estimatedTime: deliveryMethod === 'delivery' ? RESTAURANT_INFO.estimatedDelivery : RESTAURANT_INFO.estimatedPickup,
      };

      setIsSubmitting(false);
      // Auto-trigger WhatsApp link if popup allows
      try {
        const waUrl = getWhatsAppOrderUrl(completedOrder);
        window.open(waUrl, '_blank');
      } catch {
        // Handled in modal if popup is blocked
      }
      onOrderCompleted(completedOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Finalizar Pedido (Checkout)
              </h2>
              <p className="text-xs text-stone-400">
                Preencha seus dados para receber ou retirar seus hambúrgueres
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar checkout"
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: 2 Columns on Desktop */}
        <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {/* Left Column: Form Details */}
          <div className="flex-1 p-5 sm:p-6 space-y-6 lg:border-r border-stone-200">
            {/* 1. Tipo de Pedido */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                1. Modalidade do Pedido
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="checkout-delivery-option"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === 'delivery'
                      ? 'border-amber-500 bg-amber-50/70 text-stone-950 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      deliveryMethod === 'delivery'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Entrega (Delivery)</span>
                    <span className="text-xs text-stone-500">
                      {formatCurrency(RESTAURANT_INFO.deliveryFee)} • {RESTAURANT_INFO.estimatedDelivery}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  id="checkout-pickup-option"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-amber-500 bg-amber-50/70 text-stone-950 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      deliveryMethod === 'pickup'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Retirar no Balcão</span>
                    <span className="text-xs text-emerald-600 font-semibold">
                      Grátis • {RESTAURANT_INFO.estimatedPickup}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Dados do Cliente */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                2. Seus Dados de Contato
              </label>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder="Nome completo *"
                      className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                        errors.name ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-500'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="WhatsApp / Celular com DDD (ex: 11 98765-4321) *"
                      className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-500'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Endereço de Entrega (se delivery) */}
            {deliveryMethod === 'delivery' && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  3. Endereço para Entrega
                </label>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="customer-street-input"
                          type="text"
                          value={street}
                          onChange={(e) => {
                            setStreet(e.target.value);
                            if (errors.street) setErrors((prev) => ({ ...prev, street: '' }));
                          }}
                          placeholder="Rua ou Avenida *"
                          className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border ${
                            errors.street ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-500'
                          } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                        />
                      </div>
                      {errors.street && (
                        <p className="text-xs text-red-500 mt-1">{errors.street}</p>
                      )}
                    </div>

                    <div>
                      <input
                        id="customer-number-input"
                        type="text"
                        value={number}
                        onChange={(e) => {
                          setNumber(e.target.value);
                          if (errors.number) setErrors((prev) => ({ ...prev, number: '' }));
                        }}
                        placeholder="Número *"
                        className={`w-full px-3 py-2.5 text-sm rounded-xl border ${
                          errors.number ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-500'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                      />
                      {errors.number && (
                        <p className="text-xs text-red-500 mt-1">{errors.number}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        id="customer-neighborhood-input"
                        type="text"
                        value={neighborhood}
                        onChange={(e) => {
                          setNeighborhood(e.target.value);
                          if (errors.neighborhood) setErrors((prev) => ({ ...prev, neighborhood: '' }));
                        }}
                        placeholder="Bairro *"
                        className={`w-full px-3 py-2.5 text-sm rounded-xl border ${
                          errors.neighborhood ? 'border-red-500 bg-red-50/30' : 'border-stone-300 focus:border-amber-500'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                      />
                      {errors.neighborhood && (
                        <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>
                      )}
                    </div>

                    <div>
                      <input
                        id="customer-complement-input"
                        type="text"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        placeholder="Complemento (Apto, bloco...)"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      id="customer-reference-input"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ponto de referência (opcional)"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Forma de Pagamento */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {deliveryMethod === 'delivery' ? '4.' : '3.'} Forma de Pagamento
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* PIX */}
                <button
                  type="button"
                  id="pay-pix-btn"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs font-bold block">PIX</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded-full mt-0.5">
                    -5% OFF
                  </span>
                </button>

                {/* Cartão Crédito */}
                <button
                  type="button"
                  id="pay-credit-btn"
                  onClick={() => setPaymentMethod('credit')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs font-bold block">Crédito</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Maquininha</span>
                </button>

                {/* Cartão Débito */}
                <button
                  type="button"
                  id="pay-debit-btn"
                  onClick={() => setPaymentMethod('debit')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'debit'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs font-bold block">Débito</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Maquininha</span>
                </button>

                {/* Dinheiro */}
                <button
                  type="button"
                  id="pay-cash-btn"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-amber-500 bg-amber-50/60 text-stone-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1 text-amber-700" />
                  <span className="text-xs font-bold block">Dinheiro</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Troco</span>
                </button>
              </div>

              {/* Cash change field */}
              {paymentMethod === 'cash' && (
                <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 animate-in fade-in duration-150">
                  <label htmlFor="cash-change-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Precisa de troco para quanto? (Deixe em branco se não precisar)
                  </label>
                  <input
                    id="cash-change-input"
                    type="text"
                    value={cashChange}
                    onChange={(e) => {
                      setCashChange(e.target.value);
                      if (errors.cashChange) setErrors((prev) => ({ ...prev, cashChange: '' }));
                    }}
                    placeholder="Ex: 50,00 ou 100,00"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.cashChange && (
                    <p className="text-xs text-red-500 mt-1">{errors.cashChange}</p>
                  )}
                </div>
              )}

              {/* PIX instructions */}
              {paymentMethod === 'pix' && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in duration-150">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Desconto de 5% aplicado!</strong> O código Pix Copia e Cola será gerado na confirmação.
                  </span>
                </div>
              )}
            </div>

            {/* 5. Observações do Pedido */}
            <div>
              <label htmlFor="order-general-notes" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {deliveryMethod === 'delivery' ? '5.' : '4.'} Observações Adicionais
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <textarea
                  id="order-general-notes"
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  rows={2}
                  placeholder="Alguma instrução para o entregador ou cozinha? (ex: tocar campainha, talheres...)"
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="w-full lg:w-80 bg-stone-50 p-5 sm:p-6 flex flex-col justify-between shrink-0 border-t lg:border-t-0 border-stone-200">
            <div>
              <h3 className="font-bold text-stone-900 text-base mb-3 pb-2 border-b border-stone-200 flex items-center justify-between">
                <span>Resumo do Pedido</span>
                <span className="text-xs font-semibold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </span>
              </h3>

              {/* Items list */}
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 text-xs">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate">
                        {item.quantity}x {item.product.name}
                      </p>
                      {item.notes && (
                        <p className="text-[10px] text-stone-500 truncate italic">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-stone-800 shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations breakdown */}
              <div className="mt-4 pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-emerald-600 font-semibold' : 'text-stone-900'}`}>
                    {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
                  </span>
                </div>

                {pixDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto PIX (5%)</span>
                    <span>-{formatCurrency(pixDiscount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-stone-900">Total a Pagar</span>
                  <span className="text-2xl font-black text-stone-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-stone-600 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-stone-800">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Previsão de atendimento:
                </div>
                <p className="text-stone-500 pl-5">
                  {deliveryMethod === 'delivery'
                    ? `Entrega em ${RESTAURANT_INFO.estimatedDelivery}`
                    : `Pronto para retirada em ${RESTAURANT_INFO.estimatedPickup}`}
                </p>
              </div>

              {/* WhatsApp routing notification */}
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Envio direto para WhatsApp:</p>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    O pedido será enviado instantaneamente para a hamburgueria no número{' '}
                    <strong className="font-extrabold text-emerald-950">{RESTAURANT_INFO.whatsappDisplay}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="submit"
                id="submit-order-checkout-button"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <span>Processando Pedido...</span>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white/20" />
                    <span>Confirmar e Enviar via WhatsApp ({formatCurrency(total)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pedido protegido</span>
                </div>
                <span className="text-stone-600 font-medium">WhatsApp: {RESTAURANT_INFO.whatsappDisplay}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
