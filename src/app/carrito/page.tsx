"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, ArrowLeft, Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress bar animation during checkout
  useEffect(() => {
    if (isCheckingOut) {
      const startTime = Date.now();
      const duration = 10000; // 10 seconds
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(timer);
        }
      }, 100);
      
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isCheckingOut]);

  const subtotal = cart.reduce(
    (acc, item) => acc + parseFloat(item.price.replace("$", "")),
    0
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const handleCheckout = () => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      alert("Debes iniciar sesión para finalizar la compra.");
      sessionStorage.setItem("postLoginRedirect", "/carrito");
      window.location.href = "/login";
      return;
    }

    setIsCheckingOut(true);
    // Simulación de proceso de pago - 10 segundos
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      clearCart();
    }, 10000);
  };

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ¡Compra realizada con éxito!
            </h1>
            <p className="text-slate-400 mb-6">
              Gracias por tu compra. Los cursos han sido añadidos a tu biblioteca.
            </p>
            <Button onClick={() => window.location.href = "/cursos"} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
              Explorar más cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Checkout loading screen
  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            {/* Animated Loader */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Procesando tu compra...
            </h1>
            <p className="text-slate-400 mb-8">
              Por favor espera, estamos validando tu pedido
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between text-xs text-slate-500 mt-6">
              <span className={progress >= 10 ? "text-amber-500" : ""}>Validando</span>
              <span className={progress >= 40 ? "text-amber-500" : ""}>Procesando</span>
              <span className={progress >= 70 ? "text-amber-500" : ""}>Confirmando</span>
              <span className={progress >= 100 ? "text-emerald-500" : ""}>Completado</span>
            </div>

            {/* Security Info */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Pago 100% seguro y encriptado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver a cursos</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-amber-500" />
            Resumen de Compra
          </h1>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-slate-400 mb-6">
                Explora nuestros cursos y añade los que te interesen
              </p>
              <Button onClick={() => window.location.href = "/cursos"} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                Explorar cursos
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Cart Items + Summary */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Cursos seleccionados ({cart.length})
              </h2>
              {cart.map((item) => (
                <Card
                  key={item.id}
                  className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative h-24 w-32 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-amber-500 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {item.instructorName}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-amber-500">
                          {item.price}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-900 border-slate-800 sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Resumen del pedido
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal ({cart.length} curso{cart.length !== 1 ? "s" : ""})</span>
                      <span className="font-medium text-foreground">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>IGV (18%)</span>
                      <span className="font-medium text-foreground">
                        ${igv.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-amber-500">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Procesando...
                        </span>
                      ) : (
                        "Finalizar compra"
                      )}
                    </Button>
                    <Button onClick={() => window.location.href = "/cursos"} variant="outline" className="w-full border-slate-700 hover:bg-slate-800 font-semibold h-11 text-sm">
                      Seguir comprando
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Pago seguro y encriptado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
