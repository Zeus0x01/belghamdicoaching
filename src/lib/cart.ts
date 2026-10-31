import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CATALOG, type Product } from "@/lib/catalog";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  hydrated: () => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, { productId, quantity }] });
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      hydrated: () => true,
    }),
    { name: "bc_cart", storage: createJSONStorage(() => localStorage) }
  )
);

export const cartProducts = (items: CartItem[]): { product: Product; quantity: number }[] =>
  items
    .map((item) => ({
      product: CATALOG.find((p) => p.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((entry): entry is { product: Product; quantity: number } => Boolean(entry.product));

export const cartTotal = (items: CartItem[]): number =>
  cartProducts(items).reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);

export const cartCount = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.quantity, 0);
