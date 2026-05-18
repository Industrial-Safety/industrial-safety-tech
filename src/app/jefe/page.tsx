"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Camera, FileCheck, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Incident } from "@/services/incidentService";
import type { BadgeProps } from "@/components/ui/badge";

const trendData = [
  { name: "Lun", incidentes: 0, revisados: 0 },
  { name: "Mar", incidentes: 0, revisados: 0 },
  { name: "Mié", incidentes: 0, revisados: 0 },
  { name: "Jue", incidentes: 0, revisados: 0 },
  { name: "Vie", incidentes: 0, revisados: 0 },
  { name: "Sáb", incidentes: 0, revisados: 0 },
  { name: "Dom", incidentes: 0, revisados: 0 },
];

function buildTrendData(incidents: Incident[]) {
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const counts: Record<string, { incidentes: number; revisados: number }> = {};
  dayNames.forEach((d) => { counts[d] = { incidentes: 0, revisados: 0 }; });
  incidents.forEach((inc) => {
    const d = dayNames[new Date(inc.detectedAt).getDay()];
    counts[d].incidentes++;
    if (inc.status !== "PENDING") counts[d].revisados++;
  });
  return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => ({ name: d, ...counts[d] }));
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/incidents?size=100&sort=detectedAt,desc")
      .then((r) => (r.ok ? r.json() : { content: [] }))
      .then((data) => setIncidents(data.content ?? []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = incidents.filter((i) => i.status === "PENDING").length;
  const approved = incidents.filter((i) => i.status === "APPROVED").length;
  const recentAlerts = incidents.slice(0, 4);
  const trend = buildTrendData(incidents);

  const stats = [
    {
      title: "Total Incidentes",
      value: loading ? "—" : incidents.length.toString(),
      icon: FileCheck,
      badge: { label: "registrados", variant: "default" as BadgeProps["variant"], icon: <Minus className="h-3 w-3" /> },
      change: "todos los tiempos",
    },
    {
      title: "Infracciones (hoy)",
      value: loading ? "—" : pending.toString(),
      icon: AlertTriangle,
      badge: { label: pending > 0 ? "Revisar" : "Al día", variant: (pending > 0 ? "danger" : "success") as BadgeProps["variant"], icon: pending > 0 ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" /> },
      change: "pendientes de revisión",
    },
    {
      title: "Confirmadas",
      value: loading ? "—" : approved.toString(),
      icon: Shield,
      badge: { label: "infracciones", variant: "danger" as BadgeProps["variant"], icon: <TrendingDown className="h-3 w-3" /> },
      change: "infracciones reales",
    },
    {
      title: "Cámaras Activas",
      value: "1/1",
      icon: Camera,
      badge: { label: "100%", variant: "success" as BadgeProps["variant"], icon: <TrendingUp className="h-3 w-3" /> },
      change: "operativas",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Seguridad</h1>
          <p className="text-muted">Monitoreo en tiempo real de la operación industrial</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Sistema operativo
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary hover:border-primary/30 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted">{stat.title}</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between mb-2">
                {loading && stat.value === "—" ? (
                  <Loader2 className="h-7 w-7 animate-spin text-muted" />
                ) : (
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                )}
                <Badge variant={stat.badge.variant} className="flex items-center gap-1">
                  {stat.badge.icon}
                  {stat.badge.label}
                </Badge>
              </div>
              <p className="text-xs text-muted">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendencia Semanal de Incidentes
            </CardTitle>
            <p className="text-sm text-muted">Incidentes detectados vs revisados esta semana</p>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loading ? trendData : trend}>
                  <defs>
                    <linearGradient id="incidentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revisados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #374151", borderRadius: "8px", color: "#f8fafc" }} />
                  <Area type="monotone" dataKey="incidentes" stroke="#e11d48" fillOpacity={1} fill="url(#incidentes)" strokeWidth={2} />
                  <Area type="monotone" dataKey="revisados" stroke="#10b981" fillOpacity={1} fill="url(#revisados)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Últimos Incidentes
            </CardTitle>
            <p className="text-sm text-muted">Más recientes</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-40 text-muted">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando...
              </div>
            ) : recentAlerts.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted text-sm">Sin incidentes recientes</div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((inc) => (
                  <div key={inc.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/50 border border-slate-700/50">
                    <Badge
                      variant={inc.status === "PENDING" ? "warning" : inc.status === "APPROVED" ? "danger" : "default"}
                      className="shrink-0 mt-0.5"
                    >
                      {inc.status === "PENDING" ? "Pendiente" : inc.status === "APPROVED" ? "Confirmado" : "Rechazado"}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inc.cameraKey}</p>
                      <p className="text-xs text-muted">{inc.violationTypes.join(", ")}</p>
                    </div>
                    <span className="text-xs text-muted shrink-0">
                      {new Date(inc.detectedAt).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
