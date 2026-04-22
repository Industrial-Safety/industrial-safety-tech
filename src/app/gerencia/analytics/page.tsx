"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  AlertTriangle, 
  Camera, 
  Activity,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data
const RISK_ZONES = [
  { area: "Almacén Central", x: 20, y: 80, incidents: 45, type: "EPP Faltante" },
  { area: "Línea de Ensamblaje", x: 50, y: 30, incidents: 85, type: "Distancia Insegura" },
  { area: "Zona de Carga", x: 80, y: 70, incidents: 60, type: "Zona Restringida" },
  { area: "Mantenimiento B", x: 30, y: 40, incidents: 25, type: "EPP Faltante" },
  { area: "Pasillos Principales", x: 60, y: 60, incidents: 15, type: "Correr en Planta" },
];

const INCIDENT_TYPES = [
  { name: 'Falta de Casco/Lentes', value: 45, color: '#f59e0b' },
  { name: 'Ingreso a Zona Prohibida', value: 25, color: '#ef4444' },
  { name: 'Distancia a Maquinaria', value: 20, color: '#8b5cf6' },
  { name: 'Postura Inadecuada', value: 10, color: '#10b981' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Map className="h-8 w-8 text-emerald-500" /> Mapa de Riesgos
          </h1>
          <p className="text-muted">Análisis espacial y predictivo de incidencias detectadas por el sistema de IA.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Heatmap/Scatter Simulation */}
        <Card className="bg-surface border-border shadow-sm col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning" /> Zonas de Calor (Planta Principal)
            </CardTitle>
            <CardDescription>Concentración de incidentes reportados por las cámaras de seguridad.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-surface-secondary/20 rounded-xl border border-border/50 relative overflow-hidden">
               {/* Background grid simulation to look like a map */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis type="number" dataKey="x" name="Eje X" hide domain={[0, 100]} />
                  <YAxis type="number" dataKey="y" name="Eje Y" hide domain={[0, 100]} />
                  <ZAxis type="number" dataKey="incidents" range={[100, 1000]} name="Incidentes" />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    formatter={(value: any, name: any, props: any) => [props.payload.area, `Incidentes: ${props.payload.incidents}`]}
                  />
                  <Scatter name="Riesgos" data={RISK_ZONES} fill="#ef4444" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident Breakdown */}
        <Card className="bg-surface border-border shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Tipos de Infracciones</CardTitle>
            <CardDescription>Distribución de detecciones automáticas de IA.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={INCIDENT_TYPES}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {INCIDENT_TYPES.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                     formatter={(value: any) => [`${value}%`, 'Frecuencia']}
                   />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="w-full space-y-2 mt-4">
                {INCIDENT_TYPES.map(type => (
                   <div key={type.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                         <span className="text-muted-foreground">{type.name}</span>
                      </div>
                      <span className="font-semibold">{type.value}%</span>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Cameras Status */}
        <Card className="bg-surface border-border shadow-sm col-span-1 lg:col-span-3">
          <CardHeader>
             <div className="flex justify-between items-center">
               <div>
                  <CardTitle className="text-lg">Top Cámaras Críticas</CardTitle>
                  <CardDescription>Sensores con mayor actividad anómala detectada en las últimas 72 horas.</CardDescription>
               </div>
               <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10">100% Operativas</Badge>
             </div>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                   { name: "Cam-04 (Línea de Ensamblaje)", alerts: 42, trend: "+12%" },
                   { name: "Cam-12 (Zona de Carga)", alerts: 28, trend: "+5%" },
                   { name: "Cam-02 (Almacén Central)", alerts: 19, trend: "-2%" },
                ].map((cam, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface-secondary/30 border border-border/50">
                      <div className="p-2.5 bg-black/20 rounded-lg text-primary">
                         <Camera className="h-6 w-6" />
                      </div>
                      <div>
                         <h4 className="font-semibold text-sm">{cam.name}</h4>
                         <div className="flex items-center gap-3 mt-2">
                            <p className="text-xl font-bold text-danger">{cam.alerts} <span className="text-xs font-normal text-muted">alertas</span></p>
                            <Badge variant="outline" className={cam.trend.startsWith('+') ? 'text-danger border-danger/20' : 'text-success border-success/20'}>
                               {cam.trend}
                            </Badge>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
