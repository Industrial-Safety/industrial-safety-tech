"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, AlertTriangle, Camera, Clock, CheckCircle, XCircle, Loader2, TrendingDown, Gavel, FileText } from "lucide-react";
import { toast } from "sonner";
import { getMyIncidents, getMyScore, submitAppeal, Incident, MyScore } from "@/services/incidentService";

export default function AlertsPage() {
  const { data: session } = useSession();
  const workerId = (session as any)?.keycloakId as string | undefined;

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [score, setScore] = useState<MyScore | null>(null);
  const [loading, setLoading] = useState(true);

  const [appealTarget, setAppealTarget] = useState<Incident | null>(null);
  const [appealReason, setAppealReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!workerId) return;
    Promise.all([getMyIncidents(workerId), getMyScore(workerId)])
      .then(([inc, sc]) => {
        setIncidents(inc);
        setScore(sc);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [workerId]);

  const confirmed = incidents.filter((i) => i.status === "APPROVED");
  const pending = incidents.filter((i) => i.status === "PENDING");
  const totalDeducted = confirmed.reduce((sum, i) => sum + (i.pointsDeducted ?? 0), 0);

  const statusBadge = (inc: Incident) => {
    if (inc.status === "APPEALED") {
      return (
        <Badge className="bg-success text-white gap-1">
          <Gavel className="h-3 w-3" /> Infracción Anulada
        </Badge>
      );
    }
    if (inc.status === "APPROVED") {
      return (
        <Badge className="bg-danger text-white gap-1">
          <CheckCircle className="h-3 w-3" /> Infracción Confirmada
        </Badge>
      );
    }
    if (inc.status === "REJECTED") {
      return (
        <Badge className="bg-success text-white gap-1">
          <XCircle className="h-3 w-3" /> Falso Positivo
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning text-black gap-1">
        <Clock className="h-3 w-3" /> Pendiente de Revisión
      </Badge>
    );
  };

  const appealCell = (inc: Incident) => {
    if (inc.appealStatus === "PENDING") {
      return <span className="text-xs text-warning flex items-center gap-1"><Clock className="h-3 w-3" /> En revisión</span>;
    }
    if (inc.appealStatus === "APPROVED") {
      return <span className="text-xs text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Aprobada</span>;
    }
    // Solo se puede apelar una infracción confirmada; si fue rechazada se puede reintentar.
    if (inc.status === "APPROVED" && (inc.appealStatus === null || inc.appealStatus === "REJECTED")) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => { setAppealTarget(inc); setAppealReason(""); }}
        >
          <Gavel className="h-3 w-3 mr-1" />
          {inc.appealStatus === "REJECTED" ? "Apelar de nuevo" : "Apelar"}
        </Button>
      );
    }
    return <span className="text-muted text-xs">—</span>;
  };

  const handleSubmitAppeal = async () => {
    if (!appealTarget || !workerId) return;
    if (!appealReason.trim()) {
      toast.error("Escribe el motivo de la apelación.");
      return;
    }
    setSubmitting(true);
    try {
      await submitAppeal(appealTarget.id, workerId, appealReason.trim());
      toast.success("Apelación enviada. El Jefe de Seguridad la revisará.");
      setAppealTarget(null);
      setAppealReason("");
      load();
    } catch (e: any) {
      toast.error(e?.message ? `Error: ${e.message}` : "No se pudo enviar la apelación");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-danger" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-danger" /> Mis Alertas y Detecciones IA
        </h1>
        <p className="text-muted">
          Historial de infracciones detectadas por la IA y revisadas por el Jefe de Seguridad. Si crees que una infracción es injusta, puedes apelarla.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-surface/50 border-danger/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Infracciones Confirmadas</h3>
            <p className="text-4xl font-bold text-danger">{confirmed.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-warning/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Pendientes de Revisión</h3>
            <p className="text-4xl font-bold text-warning">{pending.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Puntaje de Cumplimiento</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">{score?.score ?? "—"}</p>
              {totalDeducted > 0 && (
                <p className="text-sm font-medium text-danger flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> -{totalDeducted} pts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Total Detecciones</h3>
            <p className="text-4xl font-bold text-foreground">{incidents.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader>
          <CardTitle>Historial de Detecciones</CardTitle>
          <CardDescription>
            Las infracciones confirmadas descuentan puntos. Si apelas y el Jefe aprueba tu apelación, se anula la infracción y se restablece tu puntaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[90px]">Evidencia</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Infracciones</TableHead>
                    <TableHead>Cámara</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                    <TableHead className="text-right">Apelación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted">
                        No tienes detecciones registradas. ¡Buen trabajo manteniendo la seguridad!
                      </TableCell>
                    </TableRow>
                  ) : (
                    incidents.map((det) => (
                      <TableRow key={det.id} className="border-border hover:bg-surface-secondary/30">
                        <TableCell>
                          <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border">
                            <img
                              src={det.evidenceUrl}
                              alt="Evidencia"
                              className="h-full w-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <Clock className="h-3 w-3" /> {formatDate(det.detectedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {det.violationTypes.map((v, i) => (
                              <span key={i} className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded border border-danger/20">
                                {v}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm flex items-center gap-1">
                            <Camera className="h-3 w-3 text-muted" /> {det.cameraKey}
                          </span>
                        </TableCell>
                        <TableCell>{statusBadge(det)}</TableCell>
                        <TableCell className="text-right">
                          {det.status === "APPROVED" && det.pointsDeducted ? (
                            <span className="font-bold text-danger">-{det.pointsDeducted}</span>
                          ) : det.status === "APPEALED" && det.pointsDeducted ? (
                            <span className="font-bold text-success">+{det.pointsDeducted}</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{appealCell(det)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de apelación */}
      {appealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Apelar Infracción</h3>
                  <p className="text-xs text-muted">{appealTarget.violationTypes.join(", ")} · {appealTarget.cameraKey}</p>
                </div>
              </div>
              <button
                onClick={() => setAppealTarget(null)}
                disabled={submitting}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-secondary/30 rounded-lg border border-border text-sm">
                <div>
                  <p className="text-xs text-muted mb-0.5">Fecha</p>
                  <p className="font-medium">{formatDate(appealTarget.detectedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Puntos descontados</p>
                  <p className="font-medium text-danger">-{appealTarget.pointsDeducted ?? 0}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Motivo de la apelación *
                </label>
                <textarea
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Explica por qué consideras que esta infracción es injusta o incorrecta (ej. falso positivo, autorización previa, equipo defectuoso...)"
                  className="w-full bg-surface border border-border rounded-md p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted">
                  Tu apelación la revisará el mismo Jefe de Seguridad que confirmó la infracción. Si la aprueba, se anulará la infracción y se restablecerá tu puntaje.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-3">
              <Button variant="ghost" disabled={submitting} onClick={() => setAppealTarget(null)}>
                Cancelar
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 gap-2"
                disabled={submitting || !appealReason.trim()}
                onClick={handleSubmitAppeal}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gavel className="h-4 w-4" />}
                Enviar Apelación
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
