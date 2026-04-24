"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Eye,
  MousePointerClick,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Tag
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const conversionData = [
  { name: "Lun", visitas: 1240, conversiones: 89 },
  { name: "Mar", visitas: 1380, conversiones: 112 },
  { name: "Mié", visitas: 1590, conversiones: 145 },
  { name: "Jue", visitas: 1890, conversiones: 178 },
  { name: "Vie", visitas: 2340, conversiones: 234 },
  { name: "Sáb", visitas: 1980, conversiones: 198 },
  { name: "Dom", visitas: 1560, conversiones: 156 },
];

const trafficData = [
  { name: "Sem 1", organic: 4000, paid: 2400, social: 1200 },
  { name: "Sem 2", organic: 3800, paid: 2680, social: 1400 },
  { name: "Sem 3", organic: 4200, paid: 2890, social: 1600 },
  { name: "Sem 4", organic: 4500, paid: 3100, social: 1800 },
];

const activePromotions = [
  { id: "PROMO-001", name: "Descuento 20% EPP", course: "Uso Correcto de EPP", discount: "20%", status: "active", uses: 45, maxUses: 100 },
  { id: "PROMO-002", name: "Cupón Fin de Semana", course: "General", discount: "$15", status: "active", uses: 78, maxUses: 200 },
  { id: "PROMO-003", name: "Black Friday", course: "Todos los cursos", discount: "35%", status: "scheduled", uses: 0, maxUses: 500 },
];

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard de Marketing</h1>
          <p className="text-muted">Métricas, promociones y rendimiento de campañas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border">
            <TrendingUp className="h-4 w-4 mr-2" />
            Ver Reportes
          </Button>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Megaphone className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Tasa de Conversión</p>
                <p className="text-2xl font-bold">12.8%</p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+2.4% vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <Percent className="h-6 w-6 text-pink-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Visitas Totales</p>
                <p className="text-2xl font-bold">12,458</p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+18.2% vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Conversiones</p>
                <p className="text-2xl font-bold">1,594</p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Ingresos por Promo</p>
                <p className="text-2xl font-bold">$8,245</p>
                <div className="flex items-center gap-1 text-xs text-danger mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-3.2% vs mes anterior</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Chart */}
        <Card className="bg-surface/60 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Conversiones Semanales</CardTitle>
            <p className="text-xs text-muted">Visitas vs Conversiones (últimos 7 días)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={conversionData}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversiones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="visitas" stroke="#ec4899" fillOpacity={1} fill="url(#colorVisitas)" />
                <Area type="monotone" dataKey="conversiones" stroke="#10b981" fillOpacity={1} fill="url(#colorConversiones)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-surface/60 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Fuentes de Tráfico</CardTitle>
            <p className="text-xs text-muted">Distribución por canal (últimas 4 semanas)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="organic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paid" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="social" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Promotions */}
      <Card className="bg-surface/60 border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5 text-pink-500" />
                Promociones Activas
              </CardTitle>
              <p className="text-xs text-muted">Cupones y descuentos actualmente vigentes</p>
            </div>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              <Percent className="h-4 w-4 mr-2" />
              Crear Promoción
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activePromotions.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-secondary/30 hover:bg-surface-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{promo.name}</h4>
                    <p className="text-xs text-muted">{promo.course}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={promo.status === "active" ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning border-warning/30"}>
                        {promo.status === "active" ? "Activa" : "Programada"}
                      </Badge>
                      <span className="text-xs text-muted">ID: {promo.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-500">{promo.discount}</p>
                  <p className="text-xs text-muted mt-1">
                    {promo.uses} / {promo.maxUses} usos
                  </p>
                  <div className="h-1.5 w-24 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-pink-500 rounded-full transition-all" 
                      style={{ width: `${(promo.uses / promo.maxUses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Users className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-pink-300">Usuarios Alcanzados</p>
                <p className="text-2xl font-bold text-pink-500">24,589</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MousePointerClick className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-blue-300">CTR Promedio</p>
                <p className="text-2xl font-bold text-blue-500">3.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <Megaphone className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-amber-300">Campañas Activas</p>
                <p className="text-2xl font-bold text-amber-500">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
