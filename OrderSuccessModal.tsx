'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  Bike,
  QrCode,
  Copy,
  Check,
  MessageCircle,
  RotateCcw,
  Receipt,
  X,
} from 'lucide-react';
import { CompletedOrder } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { RESTAURANT_INFO } from '@/lib/data';
import { getWhatsAppOrderUrl, buildWhatsAppMessage } from '@/lib/whatsapp';

interface OrderSuccessModalProps {
  order: CompletedOrder | null;
  onCloseAndReset: () => void;
}

export function OrderSuccessModal({
  order,
  onCloseAndReset,
}: OrderSuccessModalProps) {
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!order) return null;

  const mockPixKey = `00020126580014br.gov.bcb.pix0136burgerco-${order.orderId.toLowerCase()}-pix520400005303986540${order.total.toFixed(2)}5802BR5925BURGER CO ARTESANAL6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const whatsappMessageText = buildWhatsAppMessage(order);
  const whatsappUrl = getWhatsAppOrderUrl(order);

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(whatsappMessageText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        id="order-success-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
      >
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 p-6 text-center relative shrink-0">
          <button
            onClick={onCloseAndReset}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/15 hover:bg-stone-950/30 text-stone-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/95 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block text-xs font-black tracking-wider uppercase bg-stone-950 text-amber-400 px-3 py-1 rounded-full mb-1">
            Pedido Concluído com Sucesso!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950">
            Pedido {order.orderId}
          </h2>
          <p className="text-xs sm:text-sm text-stone-900 font-medium mt-1">
            Já enviamos seu pedido para nossa cozinha artesanal!
          </p>
        </div>

        {/* Scrollable Order Details */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Status Tracker */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Tempo estimado: {order.estimatedTime}
              </span>
              <span className="text-stone-500">Horário: {order.createdAt}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center mb-1">
                  1
                </div>
                <span className="text-amber-800 font-bold">Recebido</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mb-1">
                  2
                </div>
                <span className="text-stone-500">Na Chapa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mb-1">
                  3
                </div>
                <span className="text-stone-500">
                  {order.customerData.deliveryMethod === 'delivery' ? 'A Caminho' : 'Balcão'}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mb-1">
                  4
                </div>
                <span className="text-stone-500">Entregue</span>
              </div>
            </div>
          </div>

          {/* If PIX was selected, show instant Pix key & simulated QR */}
          {order.customerData.paymentMethod === 'pix' && (
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 text-stone-900">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-sm text-emerald-950">
                  Pagamento via PIX • {formatCurrency(order.total)}
                </h4>
              </div>
              <p className="text-xs text-stone-600 mb-3">
                Copie o código abaixo e cole no seu aplicativo de banco na opção &quot;Pix Copia e Cola&quot;:
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-600 truncate">
                  {mockPixKey}
                </div>
                <button
                  onClick={handleCopyPix}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Pix
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Delivery or Pickup details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1.5">
                {order.customerData.deliveryMethod === 'delivery' ? (
                  <>
                    <Bike className="w-4 h-4 text-amber-500" />
                    Entrega em Domicílio
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-amber-500" />
                    Retirada no Restaurante
                  </>
                )}
              </div>

              {order.customerData.deliveryMethod === 'delivery' ? (
                <p className="text-stone-600 leading-relaxed">
                  {order.customerData.address.street}, {order.customerData.address.number}
                  <br />
                  {order.customerData.address.neighborhood}
                  {order.customerData.address.complement && ` (${order.customerData.address.complement})`}
                </p>
              ) : (
                <p className="text-stone-600 leading-relaxed">
                  {RESTAURANT_INFO.address}
                  <br />
                  Apresente o código <strong>{order.orderId}</strong> no caixa.
                </p>
              )}
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="font-bold text-stone-800 mb-1.5">Cliente & Pagamento</div>
              <p className="text-stone-600 leading-relaxed">
                <strong>{order.customerData.name}</strong> • {order.customerData.phone}
                <br />
                Forma: {order.customerData.paymentMethod.toUpperCase()}
                {order.customerData.cashChange && ` (Troco para ${order.customerData.cashChange})`}
              </p>
            </div>
          </div>

          {/* Summary of items */}
          <div className="border border-stone-200 rounded-2xl p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              Itens Solicitados
            </h4>
            <div className="space-y-2 text-xs divide-y divide-stone-100">
              {order.items.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex justify-between">
                  <div>
                    <span className="font-semibold text-stone-900">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.notes && (
                      <p className="text-[11px] text-stone-500 italic">Obs: {item.notes}</p>
                    )}
                  </div>
                  <span className="font-medium text-stone-800">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
              <span>Total Pago/A Pagar</span>
              <span className="text-base text-amber-700">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Dedicated WhatsApp Card */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">WhatsApp da Hamburgueria</h4>
                  <p className="text-xs text-emerald-800 font-semibold">{RESTAURANT_INFO.whatsappDisplay}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Atendimento Rápido
              </span>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              O pedido foi preparado com todos os itens, endereço e modalidade de pagamento. Clique abaixo para abrir a conversa ou copie o texto completo:
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Abrir WhatsApp no {RESTAURANT_INFO.whatsappDisplay}
              </a>
              <button
                onClick={handleCopyWhatsAppText}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-100 text-emerald-900 font-medium py-2.5 px-3 rounded-xl border border-emerald-300 text-xs transition-colors cursor-pointer"
              >
                {copiedMsg ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Texto Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copiar Texto do Pedido</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-xs transition-colors text-sm text-center"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar Pedido para o WhatsApp ({RESTAURANT_INFO.whatsappDisplay})
          </a>

          <button
            onClick={onCloseAndReset}
            className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-5 rounded-xl transition-colors text-sm cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Novo Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
