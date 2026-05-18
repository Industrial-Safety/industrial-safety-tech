"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface Incident {
  id: string;
  violationType: string;
  status: string;
  workerName?: string;
  workerDni?: string;
  createdAt?: string;
  timestamp?: string;
  imageUrl?: string;
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

const PIE_COLORS = ["#ef4444","#f59e0b","#8b5cf6","#3b82f6","#10b981","#ec4899","#06b6d4","#84cc16"];

function normalizeStatus(s: string) { return s?.toUpperCase() ?? ""; }

export default function AnalyticsPage() {
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

  const byType = incidents.reduce<Record<string, number>>((acc, i) => {
    const key = i.violationType ?? "OTRO";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(byType)
    .map(([type, count]) => ({ name: VIOLATION_LABELS[type] ?? type, value: count }))
    .sort((a, b) => b.value - a.value);

  const byStatus = incidents.reduce<Record<string, number>>((acc, i) => {
    const s = normalizeStatus(i.status);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const statusData = [
    { name: "Pendiente", value: byStatus["PENDING"] ?? 0, fill: "#f59e0b" },
    { name: "Aprobado", value: byStatus["APPROVED"] ?? 0, fill: "#ef4444" },
    { name: "Rechazado", value: byStatus["REJECTED"] ?? 0, fill: "#10b981" },
    { name: "Apelado", value: byStatus["APPEALED"] ?? 0, fill: "#8b5cf6" },
  ].filter(d => d.value > 0);

  const recent = incidents.slice(0, 10);
  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const statusBadge = (status: string) => {
    const s = normalizeStatus(status);
    if (s === "PENDING")  return <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">Pendiente</Badge>;
    if (s === "APPROVED") return <Badge className="bg-danger/10 text-danger border-danger/30 text-[10px]">Confirmado</Badge>;
    if (s === "REJECTED") return <Badge className="bg-success/10 text-success border-success/30 text-[10px]">Descartado</Badge>;
    if (s === "APPEALED") return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">Apelado</Badge>;
    return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Activity className="h-8 w-8 text-emerald-500" /> Análisis de Incidentes
          </h1>
          <p className="text-muted">Distribución y tendencias de detecciones del sistema de IA de seguridad.</p>
        </div>
        {!loading && total !== null && (
          <div className="flex items-center gap-3 bg-surface/50 border border-border px-4 py-2 rounded-lg">
            <ShieldAlert className="h-5 w-5 text-danger" />
            <div>
              <p className="text-xs text-muted">Total registrado</p>
              <p className="text-xl font-bold text-danger">{total}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Tipo de infracción */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Infracciones Detectadas</CardTitle>
            <CardDescription>Distribución de violaciones por categoría.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-72 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
            ) : typeData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-muted text-sm">Sin datos</div>
            ) : (
              <div className="flex gap-4 items-center h-72">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie data={typeData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                      {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {typeData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-xs text-muted">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{d.value}</span>
                        <span className="text-[10px] text-muted">({total ? Math.round(d.value / total * 100) : 0}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de incidentes */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg">Incidentes por Estado de Revisión</CardTitle>
            <CardDescription>Cuántos han sido confirmados, descartados o siguen pendientes.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-72 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
            ) : statusData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-muted text-sm">Sin datos</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                    />
                    <Bar dataKey="value" name="Incidentes" radius={[4, 4, 0, 0]} maxBarSize={70}>
                      {statusData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista reciente */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-lg">Registro de Incidentes Recientes</CardTitle>
          <CardDescription>Últimas detecciones del sistema — para revisión detallada ir al módulo del Jefe de Seguridad.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
          ) : recent.length === 0 ? (
            <div className="h-32 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-success mx-auto mb-2" />
                <p className="text-muted text-sm">Sin incidentes registrados</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted uppercase bg-surface-secondary/30 border-b border-border">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Tipo de Violación</th>
                    <th className="px-5 py-3 text-left font-semibold">Trabajador</th>
                    <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-5 py-3 text-right font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recent.map(inc => (
                    <tr key={inc.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="px-5 py-3 font-medium">
                        {VIOLATION_LABELS[inc.violationType] ?? inc.violationType ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-muted">{inc.workerName ?? inc.workerDni ?? "—"}</td>
                      <td className="px-5 py-3 text-muted">{fmt(inc.createdAt ?? inc.timestamp)}</td>
                      <td className="px-5 py-3 text-right">{statusBadge(inc.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
