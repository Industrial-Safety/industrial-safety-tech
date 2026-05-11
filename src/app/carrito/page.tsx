"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, ArrowLeft, Check, AlertTriangle, Tag, X, Loader2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

type CheckoutPhase = "idle" | "submitting" | "awaiting_confirmation" | "confirmed" | "failed";

interface CouponPreview {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  discountAmount: number;
  finalAmount: number;
}

let mpInitialized = false;

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<CouponPreview | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + parseFloat(item.price.replace("$", "")), 0),
    [cart]
  );

  const discountAmount = couponApplied?.discountAmount ?? 0;
  const discountedSubtotal = subtotal - discountAmount;
  const igv = discountedSubtotal * 0.18;
  const total = discountedSubtotal + igv;

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

  useEffect(() => {
    if (mpInitialized) return;
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!pk || pk.startsWith("REEMPLAZA")) return;
    initMercadoPago(pk, { locale: "es-PE" });
    mpInitialized = true;
  }, []);

  // Reset coupon if cart changes
  useEffect(() => {
    setCouponApplied(null);
    setCouponError(null);
    setCouponInput("");
  }, [cart.length]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setCouponApplied(null);
    try {
      const firstCourseId = cart[0]?.id ?? "";
      const res = await fetch(
        `/api/proxy/orders/coupons/preview?code=${encodeURIComponent(couponInput.trim())}&courseId=${firstCourseId}&amount=${subtotal.toFixed(2)}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setCouponError(err?.detail ?? "Cupón inválido o expirado");
        return;
      }
      const data: CouponPreview = await res.json();
      setCouponApplied(data);
    } catch {
      setCouponError("No se pudo validar el cupón");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponInput("");
    setCouponError(null);
  };

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
      couponCode: couponApplied?.code ?? null,
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
      setPhase("awaiting_confirmation");
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setOrderError(message);
      setPhase("failed");
      throw err;
    }
  };

  if (phase === "confirmed") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">¡Compra confirmada!</h1>
            <p className="text-slate-400 mb-2">
              Orden <span className="font-mono text-amber-400">{orderNumber ?? "—"}</span>
            </p>
            {couponApplied && (
              <p className="text-emerald-400 text-sm mb-2">
                Cupón <strong>{couponApplied.code}</strong> aplicado — ahorraste S/{" "}
                {discountAmount.toFixed(2)}
              </p>
            )}
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Procesando tu pago...</h1>
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
              <h2 className="text-xl font-bold text-foreground mb-2">Tu carrito está vacío</h2>
              <p className="text-slate-400 mb-6">Explora nuestros cursos y añade los que te interesen</p>
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
            {/* Course list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Cursos seleccionados ({cart.length})
              </h2>
              {cart.map((item) => (
                <Card key={item.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group">
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
                          S/ {parseFloat(item.price.replace("$", "")).toFixed(2)}
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

            {/* Summary + payment */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-slate-900 border-slate-800 sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Resumen del pedido</h2>

                  {/* Coupon input */}
                  {!couponApplied ? (
                    <div className="mb-5">
                      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 block">
                        Cupón de descuento
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ej: EPP20"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => { if (e.key === "Enter") handleApplyCoupon(); }}
                          className="bg-slate-800 border-slate-700 font-mono uppercase text-sm"
                          disabled={couponLoading}
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim() || couponLoading}
                          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                        >
                          {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> {couponError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-400" />
                        <div>
                          <p className="text-sm font-bold text-emerald-400 font-mono">{couponApplied.code}</p>
                          <p className="text-xs text-emerald-300/70">
                            {couponApplied.discountType === "PERCENTAGE"
                              ? `${couponApplied.value}% de descuento`
                              : `S/ ${couponApplied.value} de descuento`}
                          </p>
                        </div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal ({cart.length} curso{cart.length !== 1 ? "s" : ""})</span>
                      <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
                    </div>

                    {couponApplied && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Descuento ({couponApplied.code})</span>
                        <span className="font-semibold">- S/ {discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400">
                      <span>IGV (18%)</span>
                      <span className="font-medium text-foreground">S/ {igv.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-slate-800 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">Total</span>
                        <div className="text-right">
                          {couponApplied && (
                            <p className="text-xs text-slate-500 line-through">
                              S/ {(subtotal * 1.18).toFixed(2)}
                            </p>
                          )}
                          <span className="text-2xl font-bold text-amber-500">
                            S/ {total.toFixed(2)}
                          </span>
                        </div>
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
                        Configura <code>NEXT_PUBLIC_MP_PUBLIC_KEY</code> en <code>.env</code> para habilitar el pago.
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
                        onSubmit={async (formData: any) => { await handleSubmit(formData); }}
                        onError={(err: any) => {
                          console.error("[mp-brick] error:", err);
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
