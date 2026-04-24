"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Headphones,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";

const studentNavItems = [
  { href: "/student", label: "Mi Resumen", icon: LayoutDashboard },
  { href: "/student/learning", label: "Mi Aprendizaje", icon: BookOpen },
  { href: "/student/support", label: "Soporte", icon: Headphones },
  { href: "/student/profile", label: "Mi Perfil", icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">

      {/* Overlay para mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 flex flex-col border-r border-slate-800 bg-surface transition-all duration-300",
          collapsed ? "md:w-20" : "md:w-64",
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          "h-full"
        )}
      >
        {/* Close button for desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-slate-800 bg-surface shadow-md hover:text-purple-500 transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-muted hover:text-foreground md:hidden"
        >
          <X className="h-5 w-5" />
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
            className={cn("border-2 border-purple-500/20", collapsed ? "mb-0" : "mb-3")}
          />
          {!collapsed && (
            <div className="flex flex-col items-center animate-in fade-in duration-300">
              <h3 className="font-semibold text-sm text-center line-clamp-1">Alex Rivera</h3>
              <Badge variant="outline" className="mt-1 text-[10px] text-purple-500 border-purple-500/30 bg-purple-500/10 flex gap-1 items-center">
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
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-purple-500/10 text-purple-500"
                    : "text-muted hover:bg-surface-secondary hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && collapsed && (
                  <div className="absolute left-0 w-1 h-full bg-purple-500 rounded-r-md"></div>
                )}
                <item.icon className={cn("shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout - Separado visualmente */}
        <div className="border-t border-slate-800 p-3">
          <Link
            href="/select-role"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors",
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
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-md px-4 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-secondary transition-colors"
          >
            <Menu className="h-5 w-5 text-muted" />
          </button>
          <span className="text-sm font-semibold text-foreground">Estudiante</span>
          <div className="w-10" /> {/* Spacer para centrar el título */}
        </div>

        <Navbar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
