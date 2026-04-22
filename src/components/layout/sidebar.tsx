"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  HardHat,
  Camera,
  ChevronLeft,
  ChevronRight,
  Shield,
  LifeBuoy,
  User
} from "lucide-react";

const navItems = [
  { href: "/jefe", label: "Dashboard General", icon: LayoutDashboard },
  { href: "/jefe/certificates", label: "Certificados", icon: FileText },
  { href: "/jefe/inventory", label: "Inventario EPP", icon: HardHat },
  { href: "/jefe/detection", label: "Detección IA", icon: Camera },
  { href: "/jefe/support", label: "Soporte", icon: LifeBuoy },
  { href: "/jefe/profile", label: "Mi Perfil", icon: User },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800 bg-surface transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <Link href="/jefe" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
              <Shield className="h-4 w-4 text-slate-950" />
            </div>
            <span className="text-sm font-bold text-foreground">Jefe Seg.</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 text-muted hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-muted hover:bg-surface-secondary hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
