"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Users,
  Package,
  Truck,
  DollarSign,
  X,
  Percent,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface PriceRequest {
  id: string;
  courseId: string;
  courseTitle: string;
  currentPrice: number;
  requestedPrice: number;
  justification: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewerId?: string;
  reviewerName?: string;
  reviewerComment?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface LogisticsRequest {
  id: string;
  requestedBy: string;
  requestedByEmail: string;
  category: string;
  quantity: number;
  estimatedCost: number;
  supplier: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  gerenciaResponse?: string;
  resolvedDate?: string;
}

const MOCK_LOGISTICS: LogisticsRequest[] = [
  {
    id: "LOG-2026-145",
    requestedBy: "Carlos Ruiz",
    requestedByEmail: "carlos.ruiz@prevenciontech.com",
    category: "Guantes de Nitrilo",
    quantity: 500,
    estimatedCost: 1250.00,
    supplier: "3M Perú S.A.",
    description: "Reposición urgente de guantes de nitrilo. Stock actual en nivel crítico (10 unidades).",
    status: "pending",
    submittedDate: "2026-04-24"
  },
  {
    id: "LOG-2026-144",
    requestedBy: "Carlos Ruiz",
    requestedByEmail: "carlos.ruiz@prevenciontech.com",
    category: "Cascos de Seguridad Tipo 1",
    quantity: 150,
    estimatedCost: 3400.00,
    supplier: "MSA Safety",
    description: "Reposición trimestral de cascos para el personal de planta.",
    status: "approved",
    submittedDate: "2026-04-22",
    gerenciaResponse: "Aprobado. Coordinar entrega con almacén.",
    resolvedDate: "2026-04-23"
  },
];

export default function GerenciaRequestsPage() {
  const { data: session } = useSession();
  const [priceRequests, setPriceRequests] = useState<PriceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<PriceRequest | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [logisticsRequests] = useState<LogisticsRequest[]>(MOCK_LOGISTICS);

  useEffect(() => {
    fetch("/api/proxy/course/price-requests")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPriceRequests(Array.isArray(data) ? data : []))
      .catch(() => setPriceRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (approved: boolean) => {
    if (!reviewModal || !session) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/proxy/course/price-requests/${reviewModal.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved,
          reviewerId: String(session.dbId ?? ""),
          reviewerName: session.user?.name ?? "Gerencia",
          reviewerComment: reviewComment,
        }),
      });
      if (!res.ok) throw new Error();
      const updated: PriceRequest = await res.json();
      setPriceRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setReviewModal(null);
      setReviewComment("");
      toast.success(approved ? "Solicitud aprobada" : "Solicitud rechazada");
    } catch {
      toast.error("No se pudo procesar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: PriceRequest["status"] | "pending" | "approved" | "rejected") => {
    const s = status.toUpperCase();
    if (s === "PENDING") return <Badge className="bg-warning text-black"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    if (s === "APPROVED") return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" />Aprobada</Badge>;
    return <Badge className="bg-danger text-white"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
  };

  const pendingPrice = priceRequests.filter((r) => r.status === "PENDING");
  const resolvedPrice = priceRequests.filter((r) => r.status !== "PENDING");
  const pendingLogistics = logisticsRequests.filter((r) => r.status === "pending");
  const resolvedLogistics = logisticsRequests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-teal-500" /> Solicitudes de Gerencia
        </h1>
        <p className="text-muted">Revisa y aprueba las solicitudes de Marketing y Logística.</p>
      </div>

      {/* Marketing / Price Change */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-pink-500" /> Solicitudes de Cambio de Precio
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { label: "Total", value: priceRequests.length, color: "text-teal-500" },
            { label: "Pendientes", value: pendingPrice.length, color: "text-warning" },
            { label: "Aprobadas", value: priceRequests.filter((r) => r.status === "APPROVED").length, color: "text-success" },
            { label: "Rechazadas", value: priceRequests.filter((r) => r.status === "REJECTED").length, color: "text-danger" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="bg-surface/40 border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{loading ? "—" : value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-warning" /> Pendientes
        </h3>
        {pendingPrice.length === 0 ? (
          <Card className="bg-surface/40 border-border mb-6">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">No hay solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {pendingPrice.map((req) => (
              <Card key={req.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{req.courseTitle}</h3>
                        <p className="text-xs text-muted">Por: {req.requesterName}</p>
                      </div>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted">Actual</p>
                      <p className="font-bold">${req.currentPrice.toFixed(2)}</p>
                    </div>
                    <span className="text-muted">→</span>
                    <div>
                      <p className="text-xs text-muted">Solicitado</p>
                      <p className="font-bold text-pink-400">${req.requestedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-teal-500/30 text-teal-500 hover:bg-teal-500/10"
                    onClick={() => { setReviewModal(req); setReviewComment(""); }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Revisar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {resolvedPrice.length > 0 && (
          <>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-muted">
              <CheckCircle className="h-4 w-4" /> Resueltas
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resolvedPrice.map((req) => (
                <Card key={req.id} className="bg-surface/30 border-border opacity-80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{req.courseTitle}</p>
                        <p className="text-xs text-muted">${req.currentPrice.toFixed(2)} → ${req.requestedPrice.toFixed(2)}</p>
                      </div>
                      {statusBadge(req.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString("es-ES") : ""}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => { setReviewModal(req); setReviewComment(""); }}>
                        <Eye className="h-3 w-3 mr-1" /> Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Logistics */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-rose-500" /> Logística
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          {[
            { label: "Total", value: logisticsRequests.length, color: "text-rose-500" },
            { label: "Pendientes", value: pendingLogistics.length, color: "text-warning" },
            { label: "Aprobadas", value: logisticsRequests.filter((r) => r.status === "approved").length, color: "text-success" },
            { label: "Rechazadas", value: logisticsRequests.filter((r) => r.status === "rejected").length, color: "text-danger" },
          ].map(({ label, value, color }) => (
            <Card key={label} className="bg-surface/40 border-border">
              <CardContent className="p-4">
                <p className="text-xs text-muted">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-warning" /> Pendientes
        </h3>
        {pendingLogistics.length === 0 ? (
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">No hay solicitudes de Logística pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingLogistics.map((req) => (
              <Card key={req.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{req.category}</h3>
                        <p className="text-xs text-muted">{req.id}</p>
                        <p className="text-xs text-muted">Por: {req.requestedBy}</p>
                      </div>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                  <div className="space-y-1 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted" />
                      <span className="text-muted">Cantidad:</span>
                      <span className="font-medium">{req.quantity} uds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted" />
                      <span className="text-muted">Costo:</span>
                      <span className="font-medium text-rose-400">${req.estimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted" />
                      <span className="text-muted">Enviada:</span>
                      <span className="font-medium">{new Date(req.submittedDate).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted line-clamp-2 mb-4">{req.description}</p>
                  <Button variant="outline" size="sm" className="w-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
                    <Eye className="h-4 w-4 mr-2" /> Ver (módulo logístico en desarrollo)
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  reviewModal.status === "PENDING" ? "bg-warning/10" :
                  reviewModal.status === "APPROVED" ? "bg-success/10" : "bg-danger/10"
                }`}>
                  {reviewModal.status === "PENDING" ? <Clock className="h-5 w-5 text-warning" /> :
                   reviewModal.status === "APPROVED" ? <CheckCircle className="h-5 w-5 text-success" /> :
                   <XCircle className="h-5 w-5 text-danger" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Revisar Solicitud</h3>
                  <p className="text-xs text-muted">{reviewModal.courseTitle}</p>
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                <div className="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <p className="font-bold text-sm">{reviewModal.requesterName}</p>
                  <p className="text-xs text-muted">{reviewModal.requesterEmail}</p>
                  <p className="text-xs text-muted">{new Date(reviewModal.createdAt).toLocaleDateString("es-ES")}</p>
                </div>
                <div className="ml-auto">{statusBadge(reviewModal.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                <div>
                  <p className="text-xs text-muted mb-1">Precio actual</p>
                  <p className="text-lg font-bold">${reviewModal.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Precio solicitado</p>
                  <p className="text-lg font-bold text-pink-400">${reviewModal.requestedPrice.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-500" /> Justificación
                </h4>
                <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <p className="text-sm">{reviewModal.justification}</p>
                </div>
              </div>

              {reviewModal.status === "PENDING" ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-teal-500" /> Decisión de Gerencia
                  </h4>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Escribe tu comentario (opcional)..."
                    className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  />
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-success hover:bg-success/90 text-white"
                      disabled={submitting}
                      onClick={() => handleReview(true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {submitting ? "..." : "Aprobar"}
                    </Button>
                    <Button
                      className="flex-1 bg-danger hover:bg-danger/90 text-white"
                      disabled={submitting}
                      onClick={() => handleReview(false)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {submitting ? "..." : "Rechazar"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted">Al aprobar, el precio del curso se actualizará automáticamente.</p>
                </div>
              ) : (
                <div className={`p-4 rounded-lg border ${reviewModal.status === "APPROVED" ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"}`}>
                  <p className="text-sm font-semibold mb-1">
                    {reviewModal.status === "APPROVED" ? "APROBADA" : "RECHAZADA"} — por {reviewModal.reviewerName}
                  </p>
                  {reviewModal.reviewerComment && <p className="text-sm">{reviewModal.reviewerComment}</p>}
                  <p className="text-xs text-muted mt-2">
                    {reviewModal.reviewedAt ? new Date(reviewModal.reviewedAt).toLocaleDateString("es-ES") : ""}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="ghost" onClick={() => setReviewModal(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
