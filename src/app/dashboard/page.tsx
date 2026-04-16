"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, HardHat, FileCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

import type { BadgeProps } from "@/components/ui/badge";

const stats = [
  {
    title: "Certificados Activos",
    value: "1,284",
    icon: FileCheck,
    badge: { label: "+12%", variant: "success" as BadgeProps["variant"], iconType: "trending-up" },
    change: "vs mes anterior"
  },
  {
    title: "Infracciones EPP (hoy)",
    value: "3",
    icon: AlertTriangle,
    badge: { label: "Crítico", variant: "danger" as BadgeProps["variant"], iconType: "trending-up" },
    change: "vs ayer"
  },
  {
    title: "Stock EPP",
    value: "847 uds",
    icon: HardHat,
    badge: { label: "Normal", variant: "success" as BadgeProps["variant"], iconType: "minus" },
    change: "nivel óptimo"
  },
  {
    title: "Cámaras Activas",
    value: "24/24",
    icon: Shield,
    badge: { label: "100%", variant: "default" as BadgeProps["variant"], iconType: "trending-up" },
    change: "operativas"
  },
];

const getBadgeIcon = (iconType: string) => {
  switch (iconType) {
    case "trending-up":
      return <TrendingUp className="h-3 w-3" />;
    case "trending-down":
      return <TrendingDown className="h-3 w-3" />;
    case "minus":
      return <Minus className="h-3 w-3" />;
    default:
      return null;
  }
};

const trendData = [
  { name: 'Lun', incidentes: 12, certificados: 45 },
  { name: 'Mar', incidentes: 8, certificados: 52 },
  { name: 'Mié', incidentes: 15, certificados: 38 },
  { name: 'Jue', incidentes: 6, certificados: 61 },
  { name: 'Vie', incidentes: 9, certificados: 49 },
  { name: 'Sáb', incidentes: 4, certificados: 28 },
  { name: 'Dom', incidentes: 2, certificados: 15 },
];

const recentAlerts = [
  { time: "09:42", camera: "Cámara N-03", type: "Sin casco", severity: "danger" as const, location: "Zona Norte" },
  { time: "09:15", camera: "Cámara E-07", type: "Sin guantes", severity: "warning" as const, location: "Entrada Este" },
  { time: "08:58", camera: "Cámara S-01", type: "Sin lentes", severity: "warning" as const, location: "Sector Sur" },
  { time: "08:30", camera: "Cámara N-02", type: "Acceso autorizado", severity: "success" as const, location: "Zona Norte" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Seguridad</h1>
          <p className="text-muted">Monitoreo en tiempo real de la operación industrial</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
          Sistema operativo
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted">{stat.title}</CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <Badge variant={stat.badge.variant} className="flex items-center gap-1">
                  {getBadgeIcon(stat.badge.iconType)}
                  {stat.badge.label}
                </Badge>
              </div>
              <p className="text-xs text-muted">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and alerts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="col-span-2 border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendencia Semanal de Incidentes
            </CardTitle>
            <p className="text-sm text-muted">Comparación de incidentes vs certificados emitidos</p>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="incidentes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="certificados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="incidentes"
                    stroke="#e11d48"
                    fillOpacity={1}
                    fill="url(#incidentes)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="certificados"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#certificados)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card className="border-slate-800/50 bg-gradient-to-br from-surface to-surface-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas Recientes
            </CardTitle>
            <p className="text-sm text-muted">Últimas 4 horas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <Badge variant={alert.severity} className="shrink-0 mt-0.5">
                    {alert.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{alert.camera}</p>
                    <p className="text-xs text-muted">{alert.location}</p>
                  </div>
                  <span className="text-xs text-muted shrink-0">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
