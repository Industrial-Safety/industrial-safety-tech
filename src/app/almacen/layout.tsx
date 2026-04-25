"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Package, Archive, ClipboardCheck, LogOut } from "lucide-react";

export default function AlmacenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-surface/50 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-foreground tracking-tight">Almacén</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <Link href="/almacen" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/almacen' ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <Archive className="h-4 w-4" /> Inventario Físico
            </Link>
            <Link href="/almacen/entregas" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.includes('/entregas') ? 'bg-teal-500/10 text-teal-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <ClipboardCheck className="h-4 w-4" /> Control de Entregas
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <Link href="/select-role" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors w-full">
            <LogOut className="h-4 w-4" /> Cambiar Rol
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
