"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  Eye,
  Mail,
  DollarSign
} from "lucide-react";

interface PaymentVoucher {
  id: string;
  concept: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "processing";
  paymentMethod: string;
  transactionId: string;
  period: string;
}

const vouchers: PaymentVoucher[] = [
  {
    id: "1",
    concept: "Certificación en Seguridad Industrial",
    date: "2025-03-15",
    amount: 150.00,
    status: "paid",
    paymentMethod: "Tarjeta de Crédito ****4532",
    transactionId: "TXN-2025-001234",
    period: "Marzo 2025"
  },
  {
    id: "2",
    concept: "Curso Avanzado de EPP",
    date: "2025-02-20",
    amount: 89.90,
    status: "paid",
    paymentMethod: "PayPal",
    transactionId: "TXN-2025-005678",
    period: "Febrero 2025"
  },
  {
    id: "3",
    concept: "Recertificación Primeros Auxilios",
    date: "2025-01-10",
    amount: 75.00,
    status: "paid",
    paymentMethod: "Transferencia Bancaria",
    transactionId: "TXN-2025-009012",
    period: "Enero 2025"
  },
  {
    id: "4",
    concept: "Suscripción Premium Anual",
    date: "2025-04-01",
    amount: 299.99,
    status: "pending",
    paymentMethod: "Tarjeta de Débito ****8765",
    transactionId: "TXN-2025-003456",
    period: "Abril 2025"
  }
];

export default function StudentPaymentVouchersPage() {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<PaymentVoucher | null>(null);

  const getStatusBadge = (status: PaymentVoucher["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/10 text-success border-success/30">Pagado</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/30">Pendiente</Badge>;
      case "processing":
        return <Badge className="bg-primary/10 text-primary border-primary/30">Procesando</Badge>;
    }
  };

  const handlePreview = (voucher: PaymentVoucher) => {
    setSelectedVoucher(voucher);
    setPreviewModalOpen(true);
  };

  const handleDownload = (voucher: PaymentVoucher) => {
    // Simulación de descarga de PDF
    alert(`Descargando voucher: ${voucher.concept}.pdf`);
  };

  const handleEmail = (voucher: PaymentVoucher) => {
    alert(`Enviando voucher a tu correo registrado...`);
  };

  const totalPaid = vouchers.filter(v => v.status === "paid").reduce((acc, v) => acc + v.amount, 0);
  const totalPending = vouchers.filter(v => v.status === "pending" || v.status === "processing").reduce((acc, v) => acc + v.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resúmenes de Pago</h1>
          <p className="text-muted">Descarga tus vouchers de pago y comprobantes de transacciones.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
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
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
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
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted">Pendiente</p>
                <p className="text-2xl font-bold text-warning">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers List */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" /> Historial de Transacciones
        </h2>
        <div className="space-y-3">
          {vouchers.map((voucher) => (
            <Card key={voucher.id} className="bg-surface/60 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon & Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{voucher.concept}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(voucher.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {voucher.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">${voucher.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted">{voucher.period}</p>
                    </div>
                    {getStatusBadge(voucher.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border"
                      onClick={() => handlePreview(voucher)}
                      title="Ver voucher"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border"
                      onClick={() => handleEmail(voucher)}
                      title="Enviar por email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleDownload(voucher)}
                      title="Descargar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Preview Modal */}
      {previewModalOpen && selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Vista Previa del Voucher</h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Voucher Content */}
            <div className="p-6">
              {/* Company Header */}
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">PrevenciónTech</h2>
                <p className="text-xs text-muted">Comprobante de Pago</p>
              </div>

              {/* Voucher Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Concepto</p>
                    <p className="text-sm font-semibold">{selectedVoucher.concept}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Monto</p>
                    <p className="text-lg font-bold text-primary">${selectedVoucher.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Fecha de Pago</p>
                    <p className="text-sm">{new Date(selectedVoucher.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Período</p>
                    <p className="text-sm">{selectedVoucher.period}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted mb-1">Método de Pago</p>
                    <p className="text-sm">{selectedVoucher.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">ID Transacción</p>
                    <p className="text-sm font-mono">{selectedVoucher.transactionId}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Estado</p>
                    {getStatusBadge(selectedVoucher.status)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg text-center">
                <p className="text-xs text-muted">
                  Este comprobante es un documento digital válido. Para consultas, contacta a soporte.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setPreviewModalOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => handleDownload(selectedVoucher)}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
