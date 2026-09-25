import { CompletedOrder } from './types';
import { RESTAURANT_INFO } from './data';
import { formatCurrency } from './utils';

export function buildWhatsAppMessage(order: CompletedOrder): string {
  const itemsText = order.items
    .map((it, idx) => {
      let itemLine = `${idx + 1}. *${it.quantity}x ${it.product.name}* (${formatCurrency(it.product.price * it.quantity)})`;
      if (it.notes) {
        itemLine += `\n   ↳ _Obs: ${it.notes}_`;
      }
      return itemLine;
    })
    .join('\n');

  const addressText =
    order.customerData.deliveryMethod === 'delivery'
      ? `🛵 *MODALIDADE: ENTREGA EM DOMICÍLIO*\n📍 *Endereço:* ${order.customerData.address.street}, ${order.customerData.address.number}\n🏘️ *Bairro:* ${order.customerData.address.neighborhood}${
          order.customerData.address.complement ? `\n🏢 *Complemento:* ${order.customerData.address.complement}` : ''
        }${order.customerData.address.reference ? `\n🗺️ *Ponto de Ref:* ${order.customerData.address.reference}` : ''}`
      : `🏪 *MODALIDADE: RETIRADA NO BALCÃO*\n📍 *Local:* ${RESTAURANT_INFO.address}`;

  const paymentText =
    order.customerData.paymentMethod === 'pix'
      ? '🟢 PIX (Com 5% de desconto aplicado)'
      : order.customerData.paymentMethod === 'credit'
      ? '💳 Cartão de Crédito (Levar maquininha)'
      : order.customerData.paymentMethod === 'debit'
      ? '💳 Cartão de Débito (Levar maquininha)'
      : `💵 Dinheiro${order.customerData.cashChange ? ` (Levar troco para ${order.customerData.cashChange})` : ' (Valor exato)'}`;

  const subtotalLine = `• Subtotal: ${formatCurrency(order.subtotal)}`;
  const deliveryLine =
    order.deliveryFee > 0
      ? `• Taxa de Entrega: ${formatCurrency(order.deliveryFee)}`
      : `• Taxa de Entrega: Grátis`;
  const pixDiscount =
    order.customerData.paymentMethod === 'pix' ? order.subtotal * 0.05 : 0;
  const discountLine =
    pixDiscount > 0 ? `• Desconto PIX (5%): -${formatCurrency(pixDiscount)}\n` : '';

  const notesSection = order.customerData.notes
    ? `\n📝 *OBSERVAÇÕES GERAIS:*\n${order.customerData.notes}\n`
    : '';

  return (
    `🍔 *NOVO PEDIDO - ${RESTAURANT_INFO.name.toUpperCase()}*\n` +
    `🆔 *Pedido:* #${order.orderId}\n` +
    `⏰ *Horário:* ${order.createdAt}\n\n` +
    `👤 *DADOS DO CLIENTE:*\n` +
    `• *Nome:* ${order.customerData.name}\n` +
    `• *WhatsApp:* ${order.customerData.phone}\n\n` +
    `${addressText}\n\n` +
    `🛒 *ITENS DO PEDIDO:*\n` +
    `${itemsText}\n\n` +
    `💰 *RESUMO DE VALORES:*\n` +
    `${subtotalLine}\n` +
    `${deliveryLine}\n` +
    `${discountLine}` +
    `👉 *TOTAL A PAGAR:* *${formatCurrency(order.total)}*\n\n` +
    `💳 *FORMA DE PAGAMENTO:*\n${paymentText}\n` +
    `${notesSection}\n` +
    `⏱️ *Previsão Estimada:* ${order.estimatedTime}\n\n` +
    `Aguardando confirmação da hamburgueria! Obrigado!`
  );
}

export function getWhatsAppOrderUrl(order: CompletedOrder): string {
  const text = encodeURIComponent(buildWhatsAppMessage(order));
  return `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${text}`;
}
