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
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const studentNavItems = [
  { href: "/student", label: "Mi Resumen", icon: LayoutDashboard },
  { href: "/student/learning", label: "Mi Aprendizaje", icon: BookOpen },
  { href: "/student/certificates", label: "Mis Certificados", icon: Award },
  { href: "/student/support", label: "Soporte", icon: Headphones },
  { href: "/student/profile", label: "Mi Perfil", icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
            alt="Estudiante" 
            size={collapsed ? "sm" : "xl"}
            className={cn("border-2 border-primary/20", collapsed ? "mb-0" : "mb-3")}
          />
          {!collapsed && (
            <div className="flex flex-col items-center animate-in fade-in duration-300">
              <h3 className="font-semibold text-sm text-center line-clamp-1">Alex Rivera</h3>
              <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30 flex gap-1 items-center">
                <GraduationCap className="h-3 w-3" /> Estudiante
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden">
          {studentNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/student');
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
            href="/login"
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
                  <Link href="/student/learning" className="text-xs font-semibold text-primary hover:underline">
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

    </div>
  );
}
