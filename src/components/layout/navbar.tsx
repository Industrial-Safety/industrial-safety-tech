"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User, Bell, AlertTriangle, FileText, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Definimos un tipo local para soportar las variaciones de los roles de demostración
type SessionUser = {
  name: string;
  role: string;
  email: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      
      // Auto-corregir la sesión si el usuario está en la ruta /jefe pero su rol viejo se quedó pegado
      if (pathname && pathname.startsWith("/jefe") && parsedUser.role !== "Jefe de Seguridad") {
        const fixedUser = { ...parsedUser, role: "Jefe de Seguridad", name: "Jefe de Seguridad" };
        sessionStorage.setItem("user", JSON.stringify(fixedUser));
        setUser(fixedUser);
      } else {
        setUser(parsedUser);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-md px-6 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-muted truncate max-w-[200px] md:max-w-none">
          <span className="hidden sm:inline">Políticas de Seguridad Industrial <span className="mx-2 text-border">/</span></span> Gestión Central
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <button 
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={cn(
            "relative p-2 rounded-full transition-colors",
            notificationsOpen ? "bg-amber-500/20 text-amber-500" : "text-muted hover:bg-surface-secondary hover:text-foreground"
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
              
              <div className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors border border-transparent hover:border-slate-700 mb-1">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Alerta Detección IA</p>
                    <p className="text-xs text-muted mt-1 leading-snug">Personal sin EPP detectado en Zona Carga.</p>
                    <span className="text-[10px] text-muted-foreground mt-2 block">Hace 5 min</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors border border-transparent hover:border-slate-700">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Stock EPP Crítico</p>
                    <p className="text-xs text-muted mt-1 leading-snug">Arneses de Altura están por debajo del nivel mínimo.</p>
                    <span className="text-[10px] text-muted-foreground mt-2 block">Hace 1 hora</span>
                  </div>
                </div>
              </div>

            </div>
            <div className="p-3 border-t border-slate-800 bg-surface-secondary/30 rounded-b-xl text-center">
              <Link href="/jefe/detection" className="text-xs font-semibold text-amber-500 hover:underline">
                Ir a Panel de Alertas
              </Link>
            </div>
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-500">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/30 text-amber-500 bg-amber-500/10">
                {user.role === "Jefe de Seguridad" ? "Admin" : user.role}
              </Badge>
            </div>
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión" className="ml-2 text-slate-400 hover:text-white">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
