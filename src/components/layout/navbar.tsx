"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, User, X, AlertTriangle, FileText, ClipboardList } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CartDropdown } from "@/components/layout/cart-dropdown";

type SessionUser = {
  name: string;
  role: string;
  email: string;
};

type Notification = {
  id: number;
  type: "alert" | "info" | "warning";
  title: string;
  message: string;
  time: string;
  link: string;
  linkText: string;
};

const notificationsByRole: Record<string, Notification[]> = {
  "Jefe de Seguridad": [
    {
      id: 1,
      type: "alert",
      title: "Alerta Detección IA",
      message: "Personal sin EPP detectado en Zona Carga.",
      time: "Hace 5 min",
      link: "/jefe/detection",
      linkText: "Ir a Panel de Alertas"
    },
    {
      id: 2,
      type: "warning",
      title: "Stock EPP Crítico",
      message: "Arneses de Altura están por debajo del nivel mínimo.",
      time: "Hace 1 hora",
      link: "/jefe/requests",
      linkText: "Ver Solicitudes"
    }
  ],
  "Gerente General": [
    {
      id: 1,
      type: "info",
      title: "Reporte Mensual Disponible",
      message: "El reporte de cumplimiento de Octubre está listo.",
      time: "Hace 2 horas",
      link: "/gerencia/reports",
      linkText: "Ver Reporte"
    },
    {
      id: 2,
      type: "warning",
      title: "Meta de Capacitación",
      message: "El 78% del personal ha completado las capacitaciones.",
      time: "Hace 1 día",
      link: "/gerencia/compliance",
      linkText: "Ver Cumplimiento"
    }
  ],
  "Operario / Empleado": [
    {
      id: 1,
      type: "alert",
      title: "Certificado Vencido",
      message: "La certificación de SSL Osha expira en 5 días.",
      time: "Hace 2 horas",
      link: "/trabajador/learning",
      linkText: "Ver Cursos"
    },
    {
      id: 2,
      type: "info",
      title: "Nuevo Curso Asignado",
      message: "Se te ha asignado 'Primeros Auxilios Nivel 2'.",
      time: "Ayer",
      link: "/trabajador/learning",
      linkText: "Ver Cursos"
    }
  ],
  "Estudiante": [
    {
      id: 1,
      type: "alert",
      title: "Certificado Vencido",
      message: "La certificación de SSL Osha expira en 5 días.",
      time: "Hace 2 horas",
      link: "/student/learning",
      linkText: "Ver Cursos"
    },
    {
      id: 2,
      type: "info",
      title: "Nuevo Curso Asignado",
      message: "Se te ha asignado 'Primeros Auxilios Nivel 2'.",
      time: "Ayer",
      link: "/student/learning",
      linkText: "Ver Cursos"
    }
  ]
};

const roleColors: Record<string, { primary: string; bg: string; border: string }> = {
  "Jefe de Seguridad": { primary: "text-amber-500", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  "Gerente General": { primary: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  "Operario / Empleado": { primary: "text-blue-500", bg: "bg-blue-500/20", border: "border-blue-500/30" },
  "Estudiante": { primary: "text-purple-500", bg: "bg-purple-500/20", border: "border-purple-500/30" }
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);

      // Auto-corregir la sesión si el usuario está en la ruta /jefe pero su rol viejo se quedó pegado
      if (pathname && pathname.startsWith("/jefe") && parsedUser.role !== "Jefe de Seguridad") {
        const fixedUser = { ...parsedUser, role: "Jefe de Seguridad", name: "Jefe de Seguridad" };
        sessionStorage.setItem("user", JSON.stringify(fixedUser));
        setUser(fixedUser);
        setNotifications(notificationsByRole["Jefe de Seguridad"] || []);
      } else {
        setNotifications(notificationsByRole[parsedUser.role] || []);
      }
    }
  }, [pathname]);

  const currentRole = user?.role || "";
  const colors = roleColors[currentRole] || roleColors["Jefe de Seguridad"];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert": return AlertTriangle;
      case "warning": return FileText;
      default: return ClipboardList;
    }
  };

  const headerTitles: Record<string, string> = {
    "Jefe de Seguridad": "Seguridad Industrial / Panel de Control",
    "Gerente General": "Gerencia / Resumen Ejecutivo",
    "Operario / Empleado": "Seguridad Industrial / Portal de Formación",
    "Estudiante": "Seguridad Industrial / Portal de Formación"
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-md px-6 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-muted truncate max-w-[200px] md:max-w-none">
          <span className="hidden sm:inline">{headerTitles[currentRole] || "Seguridad Industrial / Panel"}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Cart Dropdown - Solo para estudiantes */}
        {(currentRole === "Estudiante" || currentRole === "Alumno") && (
          <div className="mr-2">
            <CartDropdown />
          </div>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={cn(
            "relative p-2 rounded-full transition-colors",
            notificationsOpen ? `${colors.bg} ${colors.primary}` : "text-muted hover:bg-surface-secondary hover:text-foreground"
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
          <div className="absolute top-12 right-10 w-80 bg-surface border border-slate-800 shadow-xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-semibold text-sm">Notificaciones Recientes</h3>
              <button onClick={() => setNotificationsOpen(false)} className="text-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <Link key={notification.id} href={notification.link} className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors border border-transparent hover:border-slate-700 mb-1 block">
                      <div className="flex gap-3">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          notification.type === "alert" ? "bg-danger/10" :
                          notification.type === "warning" ? "bg-amber-500/10" : "bg-primary/10"
                        )}>
                          <Icon className={cn("h-4 w-4",
                            notification.type === "alert" ? "text-danger" :
                            notification.type === "warning" ? "text-amber-500" : "text-primary"
                          )} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{notification.title}</p>
                          <p className="text-xs text-muted mt-1 leading-snug">{notification.message}</p>
                          <span className="text-[10px] text-muted-foreground mt-2 block">{notification.time}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-muted">
                  No hay notificaciones nuevas
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-800 bg-surface-secondary/30 rounded-b-xl text-center">
                <Link href={notifications[0].link} className="text-xs font-semibold hover:underline" style={{ color: currentRole === "Gerente General" ? "#10b981" : currentRole === "Jefe de Seguridad" ? "#f59e0b" : undefined }}>
                  {notifications[0].linkText}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
              <User className="h-4 w-4 text-muted" />
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", colors.border, colors.primary, colors.bg)}>
                {user.role}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
