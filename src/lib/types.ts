import type { CartItem } from "./cart-store";

export type OrderStatus = "new" | "preparing" | "done";

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  note: string;
  items: CartItem[];
  total: number;
  order_details: string;
  status: OrderStatus;
  estimated_minutes: number | null;
  created_at: string;
};
