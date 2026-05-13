"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PieChart,
  BookOpen,
  BarChart4,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Briefcase,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";

interface UnreadConv {
  id: string;
  studentName: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadForOtherParty: number;
}

const instructorNavItems = [
  { href: "/instructor", label: "Dashboard", icon: PieChart },
  { href: "/instructor/courses", label: "Mis Cursos", icon: BookOpen },
  { href: "/instructor/analytics", label: "Analíticas por Alumno", icon: BarChart4 },
  { href: "/instructor/communications", label: "Comunicaciones", icon: MessageSquare },
  { href: "/instructor/profile", label: "Mi Perfil", icon: User },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadConvs, setUnreadConvs] = useState<UnreadConv[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Read cached avatar immediately for instant render
    try {
      const cached = localStorage.getItem("custom_avatar");
      if (cached) setCustomAvatar(cached);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!session?.dbId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/proxy/users/${session.dbId}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data?.urlPhoto) {
          setCustomAvatar(data.urlPhoto);
          try { localStorage.setItem("custom_avatar", data.urlPhoto); } catch (_) {}
        }
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, [session?.dbId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ url: string }>;
      if (custom.detail?.url) setCustomAvatar(custom.detail.url);
    };
    window.addEventListener("avatar-updated", handler);
    return () => window.removeEventListener("avatar-updated", handler);
  }, []);

  useEffect(() => {
    const instructorId = session?.keycloakId as string | undefined;
    if (!instructorId) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch(`/api/proxy/chat/conversations/instructor/${instructorId}`);
        if (!res.ok) return;
        const convs: UnreadConv[] = await res.json();
        const withUnread = convs.filter(c => c.unreadForOtherParty > 0);
        setUnreadCount(withUnread.reduce((acc, c) => acc + c.unreadForOtherParty, 0));
        setUnreadConvs(withUnread.slice(0, 5));
      } catch {}
    };
    fetchUnread();
    pollRef.current = setInterval(fetchUnread, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [session?.keycloakId]);


  const handleLogout = () => {
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
    const idToken = session?.idToken;
    let logoutUrl = `${issuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin + "/login")}&client_id=${clientId}`;
    if (idToken) logoutUrl += `&id_token_hint=${idToken}`;
    signOut({ redirect: false }).then(() => {
      window.location.href = logoutUrl;
    });
  };

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
            src={customAvatar || session?.user?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"} 
            alt="Instructor" 
            size={collapsed ? "sm" : "xl"}
            className={cn("border-2 border-primary/20", collapsed ? "mb-0" : "mb-3")}
          />
          {!collapsed && (
            <div className="flex flex-col items-center animate-in fade-in duration-300">
              <h3 className="font-semibold text-sm text-center line-clamp-1 text-primary">
                {session?.user?.name || "Cargando..."}
              </h3>
              <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30 flex gap-1 items-center uppercase tracking-wider">
                <Briefcase className="h-3 w-3" /> Instructor
              </Badge>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden">
          {instructorNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/instructor');
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
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className={cn("shrink-0", collapsed ? "h-6 w-6" : "h-5 w-5")} />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 bg-background overflow-hidden relative">
        
        {/* Header Superior */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-surface/50 backdrop-blur-md px-6 z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-medium text-muted truncate max-w-[200px] md:max-w-none">
                <span className="hidden sm:inline">Portal de Instructores <span className="mx-2 text-border">/</span></span> Control Académico
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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-black">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute top-12 right-0 w-80 bg-surface border border-border shadow-xl rounded-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Mensajes sin leer</h3>
                  <button onClick={() => setNotificationsOpen(false)} className="text-muted hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {unreadConvs.length === 0 ? (
                    <p className="text-xs text-muted text-center py-6">No tienes mensajes sin leer</p>
                  ) : (
                    unreadConvs.map(conv => (
                      <button
                        key={conv.id}
                        onClick={() => { setNotificationsOpen(false); router.push("/instructor/communications"); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-surface-secondary transition-colors border border-transparent hover:border-border mb-1"
                      >
                        <div className="flex gap-3 items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                            {conv.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-semibold truncate">{conv.studentName}</p>
                              <Badge className="h-4 px-1.5 text-[9px] shrink-0">{conv.unreadForOtherParty}</Badge>
                            </div>
                            <p className="text-xs text-muted mt-0.5 truncate">{conv.lastMessagePreview ?? "Nuevo mensaje"}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-border bg-surface-secondary/30 rounded-b-xl text-center">
                  <Link
                    href="/instructor/communications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Ir a Comunicaciones
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav (Simple mapping for small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border z-50 flex items-center justify-around px-2">
         {instructorNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/instructor');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-primary" : "text-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] truncate w-full text-center px-1">{item.label}</span>
              </Link>
            )
         })}
      </div>
    </div>
  );
}
