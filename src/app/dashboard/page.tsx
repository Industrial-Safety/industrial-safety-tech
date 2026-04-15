import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, HardHat, FileCheck, TrendingUp } from "lucide-react";

import type { BadgeProps } from "@/components/ui/badge";

const stats = [
  {
    title: "Certificados Activos",
    value: "1,284",
    icon: FileCheck,
    badge: { label: "+12%", variant: "success" as BadgeProps["variant"] },
  },
  {
    title: "Infracciones EPP (hoy)",
    value: "3",
    icon: AlertTriangle,
    badge: { label: "Crítico", variant: "danger" as BadgeProps["variant"] },
  },
  {
    title: "Stock EPP",
    value: "847 uds",
    icon: HardHat,
    badge: { label: "Normal", variant: "success" as BadgeProps["variant"] },
  },
  {
    title: "Cámaras Activas",
    value: "24/24",
    icon: Shield,
    badge: { label: "100%", variant: "default" as BadgeProps["variant"] },
  },
];

const recentAlerts = [
  { time: "09:42", camera: "Cámara N-03", type: "Sin casco", severity: "danger" as const },
  { time: "09:15", camera: "Cámara E-07", type: "Sin guantes", severity: "warning" as const },
  { time: "08:58", camera: "Cámara S-01", type: "Sin lentes", severity: "warning" as const },
  { time: "08:30", camera: "Cámara N-02", type: "Acceso autorizado", severity: "success" as const },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted">Resumen general de la operación de seguridad industrial.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend + Alerts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Trend card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendencia de Incidentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-lg bg-surface-secondary text-sm text-muted">
              Gráfico de tendencias — próximo módulo
            </div>
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.severity}>{alert.type}</Badge>
                    <span className="text-muted">{alert.camera}</span>
                  </div>
                  <span className="text-muted">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
