"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertOctagon, 
  Users, 
  Award,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Mock Data
const ACCIDENT_DATA = [
  { month: 'Ene', nearMisses: 12, accidentes: 1 },
  { month: 'Feb', nearMisses: 15, accidentes: 0 },
  { month: 'Mar', nearMisses: 8, accidentes: 0 },
  { month: 'Abr', nearMisses: 22, accidentes: 2 },
  { month: 'May', nearMisses: 10, accidentes: 0 },
  { month: 'Jun', nearMisses: 5, accidentes: 0 },
];

const COMPLIANCE_DATA = [
  { name: 'Planta A', value: 92, color: '#10b981' },
  { name: 'Almacén Central', value: 78, color: '#f59e0b' },
  { name: 'Logística', value: 95, color: '#10b981' },
  { name: 'Mantenimiento', value: 85, color: '#10b981' },
  { name: 'Operaciones B', value: 64, color: '#ef4444' },
];

export default function GerenciaDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            Resumen Ejecutivo HSE
          </h1>
          <p className="text-muted">Vista gerencial de Salud, Seguridad y Medio Ambiente (Health, Safety & Environment).</p>
        </div>
        <div className="flex items-center gap-4 bg-surface/50 border border-border/50 px-4 py-2 rounded-lg backdrop-blur-sm">
           <div className="text-right">
              <p className="text-xs text-muted uppercase font-semibold">Días sin Accidentes</p>
              <p className="text-2xl font-bold text-emerald-500">142</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
           </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Índice Accidentabilidad</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">-0.4%</span> respecto al trimestre anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Cumplimiento Global</CardTitle>
            <Award className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.1%</span> de mejora en certificaciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Alertas Críticas (IA)</CardTitle>
            <AlertOctagon className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">14</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-danger" />
              <span className="text-danger font-medium">+5</span> incidentes de EPP faltante esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Personal Capacitado</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">412 / 450</div>
            <div className="mt-2 h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: '91%' }}></div>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Accident Rate Chart */}
        <Card className="bg-surface border-border shadow-sm col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Tendencia de Riesgos y Accidentes</CardTitle>
            <CardDescription>Comparativa de cuasi-accidentes (Near Misses) vs. Accidentes con tiempo perdido.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACCIDENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNearMiss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccidente" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="nearMisses" name="Cuasi Accidentes" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorNearMiss)" />
                  <Area type="monotone" dataKey="accidentes" name="Accidentes" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAccidente)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance by Area */}
        <Card className="bg-surface border-border shadow-sm col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Nivel de Cumplimiento por Área</CardTitle>
            <CardDescription>Porcentaje de empleados con certificaciones vigentes y EPP aprobado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMPLIANCE_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" name="Cumplimiento %" radius={[0, 4, 4, 0]} barSize={20}>
                    {COMPLIANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Insights */}
      <Card className="bg-surface border-border shadow-sm">
         <CardHeader>
            <CardTitle className="text-lg">Puntos de Atención Prioritaria</CardTitle>
            <CardDescription>Recomendaciones automáticas basadas en el análisis de datos recientes.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               <div className="flex items-start gap-4 p-4 rounded-lg bg-danger/5 border border-danger/20">
                  <div className="mt-0.5 p-2 bg-danger/10 rounded-full">
                     <AlertOctagon className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                     <h4 className="font-semibold text-danger">Bajo Cumplimiento en "Operaciones B"</h4>
                     <p className="text-sm text-muted mt-1">El nivel de certificaciones vigentes cayó al 64%. Se requiere programar cursos de "Trabajo en Altura" y "Manejo de Montacargas" de inmediato.</p>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="mt-0.5 p-2 bg-warning/10 rounded-full">
                     <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                     <h4 className="font-semibold text-warning">Aumento de Cuasi Accidentes en "Almacén Central"</h4>
                     <p className="text-sm text-muted mt-1">Se reportaron 22 near-misses en Abril. Analizar condiciones de iluminación y estado de estanterías.</p>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>

    </div>
  );
}
