"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, CheckCircle2, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

interface CourseItem {
  courseId: string;
  courseName: string;
  title: string;
  subtitle: string;
  coverImageUrl: string | null;
  level: string | null;
  progress: number;
  paidAt: string | null;
}

type FilterTab = "all" | "in-progress" | "completed";

export default function TrabajadorLearningPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");

  useEffect(() => {
    if (!session?.keycloakId) return;
    loadCourses(session.keycloakId as string);
  }, [session?.keycloakId]);

  const loadCourses = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/orders/by-user/${userId}`);
      if (!res.ok) return;
      const orders: any[] = await res.json();
      const paid = orders.filter(o => o.orderStatus === "COMPLETED");
      const courseIds = new Set<string>();
      const itemMap = new Map<string, any>();
      for (const order of paid) {
        for (const item of (order.orderLineItemsList ?? [])) {
          if (!courseIds.has(item.idCurso)) {
            courseIds.add(item.idCurso);
            itemMap.set(item.idCurso, { ...item, paidAt: order.paidAt });
          }
        }
      }
      const details = await Promise.all(
        Array.from(courseIds).map(id =>
          fetch(`/api/proxy/course/${id}`).then(r => r.ok ? r.json() : null)
        )
      );
      const built: CourseItem[] = details.filter(Boolean).map((d: any) => {
        const courseId = d._id ?? d.id;
        const item = itemMap.get(courseId);
        const progress = parseInt(localStorage.getItem(`progress_${courseId}`) ?? "0", 10);
        return {
          courseId,
          courseName: item?.courseName ?? d.title,
          title: d.title,
          subtitle: d.subtitle ?? "",
          coverImageUrl: d.coverImageUrl ?? null,
          level: d.details?.level ?? null,
          progress,
          paidAt: item?.paidAt ?? null,
        };
      });
      setCourses(built);
    } catch (e) {
      console.error("Error cargando cursos:", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.level ?? "").toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (tab === "in-progress") return c.progress > 0 && c.progress < 100;
    if (tab === "completed") return c.progress === 100;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Aprendizaje</h1>
          <p className="text-muted">Cursos de capacitación y su progreso actual.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
          <Input type="search" placeholder="Buscar curso..." className="pl-9 bg-surface/50 border-border"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-4 border-b border-border pb-px overflow-x-auto whitespace-nowrap">
        {(["all", "in-progress", "completed"] as FilterTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-sm font-medium pb-2 px-1 border-b-2 transition-colors ${
              tab === t ? "text-primary border-primary" : "text-muted border-transparent hover:text-foreground"
            }`}>
            {t === "all" ? "Todos los Cursos" : t === "in-progress" ? "En Progreso" : "Completados"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-muted">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando tus cursos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            {courses.length === 0 ? "Aún no tienes cursos asignados." : "No hay cursos que coincidan."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <Card key={course.courseId}
              className="bg-surface/50 border-border overflow-hidden group flex flex-col h-full hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="aspect-[16/9] relative bg-slate-900 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-10" />
                {course.coverImageUrl ? (
                  <img src={course.coverImageUrl} alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-slate-600" />
                  </div>
                )}
                {course.level && (
                  <div className="absolute top-3 left-3 z-20">
                    <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-md">{course.level}</Badge>
                  </div>
                )}
                {course.progress === 100 && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <CheckCircle2 className="h-12 w-12 text-success opacity-90 drop-shadow-md" />
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <div className="mt-auto space-y-4 pt-4">
                  {course.progress < 100 ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted font-medium">
                        <span>Progreso</span>
                        <span className="text-primary text-xs">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-success font-medium">
                      <Award className="h-4 w-4" />
                      Completado el {course.paidAt ? new Date(course.paidAt).toLocaleDateString("es-ES") : "—"}
                    </div>
                  )}
                  <Link href={`/trabajador/learning/${course.courseId}`} className="block">
                    <Button variant={course.progress === 100 ? "outline" : "primary"} className="w-full shadow-md">
                      {course.progress === 100 ? "Repasar Material" : course.progress > 0 ? "Continuar" : "Empezar Curso"}
                      {course.progress < 100 && <PlayCircle className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
