"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  Camera as CameraIcon,
  Eye,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { getAppeals, resolveAppeal, Incident } from "@/services/incidentService";

export default function JefeAppealsPage() {
  const { data: session } = useSession();
  const reviewerId = (session as any)?.keycloakId as string | undefined;

  const [appeals, setAppeals] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!reviewerId) return;
    getAppeals(reviewerId, false)
      .then(setAppeals)
      .catch(() => setAppeals([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [reviewerId]);

  const pendingAppeals = appeals.filter((a) => a.appealStatus === "PENDING");
  const resolvedAppeals = appeals.filter((a) => a.appealStatus !== "PENDING");

  const statusBadge = (s: Incident["appealStatus"]) => {
    if (s === "PENDING")
      return <Badge className="bg-warning text-black"><Clock className="h-3 w-3 mr-1" /> Pendiente</Badge>;
    if (s === "APPROVED")
      return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" /> Aprobada</Badge>;
    return <Badge className="bg-danger text-white"><XCircle className="h-3 w-3 mr-1" /> Rechazada</Badge>;
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "—";

  const openReview = (inc: Incident) => {
    setSelected(inc);
    setNote("");
  };

  const handleResolve = async (approved: boolean) => {
    if (!selected || !reviewerId) return;
    setSubmitting(true);
    try {
      await resolveAppeal(selected.id, reviewerId, approved, note.trim());
      toast.success(
        approved
          ? "Apelación aprobada: infracción anulada y puntaje restablecido."
          : "Apelación rechazada: la infracción se mantiene."
      );
      setSelected(null);
      setNote("");
      load();
    } catch (e: any) {
      toast.error(e?.message ? `Error: ${e.message}` : "No se pudo resolver la apelación");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <Gavel className="h-8 w-8 text-primary" /> Gestión de Apelaciones
        </h1>
        <p className="text-muted">Apelaciones de las infracciones que tú confirmaste. Resuélvelas aceptando o rechazando.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Gavel className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted">Total</p><p className="text-2xl font-bold">{appeals.length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg"><Clock className="h-5 w-5 text-warning" /></div>
            <div><p className="text-xs text-muted">Pendientes</p><p className="text-2xl font-bold text-warning">{pendingAppeals.length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div><p className="text-xs text-muted">Aprobadas</p><p className="text-2xl font-bold text-success">{appeals.filter((a) => a.appealStatus === "APPROVED").length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg"><XCircle className="h-5 w-5 text-danger" /></div>
            <div><p className="text-xs text-muted">Rechazadas</p><p className="text-2xl font-bold text-danger">{appeals.filter((a) => a.appealStatus === "REJECTED").length}</p></div>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Apelaciones Pendientes
        </h2>
        {pendingAppeals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingAppeals.map((a) => (
              <Card key={a.id} className="bg-surface/60 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold flex flex-wrap gap-1">
                        {a.violationTypes.map((v, i) => (
                          <span key={i} className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded border border-danger/20">{v}</span>
                        ))}
                      </h3>
                      <p className="text-xs text-muted mt-1 font-mono">{a.id.slice(0, 8)}</p>
                    </div>
                    {statusBadge(a.appealStatus)}
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2"><CameraIcon className="h-4 w-4 text-muted" /><span className="text-muted">Cámara:</span><span className="font-medium">{a.cameraKey}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted" /><span className="text-muted">Detectado:</span><span className="font-medium">{formatDate(a.detectedAt)}</span></div>
                    <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-muted" /><span className="text-muted">Puntos descontados:</span><span className="font-medium text-danger">-{a.pointsDeducted ?? 0}</span></div>
                  </div>

                  <div className="p-3 bg-surface-secondary/50 rounded-lg border border-border mb-4">
                    <p className="text-xs font-semibold mb-1">Motivo del trabajador:</p>
                    <p className="text-sm text-muted line-clamp-3">{a.appealReason}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => openReview(a)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Revisar Apelación
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">¡No hay apelaciones pendientes!</p>
              <p className="text-sm text-muted mt-1">Todas las apelaciones de tus infracciones están resueltas.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {resolvedAppeals.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
            <CheckCircle className="h-5 w-5" /> Apelaciones Resueltas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resolvedAppeals.map((a) => (
              <Card key={a.id} className="bg-surface/30 border-border opacity-80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">{a.violationTypes.join(", ")}</h3>
                      <p className="text-xs text-muted">{a.cameraKey}</p>
                    </div>
                    {statusBadge(a.appealStatus)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Resuelta: {formatDate(a.appealResolvedAt)}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => openReview(a)}>
                      <Eye className="h-3 w-3 mr-1" /> Ver detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/30 sticky top-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Revisar Apelación</h3>
                  <p className="text-xs text-muted font-mono">{selected.id.slice(0, 8)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} disabled={submitting} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-danger" /> Infracción</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border text-sm">
                  <div><p className="text-xs text-muted mb-1">Infracciones</p><p className="font-semibold">{selected.violationTypes.join(", ")}</p></div>
                  <div><p className="text-xs text-muted mb-1">Cámara</p><p className="font-semibold">{selected.cameraKey}</p></div>
                  <div><p className="text-xs text-muted mb-1">Detectado</p><p className="font-semibold">{formatDate(selected.detectedAt)}</p></div>
                  <div><p className="text-xs text-muted mb-1">Puntos descontados</p><p className="font-semibold text-danger">-{selected.pointsDeducted ?? 0}</p></div>
                </div>
              </div>

              {selected.evidenceUrl && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Evidencia</p>
                  <div className="w-full h-44 bg-black/30 rounded border border-border overflow-hidden">
                    <img src={selected.evidenceUrl} alt="Evidencia" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Motivo del trabajador</h4>
                <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <p className="text-sm whitespace-pre-wrap">{selected.appealReason}</p>
                  <p className="text-xs text-muted mt-2">Apelada el {formatDate(selected.appealedAt)}</p>
                </div>
              </div>

              {selected.appealStatus === "PENDING" ? (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Resolución</h4>
                  <textarea
                    placeholder="Justificación de tu decisión (opcional)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-surface border border-border rounded-md p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                  />
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-success hover:bg-success/90 text-white gap-2" disabled={submitting} onClick={() => handleResolve(true)}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Aprobar (anula y restablece puntaje)
                    </Button>
                    <Button className="flex-1 bg-danger hover:bg-danger/90 text-white gap-2" disabled={submitting} onClick={() => handleResolve(false)}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Rechazar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <p className="text-sm">
                    Apelación <strong>{selected.appealStatus === "APPROVED" ? "APROBADA" : "RECHAZADA"}</strong>
                    {" "}el {formatDate(selected.appealResolvedAt)}.
                  </p>
                  {selected.appealResolutionNotes && (
                    <p className="text-xs text-muted mt-2">Nota: {selected.appealResolutionNotes}</p>
                  )}
                  {selected.appealStatus === "APPROVED" && (
                    <p className="text-xs text-success mt-2">✓ Infracción anulada y {selected.pointsDeducted ?? 0} pts restablecidos al trabajador.</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end">
              <Button variant="ghost" disabled={submitting} onClick={() => setSelected(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
