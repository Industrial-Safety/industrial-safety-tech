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
  Plus,
  Eye,
  DollarSign,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface CourseOption {
  id: string;
  _id?: string;
  title: string;
  details?: { precio?: number };
}

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
  reviewerName?: string;
  reviewerComment?: string;
  createdAt: string;
  reviewedAt?: string;
}

export default function MarketingRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<PriceRequest[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState<PriceRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    courseTitle: "",
    currentPrice: 0,
    requestedPrice: "",
    justification: "",
  });

  const requesterId = String(session?.dbId ?? "");

  useEffect(() => {
    if (!requesterId) return;
    Promise.all([
      fetch(`/api/proxy/course/price-requests/my/${requesterId}`).then((r) => (r.ok ? r.json() : [])),
      fetch("/api/proxy/course").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([reqs, crs]) => {
        setRequests(Array.isArray(reqs) ? reqs : []);
        setCourses(Array.isArray(crs) ? crs : []);
      })
      .finally(() => setLoading(false));
  }, [requesterId]);

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find((c) => (c._id ?? c.id) === courseId);
    if (!course) return;
    setForm({
      ...form,
      courseId,
      courseTitle: course.title,
      currentPrice: course.details?.precio ?? 0,
      requestedPrice: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/proxy/course/price-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: form.courseId,
          courseTitle: form.courseTitle,
          currentPrice: form.currentPrice,
          requestedPrice: parseFloat(form.requestedPrice),
          justification: form.justification,
          requesterId,
          requesterName: session.user?.name ?? "Marketing",
          requesterEmail: session.user?.email ?? "",
        }),
      });
      if (!res.ok) throw new Error();
      const created: PriceRequest = await res.json();
      setRequests((prev) => [created, ...prev]);
      setCreateModalOpen(false);
      setForm({ courseId: "", courseTitle: "", currentPrice: 0, requestedPrice: "", justification: "" });
      toast.success("Solicitud enviada a Gerencia");
    } catch {
      toast.error("No se pudo enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const pending = requests.filter((r) => r.status === "PENDING");
  const resolved = requests.filter((r) => r.status !== "PENDING");

  const statusBadge = (status: PriceRequest["status"]) => {
    if (status === "PENDING") return <Badge className="bg-warning text-black"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    if (status === "APPROVED") return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" />Aprobada</Badge>;
    return <Badge className="bg-danger text-white"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Solicitudes de Precio</h1>
          <p className="text-muted">Envía solicitudes de cambio de precio de cursos para aprobación de Gerencia.</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Solicitud
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: requests.length, color: "text-pink-500", icon: FileText },
          { label: "Pendientes", value: pending.length, color: "text-warning", icon: Clock },
          { label: "Aprobadas", value: requests.filter((r) => r.status === "APPROVED").length, color: "text-success", icon: CheckCircle },
          { label: "Rechazadas", value: requests.filter((r) => r.status === "REJECTED").length, color: "text-danger", icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="bg-surface/40 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-current/10`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{loading ? "—" : value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Pendientes de Aprobación
        </h2>
        {pending.length === 0 ? (
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">No hay solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((req) => (
              <Card key={req.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{req.courseTitle}</h3>
                        <p className="text-xs text-muted">{new Date(req.createdAt).toLocaleDateString("es-ES")}</p>
                      </div>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted">Precio actual</p>
                      <p className="font-bold text-slate-300">${req.currentPrice.toFixed(2)}</p>
                    </div>
                    <span className="text-muted">→</span>
                    <div>
                      <p className="text-xs text-muted">Precio solicitado</p>
                      <p className="font-bold text-pink-400">${req.requestedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-border" onClick={() => setViewRequest(req)}>
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Resolved */}
      {resolved.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
            <CheckCircle className="h-5 w-5" /> Solicitudes Resueltas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resolved.map((req) => (
              <Card key={req.id} className="bg-surface/30 border-border opacity-80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${req.status === "APPROVED" ? "bg-success/10" : "bg-danger/10"}`}>
                        {req.status === "APPROVED" ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-danger" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{req.courseTitle}</h3>
                        <p className="text-xs text-muted">${req.currentPrice.toFixed(2)} → ${req.requestedPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    {statusBadge(req.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString("es-ES") : ""}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setViewRequest(req)}>
                      <Eye className="h-3 w-3 mr-1" /> Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nueva Solicitud de Precio</h3>
                  <p className="text-xs text-muted">Será revisada por Gerencia General</p>
                </div>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Curso</label>
                <select
                  value={form.courseId}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecciona un curso...</option>
                  {courses.map((c) => (
                    <option key={c._id ?? c.id} value={c._id ?? c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {form.courseId && (
                <div className="p-3 bg-surface-secondary/40 rounded-lg border border-border flex items-center gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted">Precio actual</p>
                    <p className="font-bold">${form.currentPrice.toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold">Nuevo precio solicitado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.requestedPrice}
                  onChange={(e) => setForm({ ...form, requestedPrice: e.target.value })}
                  placeholder="0.00"
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Justificación</label>
                <textarea
                  value={form.justification}
                  onChange={(e) => setForm({ ...form, justification: e.target.value })}
                  placeholder="Explica por qué se debe cambiar el precio..."
                  className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  required
                />
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Al aprobar, el precio del curso se actualizará automáticamente.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting} className="bg-pink-500 hover:bg-pink-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  {submitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg">{viewRequest.courseTitle}</h3>
              <button onClick={() => setViewRequest(null)} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted">Precio actual</p>
                  <p className="font-bold text-slate-300">${viewRequest.currentPrice.toFixed(2)}</p>
                </div>
                <span className="text-muted">→</span>
                <div>
                  <p className="text-xs text-muted">Precio solicitado</p>
                  <p className="font-bold text-pink-400">${viewRequest.requestedPrice.toFixed(2)}</p>
                </div>
                <div className="ml-auto">{statusBadge(viewRequest.status)}</div>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Justificación</p>
                <p className="text-sm">{viewRequest.justification}</p>
              </div>
              {viewRequest.reviewerComment && (
                <div className={`p-4 rounded-lg border ${viewRequest.status === "APPROVED" ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"}`}>
                  <p className="text-xs font-semibold mb-1">Respuesta de Gerencia ({viewRequest.reviewerName})</p>
                  <p className="text-sm">{viewRequest.reviewerComment}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button variant="ghost" onClick={() => setViewRequest(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
