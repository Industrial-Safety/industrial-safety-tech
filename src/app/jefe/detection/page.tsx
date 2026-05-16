"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Eye, AlertTriangle, CheckCircle, User, ShieldAlert, Check, X } from "lucide-react";
import { getIncidents, reviewIncident, Incident } from "../../../services/incidentService";

export default function DetectionPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");

  // Carga incidentes del backend
  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000); // refresca cada 10s
    return () => clearInterval(interval);
  }, []);

  async function fetchIncidents() {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error("Error cargando incidentes:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(status: "APPROVED" | "REJECTED") {
    if (!selected) return;
    try {
      await reviewIncident(selected.id, status, reviewNotes || (status === "APPROVED" ? "Infracción confirmada" : "Falso positivo"));
      setSelected(null);
      setReviewNotes("");
      fetchIncidents();
    } catch (e) {
      console.error("Error al revisar:", e);
    }
  }

  const pending = incidents.filter(i => i.status === "PENDING").length;
  const approved = incidents.filter(i => i.status === "APPROVED").length;
  const rejected = incidents.filter(i => i.status === "REJECTED").length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-PE");
  }

  function mapStatus(status: string) {
    if (status === "PENDING") return { label: "Pendiente de Revisión", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
    if (status === "APPROVED") return { label: "Infracción Confirmada", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
    return { label: "Rechazado / Falso positivo", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Camera className="h-6 w-6 text-amber-500" />
            Detección de EPP por IA
          </h1>
          <p className="text-sm text-muted">Monitoreo en tiempo real, validación de incidentes y registro de infractores.</p>
        </div>
        <Button onClick={fetchIncidents} variant="outline" className="border-slate-700 text-slate-300">
          Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{incidents.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Por Revisar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">{pending}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <span className="text-2xl font-bold text-rose-500">{approved}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-500">{rejected}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card className="border-slate-800 bg-surface/30 flex flex-col">
        <CardHeader className="border-b border-slate-800 bg-slate-900/30">
          <CardTitle className="text-foreground">Log de Incidentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-500">Cargando incidentes...</div>
          ) : incidents.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-500">No hay incidentes registrados</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 sticky top-0 z-10">
                <tr className="text-left text-slate-400">
                  <th className="p-4 font-medium">Fecha y Hora</th>
                  <th className="p-4 font-medium">Cámara</th>
                  <th className="p-4 font-medium">Infracciones</th>
                  <th className="p-4 font-medium">Confianza</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {incidents.map((incident) => {
                  const st = mapStatus(incident.status);
                  return (
                    <tr key={incident.id} className="text-foreground hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-400">{formatDate(incident.detectedAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-300">{incident.cameraKey}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {incident.violationTypes.map((v, i) => (
                            <span key={i} className="text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                              {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {Math.round(incident.confidence * 100)}%
                      </td>
                      <td className="p-4">
                        <Badge className={st.color}>{st.label}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        {incident.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() => { setSelected(incident); setReviewNotes(""); }}
                            className="bg-amber-600 hover:bg-amber-700 text-white h-8"
                          >
                            Revisar
                          </Button>
                        )}
                        {incident.status === "APPROVED" && (
                          <span className="text-xs text-rose-500 px-2">Confirmado</span>
                        )}
                        {incident.status === "REJECTED" && (
                          <span className="text-xs text-slate-500 px-2">Rechazado</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal de revisión */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-lg border-amber-500/30 bg-slate-900 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Revisión de Infracción
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">

              <div className="flex gap-4 items-start p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400">Validación Requerida</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    La IA detectó una anomalía. Confirma si procede la infracción.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cámara</span>
                  <p className="text-sm text-slate-200">{selected.cameraKey}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confianza IA</span>
                  <p className="text-sm font-mono text-slate-300">{Math.round(selected.confidence * 100)}%</p>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Infracciones detectadas</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.violationTypes.map((v, i) => (
                      <span key={i} className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha y hora</span>
                  <p className="text-xs text-slate-400 font-mono">{formatDate(selected.detectedAt)}</p>
                </div>
              </div>

              {/* Imagen de evidencia desde S3 */}
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Evidencia fotográfica</span>
                <div className="w-full h-48 bg-slate-950 rounded border border-slate-800 overflow-hidden">
                  <img
                    src={selected.evidenceUrl}
                    alt="Evidencia de infracción"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              {/* Notas del revisor */}
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Notas (opcional)</span>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Ej: Trabajador notificado, falso positivo por reflejo..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-slate-300 placeholder-slate-600 resize-none h-20 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelected(null)} className="border-slate-700 text-slate-300">
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview("REJECTED")}
                  className="border-slate-700 text-slate-300 gap-2 hover:border-slate-500"
                >
                  <X className="h-4 w-4" />
                  Falso positivo
                </Button>
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                  onClick={() => handleReview("APPROVED")}
                >
                  <Check className="h-4 w-4" />
                  Confirmar infracción
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}