export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  productPrice?: number;
  quantity: number;
  subtotal?: number;
}

export interface Order {
  id?: number;
  date?: string;
  total?: number;
  status?: OrderStatus;
  userId: number;
  userName?: string;
  orderItems?: OrderItem[];
}
