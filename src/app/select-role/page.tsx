"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, GraduationCap, User, HardHat, ArrowLeft, Briefcase, Activity, Target, Megaphone, Truck } from "lucide-react";

export default function SelectRolePage() {
  const router = useRouter();

  const handleRoleLogin = (role: string, path: string) => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        role,
        name: role, // Name equals the role title directly
        email: `${role.toLowerCase().replace(/ /g, '_')}@industrial-safety.com`,
      })
    );

    const redirectUrl = sessionStorage.getItem("postLoginRedirect");
    if (redirectUrl) {
      sessionStorage.removeItem("postLoginRedirect");
      router.push(redirectUrl);
    } else {
      router.push(path);
    }
  };

  const roles = [
    {
      id: "gerencia",
      title: "Gerencia General",
      description: "Dashboard Ejecutivo y KPIs",
      path: "/gerencia",
      icon: Target,
      color: "teal",
    },
    {
      id: "admin",
      title: "Administrador",
      description: "Jefe o Gerente General",
      path: "/admin",
      icon: Shield,
      color: "amber",
    },
    {
      id: "instructor",
      title: "Instructor",
      description: "Creador de Contenido",
      path: "/instructor",
      icon: GraduationCap,
      color: "blue",
    },
    {
      id: "student",
      title: "Alumno",
      description: "Estudiante Regular",
      path: "/#cursos",
      icon: User,
      color: "emerald",
    },
    {
      id: "trabajador",
      title: "Trabajador",
      description: "Operario de Planta",
      path: "/trabajador",
      icon: HardHat,
      color: "purple",
    },
    {
      id: "jefe_seguridad",
      title: "Jefe de Seguridad",
      description: "Gestión y Supervisión de EPP",
      path: "/jefe",
      icon: Briefcase,
      color: "indigo",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Promociones y Campañas",
      path: "/marketing",
      icon: Megaphone,
      color: "pink",
    },
    {
      id: "logistica",
      title: "Logística y Almacén",
      description: "Planificación, Compras e Inventario",
      path: "/logistica",
      icon: Truck,
      color: "rose",
    },
  ];

  // Helper to map color strings to Tailwind classes
  const getColorClasses = (color: string) => {
    const classes: Record<string, { hoverBg: string, hoverBorder: string, iconBg: string, iconHoverBg: string }> = {
      amber: { hoverBg: "hover:bg-amber-500/10", hoverBorder: "hover:border-amber-500/50", iconBg: "group-hover:bg-amber-500", iconHoverBg: "group-hover:text-amber-950" },
      blue: { hoverBg: "hover:bg-blue-500/10", hoverBorder: "hover:border-blue-500/50", iconBg: "group-hover:bg-blue-500", iconHoverBg: "group-hover:text-blue-950" },
      emerald: { hoverBg: "hover:bg-emerald-500/10", hoverBorder: "hover:border-emerald-500/50", iconBg: "group-hover:bg-emerald-500", iconHoverBg: "group-hover:text-emerald-950" },
      purple: { hoverBg: "hover:bg-purple-500/10", hoverBorder: "hover:border-purple-500/50", iconBg: "group-hover:bg-purple-500", iconHoverBg: "group-hover:text-purple-950" },
      indigo: { hoverBg: "hover:bg-indigo-500/10", hoverBorder: "hover:border-indigo-500/50", iconBg: "group-hover:bg-indigo-500", iconHoverBg: "group-hover:text-indigo-950" },
      rose: { hoverBg: "hover:bg-rose-500/10", hoverBorder: "hover:border-rose-500/50", iconBg: "group-hover:bg-rose-500", iconHoverBg: "group-hover:text-rose-950" },
      teal: { hoverBg: "hover:bg-teal-500/10", hoverBorder: "hover:border-teal-500/50", iconBg: "group-hover:bg-teal-500", iconHoverBg: "group-hover:text-teal-950" },
      pink: { hoverBg: "hover:bg-pink-500/10", hoverBorder: "hover:border-pink-500/50", iconBg: "group-hover:bg-pink-500", iconHoverBg: "group-hover:text-pink-950" },
    };
    return classes[color] || classes.amber;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-6">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl bg-surface/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-slate-950" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">Portal de Acceso</h1>
              <p className="text-sm text-slate-400">Modo Demostración</p>
            </div>
          </div>
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al Login</span>
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">¿Quién eres hoy?</h2>
          <p className="text-slate-400">
            Para facilitar las pruebas del sistema, selecciona el rol que deseas simular. Cada rol tiene accesos, permisos y vistas diferentes en la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const colors = getColorClasses(role.color);
            const Icon = role.icon;
            
            return (
              <button
                key={role.id}
                onClick={() => handleRoleLogin(role.title, role.path)}
                className={`flex items-start gap-4 p-5 rounded-2xl border border-slate-800 bg-surface/60 transition-all duration-300 text-left group hover:-translate-y-1 hover:shadow-xl ${colors.hoverBg} ${colors.hoverBorder}`}
              >
                <div className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 transition-colors duration-300 ${colors.iconBg}`}>
                  <Icon className={`h-7 w-7 text-slate-300 transition-colors duration-300 ${colors.iconHoverBg}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {role.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
