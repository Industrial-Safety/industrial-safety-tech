"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, CreditCard, CheckCircle, Clock, Eye, DollarSign, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";

interface VoucherItem {
  orderNumber: string;
  courseName: string;
  date: string;
  paidAt: string | null;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
  receiptUrl: string | null;
}

export default function StudentPaymentVouchersPage() {
  const { data: session } = useSession();
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<VoucherItem | null>(null);

  useEffect(() => {
    if (!session?.dbId) return;
    fetchVouchers(session.dbId as string);
  }, [session?.dbId]);

  const fetchVouchers = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/orders/by-user/${userId}`);
      if (!res.ok) return;
      const orders: any[] = await res.json();

      const items: VoucherItem[] = orders
        .filter(o => o.orderStatus === "PAID")
        .flatMap(o =>
          (o.orderLineItemsList ?? []).map((item: any) => ({
            orderNumber: o.orderNumber,
            courseName: item.courseName ?? "Curso",
            date: o.createdAt,
            paidAt: o.paidAt,
            amount: Number(item.price ?? 0),
            currency: o.currency ?? "USD",
            status: o.orderStatus,
            receiptUrl: o.receiptUrl ?? null,
          }))
        );

      setVouchers(items);
    } catch (e) {
      console.error("Error cargando vouchers:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (voucher: VoucherItem) => {
    if (!voucher.receiptUrl) {
      alert("El recibo aún no está disponible. Intenta más tarde.");
      return;
    }
    const a = document.createElement("a");
    a.href = voucher.receiptUrl;
    a.target = "_blank";
    a.download = `voucher-${voucher.orderNumber}.pdf`;
    a.click();
  };

  const getStatusBadge = (status: VoucherItem["status"]) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-success/10 text-success border-success/30">Pagado</Badge>;
      case "PENDING":
        return <Badge className="bg-warning/10 text-warning border-warning/30">Pendiente</Badge>;
      default:
        return <Badge className="bg-danger/10 text-danger border-danger/30">{status}</Badge>;
    }
  };

  const totalPaid = vouchers.reduce((acc, v) => acc + v.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resúmenes de Pago</h1>
        <p className="text-muted">Descarga tus vouchers y comprobantes de transacciones.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted">Total Vouchers</p>
                <p className="text-2xl font-bold">{vouchers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg"><CheckCircle className="h-5 w-5 text-success" /></div>
              <div>
                <p className="text-xs text-muted">Total Pagado</p>
                <p className="text-2xl font-bold text-success">${totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg"><Clock className="h-5 w-5 text-warning" /></div>
              <div>
                <p className="text-xs text-muted">Cursos Adquiridos</p>
                <p className="text-2xl font-bold text-warning">{vouchers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listado */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" /> Historial de Transacciones
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cargando vouchers...
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No tienes comprobantes de pago aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vouchers.map((voucher, idx) => (
              <Card key={`${voucher.orderNumber}-${idx}`} className="bg-surface/60 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{voucher.courseName}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {voucher.paidAt
                              ? new Date(voucher.paidAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
                              : new Date(voucher.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            #{voucher.orderNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">${voucher.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted">{voucher.currency}</p>
                      </div>
                      {getStatusBadge(voucher.status)}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border"
                        onClick={() => setPreview(voucher)}
                        title="Vista previa"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(voucher)}
                        title="Descargar PDF"
                        disabled={!voucher.receiptUrl}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Modal de previsualización */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Vista Previa del Voucher</h3>
              </div>
              <button onClick={() => setPreview(null)} className="text-muted hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">Industrial Safety Tech</h2>
                <p className="text-xs text-muted">Comprobante de Pago</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Curso</p>
                    <p className="text-sm font-semibold">{preview.courseName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Monto</p>
                    <p className="text-lg font-bold text-primary">${preview.amount.toFixed(2)} {preview.currency}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Fecha de Pago</p>
                    <p className="text-sm">
                      {preview.paidAt
                        ? new Date(preview.paidAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">N° de Orden</p>
                    <p className="text-sm font-mono">{preview.orderNumber}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm font-semibold">Estado</p>
                  {getStatusBadge(preview.status)}
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg text-center">
                <p className="text-xs text-muted">Documento digital válido. Para consultas, contacta a soporte.</p>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPreview(null)}>Cerrar</Button>
              <Button onClick={() => handleDownload(preview)} disabled={!preview.receiptUrl}>
                <Download className="h-4 w-4 mr-2" /> Descargar PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
