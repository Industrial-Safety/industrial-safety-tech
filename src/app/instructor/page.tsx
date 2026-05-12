"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Video, TrendingUp, Target, ArrowUpRight,
  MessageSquare, Loader2, BookOpen
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const CHART_DATA = [
  { name: "Lun", students: 24 },
  { name: "Mar", students: 18 },
  { name: "Mié", students: 32 },
  { name: "Jue", students: 28 },
  { name: "Vie", students: 45 },
  { name: "Sáb", students: 60 },
  { name: "Dom", students: 55 },
];

interface CourseItem {
  id?: string; _id?: string; title: string;
}

interface UnreadConv {
  id: string; studentName: string;
  lastMessagePreview: string | null; unreadForOtherParty: number;
}

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [unreadConvs, setUnreadConvs] = useState<UnreadConv[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const instructorId = session?.keycloakId as string | undefined;
    if (!instructorId) return;
    (async () => {
      try {
        const [coursesRes, convsRes] = await Promise.all([
          fetch("/api/proxy/course/my-courses"),
          fetch(`/api/proxy/chat/conversations/instructor/${instructorId}`),
        ]);
        if (coursesRes.ok) setCourses(await coursesRes.json());
        if (convsRes.ok) {
          const convs: UnreadConv[] = await convsRes.json();
          const withUnread = convs.filter(c => c.unreadForOtherParty > 0);
          setUnreadConvs(withUnread.slice(0, 3));
          setUnreadCount(withUnread.reduce((acc, c) => acc + c.unreadForOtherParty, 0));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [session?.keycloakId]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Bienvenido, {(session?.user?.name ?? "Instructor").split(" ")[0]}
        </h1>
        <p className="text-muted">Aquí tienes un resumen del impacto de tus capacitaciones.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Cursos Publicados</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            ) : (
              <div className="text-3xl font-bold">{courses.length}</div>
            )}
            <Link href="/instructor/courses" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> Ver cursos
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Mensajes sin Leer</CardTitle>
            <MessageSquare className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            ) : (
              <div className="text-3xl font-bold">{unreadCount}</div>
            )}
            <Link href="/instructor/communications" className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> Ver mensajes
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted">Tasa de Finalización</CardTitle>
            <Target className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82%</div>
            <p className="text-xs text-muted mt-1">Promedio global</p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="h-16 w-16" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted">Total Alumnos</CardTitle>
            <Users className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">1,540</div>
            <p className="text-xs text-success mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" /> +15% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Messages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        <Card className="lg:col-span-4 bg-surface/50 border-border">
          <CardHeader>
            <CardTitle>Inscripciones Semanales</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                  <Area type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mensajes recientes sin leer */}
        <Card className="lg:col-span-3 bg-surface/50 border-border flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" /> Mensajes Recientes
            </CardTitle>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} sin leer
              </span>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted" />
              </div>
            ) : unreadConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-muted gap-2 py-6">
                <MessageSquare className="h-8 w-8 text-border" />
                <p className="text-sm">Sin mensajes nuevos</p>
              </div>
            ) : (
              <>
                {unreadConvs.map(conv => (
                  <div key={conv.id} className="flex gap-3 items-start p-3 rounded-lg bg-surface-secondary/40 border border-border/50">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {conv.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-semibold truncate">{conv.studentName}</span>
                        <span className="text-[10px] bg-primary text-black rounded-full px-1.5 font-bold shrink-0">
                          {conv.unreadForOtherParty}
                        </span>
                      </div>
                      <p className="text-xs text-muted truncate mt-0.5">{conv.lastMessagePreview ?? "Nuevo mensaje"}</p>
                    </div>
                  </div>
                ))}
                <Link href="/instructor/communications" className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full border-border text-xs">
                    Ver todos los mensajes
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mis cursos rápido */}
      {!loading && courses.length > 0 && (
        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" /> Mis Cursos
            </CardTitle>
            <Link href="/instructor/courses" className="text-xs text-primary hover:underline">Ver todos</Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.slice(0, 3).map(c => (
                <Link
                  key={c._id ?? c.id}
                  href={`/instructor/courses/${c._id ?? c.id}`}
                  className="p-3 rounded-lg border border-border bg-surface-secondary/30 hover:border-primary/50 transition-colors"
                >
                  <p className="text-sm font-semibold line-clamp-2">{c.title}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
