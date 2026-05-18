"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert, ShieldCheck, Activity, GraduationCap,
  Package, Clock, CheckCircle, XCircle, Loader2, TrendingUp,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface Incident {
  id: string;
  violationType: string;
  status: string;
  workerName?: string;
  createdAt?: string;
  timestamp?: string;
}

interface PurchaseRequest {
  id: number;
  categoria: string;
  cantidad: number;
  costoEstimado: number;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fecha?: string;
}

const VIOLATION_LABELS: Record<string, string> = {
  NO_CASCO: "Sin Casco",
  NO_CHALECO: "Sin Chaleco",
  NO_GUANTES: "Sin Guantes",
  NO_LENTES: "Sin Lentes",
  NO_BOTAS: "Sin Botas",
  ZONA_PROHIBIDA: "Zona Prohibida",
  DISTANCIA_INSEGURA: "Dist. Insegura",
};

const PIE_COLORS = ["#ef4444","#f59e0b","#8b5cf6","#3b82f6","#10b981","#ec4899","#06b6d4"];

function normalizeStatus(s: string) {
  return s?.toUpperCase() ?? "";
}

export default function GerenciaDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalIncidents, setTotalIncidents] = useState<number | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [coursesCount, setCoursesCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/proxy/incidents?size=200").then(r => r.ok ? r.json() : { content: [], totalElements: 0 }),
      fetch("/api/proxy/purchase/requests").then(r => r.ok ? r.json() : []),
      fetch("/api/proxy/course").then(r => r.ok ? r.json() : []),
    ]).then(([inc, pur, crs]) => {
      const list: Incident[] = inc?.content ?? (Array.isArray(inc) ? inc : []);
      setIncidents(list);
      setTotalIncidents(inc?.totalElements ?? list.length);
      setPurchases(Array.isArray(pur) ? pur : []);
      setCoursesCount(Array.isArray(crs) ? crs.length : 0);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const pending   = incidents.filter(i => normalizeStatus(i.status) === "PENDING").length;
  const approved  = incidents.filter(i => normalizeStatus(i.status) === "APPROVED").length;
  const appealed  = incidents.filter(i => normalizeStatus(i.status) === "APPEALED").length;

  const purPending  = purchases.filter(p => p.estado === "PENDIENTE").length;
  const purApproved = purchases.filter(p => p.estado === "APROBADO");
  const totalApprovedCost = purApproved.reduce((s, p) => s + (p.costoEstimado ?? 0), 0);

  // Incidents by violationType
  const byType = incidents.reduce<Record<string, number>>((acc, i) => {
    const key = i.violationType ?? "OTRO";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(byType)
    .map(([type, count]) => ({ name: VIOLATION_LABELS[type] ?? type, value: count }))
    .sort((a, b) => b.value - a.value);

  // Purchase by estado for bar chart
  const purBarData = [
    { name: "Pendientes", value: purchases.filter(p => p.estado === "PENDIENTE").length, fill: "#f59e0b" },
    { name: "Aprobadas",  value: purchases.filter(p => p.estado === "APROBADO").length,  fill: "#10b981" },
    { name: "Rechazadas", value: purchases.filter(p => p.estado === "RECHAZADO").length, fill: "#ef4444" },
  ];

  const recentIncidents = incidents.slice(0, 8);

  const statusBadge = (status: string) => {
    const s = normalizeStatus(status);
    if (s === "PENDING")  return <Badge className="bg-warning/10 text-warning border-warning/30">Pendiente</Badge>;
    if (s === "APPROVED") return <Badge className="bg-success/10 text-success border-success/30">Aprobado</Badge>;
    if (s === "REJECTED") return <Badge className="bg-danger/10 text-danger border-danger/30">Rechazado</Badge>;
    if (s === "APPEALED") return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Apelado</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : "—";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resumen Ejecutivo HSE</h1>
        <p className="text-muted">Vista gerencial de Salud, Seguridad y Medio Ambiente — datos en tiempo real.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Incidentes Totales",
            value: loading ? null : totalIncidents,
            icon: ShieldAlert,
            color: "text-danger",
            bg: "bg-danger/10",
            sub: `${pending} pendientes de revisión`,
          },
          {
            title: "Infracciones Confirmadas",
            value: loading ? null : approved,
            icon: ShieldCheck,
            color: "text-warning",
            bg: "bg-warning/10",
            sub: `${appealed} en proceso de apelación`,
          },
          {
            title: "Solicitudes de Compra",
            value: loading ? null : purchases.length,
            icon: Package,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            sub: `${purPending} pendientes · S/ ${totalApprovedCost.toFixed(0)} aprobado`,
          },
          {
            title: "Cursos en Plataforma",
            value: loading ? null : coursesCount,
            icon: GraduationCap,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            sub: "Disponibles para capacitación",
          },
        ].map(kpi => (
          <Card key={kpi.title} className="bg-surface border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {kpi.value === null
                ? <Loader2 className="h-7 w-7 animate-spin text-muted" />
                : <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
              }
              <p className="text-xs text-muted mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Incidents by type */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-danger" /> Tipos de Infracción Detectados
            </CardTitle>
            <CardDescription>Distribución de detecciones de IA por categoría de violación.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
            ) : typeData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted text-sm">Sin incidentes registrados</div>
            ) : (
              <div className="flex gap-4 items-center h-64">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie data={typeData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                      itemStyle={{ color: "var(--color-foreground)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {typeData.slice(0, 6).map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-muted text-xs">{d.name}</span>
                      </div>
                      <span className="font-bold text-xs">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase requests status */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-400" /> Solicitudes de Compra por Estado
            </CardTitle>
            <CardDescription>Resumen de solicitudes de logística enviadas a gerencia.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
            ) : purchases.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted text-sm">Sin solicitudes registradas</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={purBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", borderRadius: "8px" }}
                      itemStyle={{ color: "var(--color-foreground)" }}
                    />
                    <Bar dataKey="value" name="Solicitudes" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {purBarData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent incidents table */}
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-warning" /> Incidentes Recientes
          </CardTitle>
          <CardDescription>Últimas detecciones registradas por el sistema de IA.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-32 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
          ) : recentIncidents.length === 0 ? (
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
                    <th className="px-5 py-3 text-left font-semibold">Tipo</th>
                    <th className="px-5 py-3 text-left font-semibold">Trabajador</th>
                    <th className="px-5 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-5 py-3 text-right font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-medium">{VIOLATION_LABELS[inc.violationType] ?? inc.violationType ?? "—"}</span>
                      </td>
                      <td className="px-5 py-3 text-muted">{inc.workerName ?? "—"}</td>
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
