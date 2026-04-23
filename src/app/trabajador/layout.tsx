"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  GraduationCap,
  Headphones,
  FileText,
  AlertTriangle,
  X,
  Camera,
  ShieldAlert,
  HardHat,
  Trophy,
  Upload
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const workerNavItems = [
  { href: "/trabajador", label: "Mi Resumen", icon: LayoutDashboard },
  { href: "/trabajador/learning", label: "Mi Aprendizaje", icon: BookOpen },
  { href: "/trabajador/leaderboard", label: "Ranking", icon: Trophy },
  { href: "/trabajador/certificates", label: "Certificados", icon: Award },
  { href: "/trabajador/equipment", label: "Estado de EPP", icon: HardHat },
  { href: "/trabajador/alerts", label: "Mis Alertas", icon: ShieldAlert },
  { href: "/trabajador/support", label: "Soporte", icon: Headphones },
  { href: "/trabajador/profile", label: "Mi Perfil", icon: User },
];

export default function TrabajadorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [nearMissModalOpen, setNearMissModalOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      
      {/* Sidebar */}
      <aside
        className={cn(
          "relative hidden md:flex flex-col border-r border-slate-800 bg-surface transition-all duration-300 z-20 shrink-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-800 bg-surface shadow-md hover:text-primary transition-colors z-30"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Profile Area */}
        <div className={cn(
          "flex flex-col items-center border-b border-slate-800 py-6 transition-all",
          collapsed ? "px-2" : "px-4"
        )}>
           <Avatar 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces" 
            alt="Operario" 
            size={collapsed ? "sm" : "xl"}
            className={cn("border-2 border-primary/20", collapsed ? "mb-0" : "mb-3")}
          />
          {!collapsed && (
            <div className="flex flex-col items-center animate-in fade-in duration-300">
              <h3 className="font-semibold text-sm text-center line-clamp-1">Alex Rivera</h3>
              <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30 flex gap-1 items-center">
                <GraduationCap className="h-3 w-3" /> Operario / Empleado
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden">
          {workerNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/trabajador');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface-secondary hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && collapsed && (
                  <div className="absolute left-0 w-1 h-full bg-primary rounded-r-md"></div>
                )}
                <item.icon className={cn("shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout area */}
        <div className="p-3 border-t border-slate-800">
          <Link
            href="/select-role"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className={cn("shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")} />
            {!collapsed && <span>Cerrar Sesión</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 bg-background overflow-hidden relative">
        
        {/* Header Superior */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-md px-6 z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-medium text-muted truncate max-w-[200px] md:max-w-none">
                <span className="hidden sm:inline">Políticas de Seguridad Industrial <span className="mx-2 text-border">/</span></span> Portal de Formación
             </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={cn(
                "relative p-2 rounded-full transition-colors",
                notificationsOpen ? "bg-primary/20 text-primary" : "text-muted hover:bg-surface-secondary hover:text-foreground"
              )}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute top-12 right-0 w-80 bg-surface border border-border shadow-xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Notificaciones</h3>
                  <button onClick={() => setNotificationsOpen(false)} className="text-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  
                  {/* Notification Items Mock */}
                  <div className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors border border-transparent hover:border-border mb-1">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-danger" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Certificado Vencido</p>
                        <p className="text-xs text-muted mt-1 leading-snug">La certificación de SSL Osha expira en 5 días.</p>
                        <span className="text-[10px] text-muted-foreground mt-2 block">Hace 2 horas</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors border border-transparent hover:border-border">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Nuevo Curso Asignado</p>
                        <p className="text-xs text-muted mt-1 leading-snug">Se te ha asignado "Primeros Auxilios Nivel 2".</p>
                        <span className="text-[10px] text-muted-foreground mt-2 block">Ayer</span>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="p-3 border-t border-border bg-surface-secondary/30 rounded-b-xl text-center">
                  <Link href="/trabajador/learning" className="text-xs font-semibold text-primary hover:underline">
                    Ver todo
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Near-Miss Floating Button */}
      <button
        onClick={() => setNearMissModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-warning hover:bg-warning/90 text-warning-foreground p-4 rounded-full shadow-xl hover:scale-110 transition-all group flex items-center justify-center border border-warning/50 animate-[bounce_3s_infinite]"
        title="Reporte Rápido de Riesgos"
      >
        <AlertTriangle className="h-6 w-6 text-black" />
        <span className="absolute right-full mr-4 bg-surface px-3 py-1.5 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border shadow-md">
          Reportar Riesgo (Near-Miss)
        </span>
      </button>

      {/* Near-Miss Modal */}
      {nearMissModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-warning/30 shadow-2xl rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-warning"></div>
            <div className="p-5 border-b border-border flex items-center justify-between bg-warning/5">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold">Reporte Rápido de Riesgos</h3>
              </div>
              <button 
                onClick={() => setNearMissModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted">Avisa instantáneamente sobre cualquier peligro inminente (derrame, equipo defectuoso) en tu área.</p>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Ubicación / Área</label>
                  <Input placeholder="Ej. Almacén Zona B" className="border-border/50 bg-black/20 focus-visible:ring-warning/50" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground/80">Descripción del Peligro</label>
                  <textarea 
                    className="w-full h-24 flex rounded-md border border-border/50 bg-black/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warning/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors" 
                    placeholder="Ej. Derrame de aceite en el pasillo principal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold flex items-center gap-2 text-foreground/80">Evidencia Fotográfica</label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-5 text-center bg-black/10 hover:bg-surface-secondary/50 transition-colors cursor-pointer group">
                    <Camera className="h-6 w-6 mx-auto mb-2 text-muted group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted block">Tomar foto usando la cámara del dispositivo móvil o subir archivo de galería</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-secondary/30 p-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setNearMissModalOpen(false)} className="hover:bg-surface border-transparent">
                Cancelar
              </Button>
              <Button className="bg-warning hover:bg-warning/90 text-black font-semibold">
                Enviar Alerta Urgente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
