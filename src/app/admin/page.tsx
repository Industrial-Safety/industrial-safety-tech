"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Users, Activity, Video, Database, Server, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock Data for Recharts
const userActivityData = [
  { time: '08:00', users: 120 },
  { time: '10:00', users: 250 },
  { time: '12:00', users: 310 },
  { time: '14:00', users: 280 },
  { time: '16:00', users: 360 },
  { time: '18:00', users: 190 },
  { time: '20:00', users: 90 },
];

const ROLES = [
  { name: "Estudiante", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces" },
  { name: "Empleado", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces" },
  { name: "Jefe de Seguridad", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" },
  { name: "Gerencia General", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" },
  { name: "Marketing", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=faces" },
  { name: "Instructor de Cursos", image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&h=150&fit=crop&crop=faces" },
  { name: "Administrador", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
]

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header section with roles */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Visión General del Sistema</h1>
        <p className="text-muted mb-6">Métricas de rendimiento de la plataforma y salud de los microservicios.</p>
        
        <Card className="bg-surface/50 border-border backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted">Tipos de Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 items-center">
              {ROLES.map((role) => (
                <div key={role.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Avatar src={role.image} alt={role.name} size="lg" className="border-2 border-surface-secondary group-hover:border-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-muted group-hover:text-foreground transition-colors text-center w-20 leading-tight">
                    {role.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Usuarios Activos (Ahora)</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-success flex items-center mt-1">
              <ChevronUp className="h-3 w-3 mr-1" />
              +12% desde la última hora
            </p>
            <div className="text-xs text-muted mt-3 flex justify-between">
              <span>Staff: 145</span>
              <span>Clientes: 1,100</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Estado de Cámaras</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24 <span className="text-sm text-muted font-normal">/ 25</span></div>
            <p className="text-xs text-muted mt-1">Dispositivos conectados</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-success"><span className="w-2 h-2 rounded-full bg-success"></span> 24 Online</span>
              <span className="flex items-center gap-1 text-danger"><span className="w-2 h-2 rounded-full bg-danger"></span> 1 Offline</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Spring Boot Core</CardTitle>
            <Server className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="text-xl font-bold">Healthy</div>
            </div>
            <p className="text-xs text-muted mt-1">Uptime: 14d 6h 32m</p>
            <div className="mt-3 text-xs text-muted">
              Memoria: 1.2GB / 4GB
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Base de Datos</CardTitle>
            <Database className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="text-xl font-bold">Carga Alta</div>
            </div>
            <p className="text-xs text-muted mt-1">Latencia media: 120ms</p>
            <div className="mt-3 text-xs text-muted">
              Conexiones: 45/50 pool
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-surface/50 border-border md:col-span-2">
          <CardHeader>
            <CardTitle>Tráfico de Usuarios en Tiempo Real</CardTitle>
            <CardDescription>Conexiones concurrentes por hora en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--color-foreground)' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full animate-pulse rounded-md bg-surface-secondary/50" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
