"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, AlertCircle, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CourseOption = { id: string; title: string };

type StudentRow = {
  userId: string;
  name: string;
  email: string;
  score: number | null;
  passed: boolean | null;
  hasAttempt: boolean;
  submittedAt: string | null;
  paidAt: string | null;
};

function getStatus(row: StudentRow): "completed" | "failed" | "in-progress" | "not-started" {
  if (!row.hasAttempt) return "not-started";
  if (row.passed === true) return "completed";
  if (row.passed === false) return "failed";
  return "in-progress";
}

function getProgress(row: StudentRow): number {
  if (row.passed === true) return 100;
  if (row.hasAttempt) return 50;
  return 0;
}

function formatDate(iso: string | null): string {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AnalyticsPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "progress">("name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetch("/api/proxy/course/my-courses")
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => setCourses(data.map(c => ({ id: c.id, title: c.title }))))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) { setStudents([]); return; }
    setLoading(true);
    setStudents([]);

    Promise.all([
      fetch(`/api/proxy/orders/by-course/${selectedCourseId}`).then(r => r.ok ? r.json() : []),
      fetch(`/api/proxy/exams/by-course/${selectedCourseId}`).then(r => r.ok ? r.json() : null),
    ])
      .then(async ([orders, exam]: [any[], any]) => {
        const enrolledMap = new Map<string, { userEmail: string; paidAt: string | null }>();
        for (const order of orders ?? []) {
          if (!enrolledMap.has(order.userId)) {
            enrolledMap.set(order.userId, { userEmail: order.userEmail, paidAt: order.paidAt ?? null });
          }
        }

        let attempts: any[] = [];
        if (exam?.id) {
          const attRes = await fetch(`/api/proxy/exams/${exam.id}/attempts`);
          if (attRes.ok) attempts = await attRes.json();
        }

        // Keep only the latest attempt per student
        const latestAttempt = new Map<string, any>();
        for (const a of attempts) {
          const prev = latestAttempt.get(a.studentId);
          if (!prev || new Date(a.submittedAt) > new Date(prev.submittedAt)) {
            latestAttempt.set(a.studentId, a);
          }
        }

        const rows: StudentRow[] = [...enrolledMap.entries()].map(([userId, { userEmail, paidAt }]) => {
          const attempt = latestAttempt.get(userId);
          return {
            userId,
            name: attempt?.studentName ?? userEmail,
            email: userEmail,
            score: attempt?.score ?? null,
            passed: attempt?.passed ?? null,
            hasAttempt: !!attempt,
            submittedAt: attempt?.submittedAt ?? null,
            paidAt,
          };
        });

        setStudents(rows);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [selectedCourseId]);

  const toggleSort = (field: "name" | "progress") => {
    if (sortField === field) setSortAsc(v => !v);
    else { setSortField(field); setSortAsc(true); }
  };

  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else cmp = getProgress(a) - getProgress(b);
      return sortAsc ? cmp : -cmp;
    });

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Auditoría del Alumnado</h1>
          <p className="text-muted">Rastrea el progreso y calificaciones de los trabajadores inscritos en tus cursos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-surface" disabled={filtered.length === 0}>
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="bg-surface/50 border-border overflow-hidden flex flex-col">

        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-secondary/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input
              placeholder="Buscar por nombre o email..."
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              disabled={!selectedCourseId}
            />
          </div>
          <div className="w-full sm:w-auto">
            {loadingCourses ? (
              <div className="flex items-center gap-2 text-muted text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando cursos...
              </div>
            ) : (
              <select
                className="flex h-10 w-full sm:w-72 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
              >
                <option value="">— Selecciona un curso —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted font-semibold uppercase bg-surface-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("name")}>
                    Alumno <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Curso</th>
                <th className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("progress")}>
                    Progreso <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-4 whitespace-nowrap">Nota Examen</th>
                <th className="px-6 py-4 whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Fecha Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando alumnos...
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !selectedCourseId && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    Selecciona un curso para ver los alumnos matriculados.
                  </td>
                </tr>
              )}
              {!loading && selectedCourseId && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    {searchTerm ? "No se encontraron alumnos con ese criterio." : "Ningún alumno ha pagado este curso aún."}
                  </td>
                </tr>
              )}
              {!loading && filtered.map(student => {
                const status = getStatus(student);
                const progress = getProgress(student);
                return (
                  <tr key={student.userId} className="hover:bg-surface-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{student.name}</div>
                      <div className="text-[10px] text-muted">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">{selectedCourse?.title ?? "--"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-40">
                        <span className="text-xs font-semibold w-8">{progress}%</span>
                        <div className="h-1.5 flex-1 bg-surface-secondary rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", progress === 100 ? "bg-success" : "bg-primary")}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.score !== null ? (
                        <span className={cn("font-bold", student.score >= 70 ? "text-success" : "text-danger flex items-center gap-1")}>
                          {student.score < 70 && <AlertCircle className="h-3 w-3" />}
                          {student.score}/100
                        </span>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "text-[10px] uppercase tracking-wider",
                        status === "completed" ? "border-success/30 text-success bg-success/5" :
                        status === "failed"    ? "border-danger/30 text-danger bg-danger/5" :
                        status === "not-started" ? "border-muted/30 text-muted" :
                        "border-primary/30 text-primary bg-primary/5"
                      )}>
                        {status === "completed" ? "Aprobado" :
                         status === "failed"    ? "Reprobado" :
                         status === "not-started" ? "Sin Iniciar" : "En Curso"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-muted">{formatDate(student.paidAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between bg-surface-secondary/20">
          <p className="text-xs text-muted">
            {selectedCourseId
              ? `Mostrando ${filtered.length} de ${students.length} alumnos matriculados`
              : "Selecciona un curso para comenzar"}
          </p>
        </div>

      </Card>
    </div>
  );
}
