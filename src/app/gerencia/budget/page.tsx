"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank,
  HardHat,
  GraduationCap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Mock Data
const ROI_DATA = [
  { month: 'Ene', inversion: 12000, ahorro: 15000 },
  { month: 'Feb', inversion: 8000, ahorro: 18000 },
  { month: 'Mar', inversion: 15000, ahorro: 22000 },
  { month: 'Abr', inversion: 9000, ahorro: 25000 },
  { month: 'May', inversion: 11000, ahorro: 28000 },
  { month: 'Jun', inversion: 7000, ahorro: 30000 },
];

const SPEND_BREAKDOWN = [
  { category: 'EPP Nuevos', value: 45000 },
  { category: 'Cursos (Plataforma)', value: 12000 },
  { category: 'Licencias IA', value: 18000 },
  { category: 'Auditorías', value: 8000 },
];

export default function BudgetPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-emerald-500" /> Inversión HSEQ
          </h1>
          <p className="text-muted">Análisis financiero de seguridad: Presupuesto, ROI y costos operativos.</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Presupuesto Anual</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000</div>
            <p className="text-xs text-muted mt-1">Ejecutado al 64% (Q2)</p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Ahorro Estimado (Accidentes Evitados)</CardTitle>
            <PiggyBank className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">$138,000</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-success font-medium">+12%</span> vs año anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Gasto en EPP</CardTitle>
            <HardHat className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,000</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-warning" />
              <span className="text-warning font-medium">+5%</span> por recambio anticipado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Gasto en Capacitación</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,000</div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">-20%</span> gracias a plataforma digital
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* ROI Chart */}
        <Card className="bg-surface border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Retorno de Inversión (ROI) en Seguridad</CardTitle>
            <CardDescription>Comparativa entre la inversión mensual vs el costo ahorrado en siniestralidad.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ROI_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, undefined]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="inversion" name="Inversión HSEQ" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="ahorro" name="Ahorro Estimado" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <Card className="bg-surface border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Gastos (YTD)</CardTitle>
            <CardDescription>Desglose de la inversión acumulada en el año.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SPEND_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Inversión']}
                  />
                  <Bar dataKey="value" name="Monto" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
