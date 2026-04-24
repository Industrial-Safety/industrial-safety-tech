"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";

interface CardAddToCartButtonProps {
  courseId: string;
  title: string;
  price: string;
  image: string;
  instructorName: string;
}

export function CardAddToCartButton({ courseId, title, price, image, instructorName }: CardAddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isAddedToCart = cart.some(item => item.id === courseId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAddedToCart) {
      addToCart({
        id: courseId,
        title,
        price,
        image,
        instructorName,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const displayAdded = isAdded || isAddedToCart;

  return (
    <button
      onClick={handleAddToCart}
      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-20 ${
        displayAdded
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : "bg-slate-950/60 text-slate-300 hover:bg-amber-500 hover:text-slate-950 hover:shadow-lg hover:shadow-amber-500/30"
      }`}
      title={displayAdded ? "Añadido a la cesta" : "Añadir a la cesta"}
    >
      {displayAdded ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </button>
  );
}
