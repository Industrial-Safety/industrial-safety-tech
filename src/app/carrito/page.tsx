"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

type CheckoutPhase = "idle" | "submitting" | "awaiting_confirmation" | "confirmed" | "failed";

let mpInitialized = false;

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + parseFloat(item.price.replace("$", "")), 0),
    [cart]
  );
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  // Promote /carrito from "awaiting_confirmation" to "confirmed" / "failed"
  // when the WebSocket notification arrives.
  useEffect(() => {
    function onNotification(e: Event) {
      const detail = (e as CustomEvent).detail as { success?: boolean; message?: string };
      setPhase((current) => {
        if (current !== "awaiting_confirmation") return current;
        if (detail?.success === false) {
          setOrderError(detail.message ?? "El pago no fue aprobado.");
          return "failed";
        }
        return "confirmed";
      });
    }
    window.addEventListener("purchase-notification", onNotification);
    return () => window.removeEventListener("purchase-notification", onNotification);
  }, []);

  // Initialise MP SDK once with the publishable key.
  useEffect(() => {
    if (mpInitialized) return;
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!pk || pk.startsWith("REEMPLAZA")) {
      console.warn("[carrito] NEXT_PUBLIC_MP_PUBLIC_KEY no configurada");
      return;
    }
    console.log("[mp-brick] init pk prefix:", pk.slice(0, 12), "locale: es-PE");
    initMercadoPago(pk, { locale: "es-PE" });
    mpInitialized = true;
  }, []);

  // Log every Brick render so we see what amount we are sending.
  useEffect(() => {
    if (cart.length === 0) return;
    console.log("[mp-brick] Brick will render with amount:", Number(total.toFixed(2)));
  }, [cart.length, total]);

  const handleSubmit = async (formData: any) => {
    if (!session) {
      sessionStorage.setItem("postLoginRedirect", "/carrito");
      window.location.href = "/login";
      return;
    }

    setPhase("submitting");
    setOrderError(null);

    const body = {
      userId:
        (session?.keycloakId as string | undefined) ??
        (session?.dbId as string | undefined) ??
        "",
      userEmail: session?.user?.email ?? undefined,
      currency: "PEN",
      mpToken: formData.token,
      mpPaymentMethodId: formData.payment_method_id,
      mpInstallments: formData.installments ?? 1,
      mpIssuerId: formData.issuer_id ?? undefined,
      mpPayerEmail: formData.payer?.email ?? session?.user?.email,
      mpPayerIdType: formData.payer?.identification?.type,
      mpPayerIdNumber: formData.payer?.identification?.number,
      orderLineItemsList: cart.map((item) => ({
        idCurso: item.id,
        courseName: item.title,
        price: parseFloat(item.price.replace("$", "")),
      })),
    };

    try {
      const res = await fetch("/api/proxy/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail ?? data?.message ?? `HTTP ${res.status}`);
      }
      setOrderNumber(data?.orderNumber ?? null);
      // Order accepted as PENDING. payment-service charges async via RabbitMQ;
      // notification-service will fire a WebSocket alert when the result arrives.
      setPhase("awaiting_confirmation");
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setOrderError(message);
      setPhase("failed");
      throw err; // let the Brick show its own error feedback too
    }
  };

  // -------- Render branches --------

  if (phase === "confirmed") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              ¡Compra confirmada!
            </h1>
            <p className="text-slate-400 mb-2">
              Orden <span className="font-mono text-amber-400">{orderNumber ?? "—"}</span>
            </p>
            <p className="text-slate-400 mb-6">
              Te enviamos el recibo en PDF a tu correo y tus cursos ya están disponibles en tu biblioteca.
            </p>
            <Button
              onClick={() => (window.location.href = "/cursos")}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
            >
              Explorar más cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "awaiting_confirmation") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Procesando tu pago...
            </h1>
            <p className="text-slate-400 mb-2">
              Orden <span className="font-mono text-amber-400">{orderNumber ?? "—"}</span>
            </p>
            <p className="text-slate-400 mb-8">
              Estamos confirmando con MercadoPago. Verás una notificación apenas se apruebe.
            </p>
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Pago seguro vía MercadoPago</span>
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

        {orderError && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        {cart.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-slate-400 mb-6">
                Explora nuestros cursos y añade los que te interesen
              </p>
              <Button
                onClick={() => (window.location.href = "/cursos")}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                Explorar cursos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-amber-500 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{item.instructorName}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-amber-500">
                          S/ {parseFloat(item.price.replace('$', '')).toFixed(2)}
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

            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-900 border-slate-800 sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Resumen del pedido</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-400">
                      <span>
                        Subtotal ({cart.length} curso{cart.length !== 1 ? "s" : ""})
                      </span>
                      <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>IGV (18%)</span>
                      <span className="font-medium text-foreground">S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-amber-500">
                          S/ {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/cursos")}
                    variant="outline"
                    className="w-full border-slate-700 hover:bg-slate-800 font-semibold h-11 text-sm"
                  >
                    Seguir comprando
                  </Button>
                </CardContent>
              </Card>

              {total > 0 && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4">Pago</h2>
                    {process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.startsWith("REEMPLAZA") ? (
                      <div className="text-sm text-amber-400">
                        Configura <code>NEXT_PUBLIC_MP_PUBLIC_KEY</code> en <code>.env</code> para
                        habilitar el pago.
                      </div>
                    ) : (
                      <CardPayment
                        initialization={{
                          amount: Number(total.toFixed(2)),
                          payer: { email: session?.user?.email ?? "" },
                        }}
                        customization={{
                          paymentMethods: {
                            maxInstallments: 12,
                            types: { included: ["credit_card", "debit_card", "prepaid_card"] },
                          },
                        }}
                        onSubmit={async (formData: any) => {
                          await handleSubmit(formData);
                        }}
                        onError={(err: any) => {
                          console.error("[mp-brick] error keys:", Object.keys(err ?? {}));
                          console.error("[mp-brick] error stringified:", JSON.stringify(err, Object.getOwnPropertyNames(err ?? {})));
                          console.error("[mp-brick] error raw:", err);
                          if (err?.message) console.error("[mp-brick] message:", err.message);
                          if (err?.cause) console.error("[mp-brick] cause:", err.cause);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
