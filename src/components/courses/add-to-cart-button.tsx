"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";

interface AddToCartButtonProps {
  courseId: string;
  title: string;
  price: string;
  image: string;
  instructorName: string;
}

export function AddToCartButton({ courseId, title, price, image, instructorName }: AddToCartButtonProps) {
  const { addToCart, removeFromCart, cart } = useCart();
  
  const isAdded = cart.some(item => item.id === courseId);

  const handleToggleCart = () => {
    if (isAdded) {
      removeFromCart(courseId);
    } else {
      addToCart({
        id: courseId,
        title,
        price,
        image,
        instructorName,
      });
    }
  };

  return (
    <Button 
      variant={isAdded ? "secondary" : "primary"} 
      onClick={handleToggleCart}
      className={`w-full mb-3 h-12 text-base font-bold transition-all duration-300 ${
        isAdded 
          ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white" 
          : "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
      }`}
    >
      {isAdded ? "Eliminar de la cesta" : "Añadir a la cesta"}
    </Button>
  );
}
