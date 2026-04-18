"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, AlertTriangle, Info, Camera, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data from AI Vision System
const AI_DETECTIONS = [
  {
    id: "DET-2026-402",
    date: "17 Abr 2026",
    time: "08:14 AM",
    type: "Ausencia de Casco",
    severity: "high",
    location: "Zona de Carga B",
    camera: "CAM-04",
    status: "reviewed", // pending, reviewed, disputed
    image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&h=300&fit=crop"
  },
  {
    id: "DET-2026-319",
    date: "12 Abr 2026",
    time: "14:30 PM",
    type: "Ingreso a Zona Restringida",
    severity: "critical",
    location: "Cuarto de Máquinas 2",
    camera: "CAM-12",
    status: "pending",
    image: "https://images.unsplash.com/photo-1582214307525-ee9ebc82f939?w=400&h=300&fit=crop"
  },
  {
    id: "DET-2026-105",
    date: "05 Mar 2026",
    time: "10:05 AM",
    type: "Distancia Social / Aglomeración",
    severity: "low",
    location: "Pasillo Principal A",
    camera: "CAM-01",
    status: "disputed",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
  }
];

export default function AlertsPage() {
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><AlertTriangle className="mr-1 h-3 w-3" /> Crítica</Badge>;
      case 'high': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><AlertTriangle className="mr-1 h-3 w-3" /> Alta</Badge>;
      case 'low': return <Badge variant="outline" className="bg-info/10 text-info border-info/30"><Info className="mr-1 h-3 w-3" /> Leve</Badge>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-warning text-black hover:bg-warning/80">Pendiente de Revisión</Badge>;
      case 'reviewed': return <Badge className="bg-success text-white hover:bg-success/80">Validada por Supervisor</Badge>;
      case 'disputed': return <Badge variant="secondary" className="bg-surface-secondary text-foreground">En Disputa</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-danger" /> Mis Alertas y Detecciones IA
        </h1>
        <p className="text-muted">Historial de infracciones de seguridad detectadas automáticamente por el sistema de visión artificial.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* KPI Cards */}
        <Card className="bg-surface/50 border-danger/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Alertas Críticas</h3>
            <p className="text-4xl font-bold text-danger">1</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-warning/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Faltas de EPP</h3>
            <p className="text-4xl font-bold text-warning">1</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Puntaje Actual</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">92</p>
              <p className="text-sm font-medium text-danger">-8 pts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader>
          <CardTitle>Historial de Detecciones</CardTitle>
          <CardDescription>
            Si crees que una detección es un falso positivo, puedes iniciar una disputa para revisión manual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[100px]">ID / Evidencia</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Tipo de Infracción</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AI_DETECTIONS.map((det) => (
                    <TableRow key={det.id} className="border-border hover:bg-surface-secondary/30">
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-[10px] uppercase font-mono text-muted">{det.id}</span>
                          <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border group cursor-pointer">
                            <img src={det.image} alt="Evidencia" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{det.date}</span>
                          <span className="flex items-center gap-1 text-xs text-muted mt-0.5"><Clock className="h-3 w-3" /> {det.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{det.type}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{det.location}</span>
                          <span className="text-xs text-muted flex items-center gap-1 mt-0.5"><Camera className="h-3 w-3" /> {det.camera}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(det.severity)}</TableCell>
                      <TableCell>{getStatusBadge(det.status)}</TableCell>
                      <TableCell className="text-right">
                        {det.status !== 'disputed' && (
                          <Button variant="outline" size="sm" className="h-8 text-xs border-border/50 hover:bg-surface-secondary">
                            Apelar / Disputar
                          </Button>
                        )}
                        {det.status === 'disputed' && (
                          <Button disabled variant="outline" size="sm" className="h-8 text-xs border-border/10 opacity-50">
                            En Revisión
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}
