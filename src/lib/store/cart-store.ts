import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  sku: string;
  slug: string;
}

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  discountType: "PERCENTAGE" | "FIXED";
}

export interface CartStore {
  items: CartItem[];
  customerName: string;
  appliedCoupon: AppliedCoupon | null;
  isOpen: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerName: (name: string) => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: "",
      appliedCoupon: null,
      isOpen: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addItem: (item) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const currentQty = updatedItems[existingItemIndex].quantity;
          
          // Enforce stock limit
          if (currentQty < item.stock) {
            updatedItems[existingItemIndex].quantity += 1;
            set({ items: updatedItems, isOpen: true });
          }
        } else {
          // If first add, ensure we don't exceed stock (though item.quantity is usually 1)
          if (item.stock > 0) {
            set({ items: [...currentItems, item], isOpen: true });
          }
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        
        set({
          items: get().items.map((i) => {
            if (i.id === id) {
              // Clamp quantity to stock
              const finalQty = Math.min(quantity, i.stock);
              return { ...i, quantity: finalQty };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),
      
      setCustomerName: (customerName) => set({ customerName }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setOpen: (open) => set({ isOpen: open }),

      applyCoupon: (appliedCoupon) => set({ appliedCoupon }),
      
      removeCoupon: () => set({ appliedCoupon: null }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        const subtotal = get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        const coupon = get().appliedCoupon;
        if (!coupon) return subtotal;

        if (coupon.discountType === "PERCENTAGE") {
          return subtotal * (1 - coupon.discountValue / 100);
        }

        return Math.max(0, subtotal - coupon.discountValue);
      },
    }),
    {
      name: "shop-tattoo-cart", // key in localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Silently fail if storage is full or disabled
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
