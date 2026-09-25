export type ProductCategory = 'burgers' | 'drinks' | 'desserts' | 'combos';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  imageUrl: string;
  tag?: string;
  prepTime?: string;
  weightOrVolume?: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash';

export interface CustomerOrderData {
  name: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    reference?: string;
  };
  paymentMethod: PaymentMethod;
  cashChange?: string;
  notes?: string;
}

export interface CompletedOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customerData: CustomerOrderData;
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedTime: string;
}
