"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Eye, AlertTriangle, CheckCircle, User, ShieldAlert, Check } from "lucide-react";

type DetectionStatus = "violation_pending" | "violation_confirmed" | "compliant";

type Detection = {
  id: number;
  camera: string;
  time: string;
  detection: string;
  status: DetectionStatus;
  confidence: number;
  employee: string | null;
  area: string;
};

const initialDetections: Detection[] = [
  { id: 1, camera: "Cámara N-03", time: "09:42:15", detection: "Sin casco", status: "violation_pending", confidence: 97, employee: "Alex Rivera", area: "Zona de Carga" },
  { id: 2, camera: "Cámara E-07", time: "09:15:33", detection: "Sin guantes", status: "violation_pending", confidence: 89, employee: "Miguel Torres", area: "Línea de Ensamblaje" },
  { id: 3, camera: "Cámara S-01", time: "08:58:02", detection: "Sin lentes", status: "violation_confirmed", confidence: 94, employee: "Carlos Mendoza", area: "Taller Principal" },
  { id: 4, camera: "Cámara N-02", time: "08:30:44", detection: "EPP completo", status: "compliant", confidence: 99, employee: "Ana Silva", area: "Zona de Carga" },
  { id: 5, camera: "Cámara W-05", time: "08:12:18", detection: "EPP completo", status: "compliant", confidence: 98, employee: "Roberto Flores", area: "Almacén" },
];

export default function DetectionPage() {
  const [detections, setDetections] = useState<Detection[]>(initialDetections);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  const pendingViolations = detections.filter((d) => d.status === "violation_pending").length;
  const confirmedViolations = detections.filter((d) => d.status === "violation_confirmed").length;
  const compliant = detections.filter((d) => d.status === "compliant").length;

  const handleApprove = (id: number) => {
    setDetections(detections.map(d => 
      d.id === id ? { ...d, status: "violation_confirmed" } : d
    ));
    setSelectedDetection(null);
  };

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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Detecciones Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{detections.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Por Revisar (Pendientes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-500">{pendingViolations}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Infracciones Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <span className="text-2xl font-bold text-rose-500">{confirmedViolations}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cumplimiento Exitoso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-500">{compliant}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera feeds y tabla */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cam feeds - Columna Izquierda */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-surface/30 overflow-hidden">
            <CardHeader className="bg-slate-900/50 py-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cámara N-03 (Zona de Carga)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-600 border-b border-slate-800">
                <Camera className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-xs">Stream de IA Activo</span>
                
                {/* Mock bounding box overlay */}
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[60%] border-2 border-emerald-500/50 rounded-lg"></div>
                <div className="absolute top-[20%] left-[30%] -mt-6 bg-emerald-500/80 text-[10px] text-white px-1.5 py-0.5 rounded shadow">
                  EPP Ok 99%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-800 bg-surface/30 overflow-hidden">
            <CardHeader className="bg-slate-900/50 py-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cámara E-07 (Línea de Ensamblaje)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center text-slate-600 border-b border-slate-800">
                <Camera className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-xs">Stream de IA Activo</span>

                {/* Mock bounding box overlay for violation */}
                <div className="absolute top-[10%] left-[40%] w-[30%] h-[30%] border-2 border-rose-500/80 rounded-full border-dashed animate-pulse"></div>
                <div className="absolute top-[10%] left-[40%] -mt-6 bg-rose-500 text-[10px] text-white px-1.5 py-0.5 rounded shadow font-bold">
                  Sin Casco 97%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Registros - Columna Derecha (Ocupa 2 espacios) */}
        <Card className="lg:col-span-2 border-slate-800 bg-surface/30 flex flex-col">
          <CardHeader className="border-b border-slate-800 bg-slate-900/30">
            <CardTitle className="text-foreground">Log de Incidentes y Detecciones</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 sticky top-0 z-10">
                <tr className="text-left text-slate-400">
                  <th className="p-4 font-medium">Hora</th>
                  <th className="p-4 font-medium">Ubicación</th>
                  <th className="p-4 font-medium">Persona Detectada</th>
                  <th className="p-4 font-medium">Infracción / Estado</th>
                  <th className="p-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {detections.map((d) => (
                  <tr key={d.id} className="text-foreground hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{d.time}</td>
                    <td className="p-4">
                      <p className="font-medium text-slate-300">{d.camera}</p>
                      <p className="text-[10px] text-slate-500">{d.area}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-200">{d.employee}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">{d.detection} <span className="text-xs text-slate-500 font-mono">({d.confidence}%)</span></span>
                        {d.status === "violation_pending" && (
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pendiente de Revisión</Badge>
                        )}
                        {d.status === "violation_confirmed" && (
                          <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Infracción Confirmada</Badge>
                        )}
                        {d.status === "compliant" && (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Cumple Normativa</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {d.status === "violation_pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedDetection(d)}
                          className="bg-amber-600 hover:bg-amber-700 text-white h-8"
                        >
                          Revisar
                        </Button>
                      )}
                      {d.status === "violation_confirmed" && (
                        <Button size="sm" variant="outline" disabled className="border-rose-500/30 text-rose-500 h-8 bg-transparent opacity-50">
                          Sancionado
                        </Button>
                      )}
                      {d.status === "compliant" && (
                        <span className="text-xs text-slate-500 px-2">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Aprobación */}
      {selectedDetection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md border-amber-500/30 bg-slate-900 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Revisión de Infracción de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              
              <div className="flex gap-4 items-start p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-amber-400">Validación Requerida</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    La IA detectó una anomalía. Como Jefe de Seguridad, debes confirmar si procede la infracción para el expediente del trabajador.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trabajador Detectado</span>
                  <p className="text-sm font-medium text-slate-200">{selectedDetection.employee}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Motivo / Incidente</span>
                  <p className="text-sm font-medium text-rose-400">{selectedDetection.detection}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ubicación y Hora</span>
                  <p className="text-sm text-slate-300">{selectedDetection.area}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedDetection.time}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Precisión de IA</span>
                  <p className="text-sm font-mono text-slate-300">{selectedDetection.confidence}%</p>
                </div>
              </div>

              {/* Mock Snapshot Placeholder */}
              <div className="w-full h-32 bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-slate-600 relative overflow-hidden">
                <Camera className="h-6 w-6 absolute opacity-20" />
                <span className="text-[10px] relative z-10 font-mono">Captura de cámara anexada</span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedDetection(null)} className="border-slate-700 text-slate-300">
                  Cancelar
                </Button>
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                  onClick={() => handleApprove(selectedDetection.id)}
                >
                  <Check className="h-4 w-4" />
                  Aprobar Infracción
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
