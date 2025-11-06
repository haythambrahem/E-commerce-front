import { OrderItem } from './order-item';
import { User } from './user';
export interface Order {
  id?: number;
  date?: string;
  total: number;
  status: string;
  orderitemList: OrderItem[];
  user?: User;
}