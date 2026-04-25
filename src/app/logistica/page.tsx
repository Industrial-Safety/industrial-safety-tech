"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, AlertTriangle, TrendingUp, Package, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const MOCK_CONSUMO = [
  { mes: "Ene", cascos: 120, guantes: 400, lentes: 200 },
  { mes: "Feb", cascos: 98, guantes: 350, lentes: 150 },
  { mes: "Mar", cascos: 150, guantes: 500, lentes: 280 },
  { mes: "Abr", cascos: 180, guantes: 600, lentes: 300 },
  { mes: "May", cascos: 140, guantes: 450, lentes: 250 },
  { mes: "Jun", cascos: 200, guantes: 700, lentes: 350 },
];

export default function LogisticaDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-rose-950/40 to-transparent p-6 rounded-2xl border border-rose-900/30">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-rose-500" />
            Planificación y Logística
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Supervisa los niveles de stock global, predice la demanda operativa y gestiona las compras de EPP de forma centralizada.
          </p>
        </div>
        <Link href="/logistica/solicitudes">
          <Button 
            size="lg"
            className="bg-rose-500 hover:bg-rose-600 text-white gap-2 shadow-lg shadow-rose-500/25 border-0 rounded-full px-6"
          >
            Ir a Solicitudes de Compra
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-surface/60 border-slate-800 hover:border-rose-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Stock Crítico</p>
                    <p className="text-4xl font-bold text-rose-500">3</p>
                    <p className="text-xs text-slate-500">Items por agotarse</p>
                  </div>
                  <div className="p-3 bg-rose-500/10 rounded-2xl shadow-inner shadow-rose-500/20">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface/60 border-slate-800 hover:border-amber-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">En Tránsito</p>
                    <p className="text-4xl font-bold text-amber-500">5</p>
                    <p className="text-xs text-slate-500">Entregas programadas</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-2xl shadow-inner shadow-amber-500/20">
                    <Truck className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface/60 border-slate-800 hover:border-emerald-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Órdenes Activas</p>
                    <p className="text-4xl font-bold text-emerald-500">12</p>
                    <p className="text-xs text-slate-500">Aprobadas por gerencia</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-inner shadow-emerald-500/20">
                    <Package className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface/60 border-slate-800 hover:border-blue-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Ahorro YTD</p>
                    <p className="text-4xl font-bold text-blue-500">14%</p>
                    <p className="text-xs text-slate-500">vs presupuesto anual</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-2xl shadow-inner shadow-blue-500/20">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Stock Levels */}
            <Card className="bg-surface/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Estado de Inventario EPP</CardTitle>
                <CardDescription>Visualización gráfica del stock actual frente al ideal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-200">Guantes de Nitrilo (Talla L)</span>
                    <span className="text-rose-500 font-bold">10 / 500 uds (Crítico)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full relative" style={{ width: '2%' }}>
                       <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/images/stripe-pattern.svg')] opacity-20"></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-200">Cascos de Seguridad Tipo 1</span>
                    <span className="text-amber-500 font-bold">25 / 200 uds (Bajo)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-200">Lentes de Protección Clara</span>
                    <span className="text-emerald-500 font-bold">180 / 300 uds (Óptimo)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                 <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-200">Botas Dieléctricas (Talla 42)</span>
                    <span className="text-emerald-500 font-bold">45 / 50 uds (Óptimo)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-800/50">
                  <Link href="/logistica/solicitudes">
                    <Button variant="outline" className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white">
                      Crear Solicitud para Ítems Críticos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Consumption Chart */}
            <Card className="bg-surface/50 border-slate-800 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Proyección de Consumo Mensual</CardTitle>
                <CardDescription>Demanda histórica de EPP en unidades.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_CONSUMO} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="mes" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="guantes" name="Guantes" fill="#e11d48" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="cascos" name="Cascos" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="lentes" name="Lentes" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* In Transit Orders */}
            <Card className="bg-surface/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Órdenes en Tránsito</CardTitle>
                <CardDescription>Seguimiento de compras en camino hacia almacén.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Timeline Item 1 */}
                  <div className="relative pl-6 border-l-2 border-amber-500/30 pb-4">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-amber-500 border-4 border-slate-950"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-200">OC-2026-089 (3M Perú)</h4>
                      <Badge className="bg-amber-500/20 text-amber-400 border-none text-[10px]">En Camino</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">500x Mascarillas N95, 200x Tapones Auditivos</p>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Llegada est: Mañana, 09:00 AM
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative pl-6 border-l-2 border-emerald-500/30 pb-4">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-200">OC-2026-085 (MSA Safety)</h4>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px]">Aprobada</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">50x Arneses de Cuerpo Entero</p>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Package className="w-3 h-3" /> Preparando envío
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative pl-6 border-l-2 border-slate-800 pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-slate-200">SC-2026-102 (Req. Interna)</h4>
                      <Badge className="bg-slate-800 text-slate-400 border-none text-[10px]">En Revisión</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Renovación trimestral de guantes (Planta 2)</p>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Esperando Gerencia
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}
