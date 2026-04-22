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
  const { addToCart, cart } = useCart();
  
  const isAdded = cart.some(item => item.id === courseId);

  const handleAddToCart = () => {
    addToCart({
      id: courseId,
      title,
      price,
      image,
      instructorName,
    });
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`w-full mb-3 h-12 text-base font-bold ${
        isAdded 
          ? "bg-slate-700 hover:bg-slate-700 text-slate-300 cursor-not-allowed opacity-80" 
          : "bg-amber-500 hover:bg-amber-600 text-slate-950"
      }`}
    >
      {isAdded ? "Añadido a la cesta" : "Añadir a la cesta"}
    </Button>
  );
}
