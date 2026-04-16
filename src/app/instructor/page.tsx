"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Video,
  TrendingUp,
  Target,
  ArrowUpRight,
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

// Mock Data
const INSTRUCTOR_KPI = {
  totalCourses: 12,
  totalStudents: 1540,
  averageCompletion: 82,
  monthlyRevenue: 4500, // Optional simulation if platform paid
};

const CHART_DATA = [
  { name: 'Lun', sales: 400, students: 24 },
  { name: 'Mar', sales: 300, students: 18 },
  { name: 'Mié', sales: 550, students: 32 },
  { name: 'Jue', sales: 450, students: 28 },
  { name: 'Vie', sales: 600, students: 45 },
  { name: 'Sáb', sales: 800, students: 60 },
  { name: 'Dom', sales: 750, students: 55 },
];

export default function InstructorDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bienvenido, Roberto</h1>
        <p className="text-muted">Aquí tienes un resumen del impacto de tus capacitaciones.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Cursos Publicados</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{INSTRUCTOR_KPI.totalCourses}</div>
            <p className="text-xs text-muted mt-1 flex items-center">
               <span className="text-success flex items-center mr-1">
                 <ArrowUpRight className="h-3 w-3" /> +2
               </span>
               este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Alumnos</CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{INSTRUCTOR_KPI.totalStudents}</div>
            <p className="text-xs text-muted mt-1 flex items-center">
               <span className="text-success flex items-center mr-1">
                 <ArrowUpRight className="h-3 w-3" /> +15%
               </span>
               vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Tasa de Finalización</CardTitle>
            <Target className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{INSTRUCTOR_KPI.averageCompletion}%</div>
            <p className="text-xs text-muted mt-1">
               Promedio global aceptable
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted">Ingresos (Simulado)</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">${INSTRUCTOR_KPI.monthlyRevenue}</div>
            <p className="text-xs text-muted mt-1">
               Monex USD
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Layer */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Chart */}
        <Card className="lg:col-span-4 bg-surface/50 border-border">
          <CardHeader>
            <CardTitle>Inscripciones Semanales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height={300} minHeight={300}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-surface to-surface-secondary border-border flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" /> Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             
             <div className="p-4 rounded-xl border border-warning/50 bg-warning/10 flex gap-4 items-start">
               <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-semibold text-sm text-foreground">Alta tasa de reprobación</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    El 40% de los alumnos reprueba el "Examen de Alturas (Módulo 2)". Considera agregar material de apoyo descargable o revisar la dificultad de las preguntas.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 text-xs w-full sm:w-auto h-8 border-warning/30 hover:bg-warning/20">
                    Revisar Módulo
                  </Button>
               </div>
             </div>

             <div className="p-4 rounded-xl border border-border bg-surface-secondary/50 flex gap-4 items-start">
               <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
               <div>
                  <h4 className="font-semibold text-sm text-foreground">Excelente Engagement</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    El curso "Uso Correcto de EPP Avanzado" retiene al 95% de sus alumnos hasta el módulo final. ¡Gran trabajo!
                  </p>
               </div>
             </div>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}
