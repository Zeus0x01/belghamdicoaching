"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function AddToCartButton({
  productId,
  price,
  full = true,
}: {
  productId: string;
  price: number;
  full?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onClick = () => {
    add(productId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="flex items-center gap-4">
      <button onClick={onClick} className={`btn-primary ${full ? "flex-1" : ""}`} type="button">
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> Added to Cart
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart — LE {price}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
