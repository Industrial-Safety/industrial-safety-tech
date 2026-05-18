"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock, Loader2, ShieldAlert } from "lucide-react";

interface Incident {
  id: string;
  violationType: string;
  status: string;
  workerName?: string;
  workerDni?: string;
  createdAt?: string;
  timestamp?: string;
  appealStatus?: string;
}

const VIOLATION_LABELS: Record<string, string> = {
  NO_CASCO: "Sin Casco",
  NO_CHALECO: "Sin Chaleco/Vest",
  NO_GUANTES: "Sin Guantes",
  NO_LENTES: "Sin Lentes",
  NO_BOTAS: "Sin Botas",
  ZONA_PROHIBIDA: "Zona Prohibida",
  DISTANCIA_INSEGURA: "Distancia Insegura",
};

function normalizeStatus(s: string) { return s?.toUpperCase() ?? ""; }

export default function CompliancePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/incidents?size=200")
      .then(r => r.ok ? r.json() : { content: [], totalElements: 0 })
      .then(data => {
        const list: Incident[] = data?.content ?? (Array.isArray(data) ? data : []);
        setIncidents(list);
        setTotal(data?.totalElements ?? list.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const confirmed = incidents.filter(i => normalizeStatus(i.status) === "APPROVED");
  const pending   = incidents.filter(i => normalizeStatus(i.status) === "PENDING");
  const discarded = incidents.filter(i => normalizeStatus(i.status) === "REJECTED");
  const appealed  = incidents.filter(i => normalizeStatus(i.status) === "APPEALED");

  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-emerald-500" /> Auditoría de Seguridad
          </h1>
          <p className="text-muted">Estado de las infracciones registradas por el sistema de IA y el jefe de seguridad.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Infracciones Confirmadas",
            value: loading ? null : confirmed.length,
            icon: AlertTriangle,
            color: "text-danger",
            bg: "bg-danger/10",
            border: "border-danger/20",
          },
          {
            label: "Pendientes de Revisión",
            value: loading ? null : pending.length,
            icon: Clock,
            color: "text-warning",
            bg: "bg-warning/10",
            border: "border-warning/20",
          },
          {
            label: "Descartadas",
            value: loading ? null : discarded.length,
            icon: XCircle,
            color: "text-success",
            bg: "bg-success/10",
            border: "border-success/20",
          },
          {
            label: "En Apelación",
            value: loading ? null : appealed.length,
            icon: ShieldAlert,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`${bg} ${border} border`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm font-medium ${color} mb-1`}>{label}</p>
                  {value === null
                    ? <Loader2 className="h-6 w-6 animate-spin text-muted mt-2" />
                    : <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
                  }
                </div>
                <div className={`p-3 ${bg} rounded-full`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmed infractions table */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-lg">Infracciones Confirmadas</CardTitle>
          <CardDescription>
            Incidentes que el Jefe de Seguridad revisó y aprobó como infracciones reales.
            {!loading && ` Mostrando ${confirmed.length} de ${total ?? "?"} incidentes totales.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
          ) : confirmed.length === 0 ? (
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-success mx-auto mb-2" />
                <p className="text-muted text-sm">No hay infracciones confirmadas</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted uppercase bg-surface-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Tipo de Infracción</th>
                    <th className="px-5 py-3 text-left font-semibold">Trabajador</th>
                    <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-5 py-3 text-right font-semibold">Apelación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {confirmed.map(inc => (
                    <tr key={inc.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-danger shrink-0" />
                          <span className="font-medium">{VIOLATION_LABELS[inc.violationType] ?? inc.violationType ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted">{inc.workerName ?? inc.workerDni ?? "—"}</td>
                      <td className="px-5 py-3 text-muted">{fmt(inc.createdAt ?? inc.timestamp)}</td>
                      <td className="px-5 py-3 text-right">
                        {inc.appealStatus
                          ? <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">
                              {inc.appealStatus === "PENDING" ? "En revisión" : inc.appealStatus === "APPROVED" ? "Anulada" : "Rechazada"}
                            </Badge>
                          : <Badge className="bg-surface-secondary text-muted border-border text-[10px]">Sin apelación</Badge>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending table */}
      {pending.length > 0 && (
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" /> Pendientes de Revisión
            </CardTitle>
            <CardDescription>Incidentes detectados que aún no han sido revisados por el Jefe de Seguridad.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted uppercase bg-surface-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Tipo</th>
                    <th className="px-5 py-3 text-left font-semibold">Trabajador</th>
                    <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {pending.map(inc => (
                    <tr key={inc.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{VIOLATION_LABELS[inc.violationType] ?? inc.violationType ?? "—"}</td>
                      <td className="px-5 py-3 text-muted">{inc.workerName ?? inc.workerDni ?? "—"}</td>
                      <td className="px-5 py-3 text-muted">{fmt(inc.createdAt ?? inc.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
