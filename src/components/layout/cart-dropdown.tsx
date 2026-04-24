"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";

export function CartDropdown() {
  const { cart, cartCount, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <ShoppingCart className="h-5 w-5 text-muted hover:text-foreground transition-colors" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
            {cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-xl border border-slate-700 bg-surface shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-foreground">Tu cesta ({cartCount})</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Tu cesta está vacía.
                <div className="mt-4">
                  <Link href="/cursos" onClick={() => setIsOpen(false)} className="text-amber-400 font-semibold hover:underline">
                    Explorar cursos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 border-b border-slate-800 last:border-b-0 flex gap-4 group">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0 border border-slate-700">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/cursos/${item.id}`} onClick={() => setIsOpen(false)} className="font-bold text-sm text-foreground line-clamp-2 hover:text-amber-400 transition-colors">
                        {item.title}
                      </Link>
                      <div className="text-xs text-slate-400 mt-1 line-clamp-1">{item.instructorName}</div>
                      <div className="font-bold text-foreground mt-2">{item.price}</div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }} 
                      className="text-slate-500 hover:text-red-400 transition-colors self-start opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-surface-secondary/20">
              <div className="flex items-center justify-between font-bold text-lg mb-4 text-foreground">
                <span className="text-slate-400 text-base">Total:</span>
                <span className="text-amber-500 text-xl">
                  ${cart.reduce((acc, item) => acc + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => window.location.href = "/carrito"} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12 text-base">
                  Ir a pagar
                </Button>
                <Button onClick={() => window.location.href = "/cursos"} variant="outline" className="w-full border-slate-700 hover:bg-slate-800 font-semibold h-11 text-sm">
                  Seguir comprando
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
