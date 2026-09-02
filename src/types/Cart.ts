import { Product, ProductVariant, JewelryFinish } from "./Product";

export interface CartItem {
  cartItemId: string;
  product: Product;
  variant: ProductVariant;
  finish: JewelryFinish;
  size?: string;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  shipping: number;
  total: number;
  isParureDiscountApplied: boolean;
  freeShippingProgress: number; // 0 to 100
  itemsCount: number;
}
