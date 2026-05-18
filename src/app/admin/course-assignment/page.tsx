"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap, Users, Search, CheckCircle2, Loader2, Send,
  AlertTriangle, ImageIcon, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllCourses, getWorkerTargets, assignCourses,
  AdminCourse, WorkerLite,
} from "@/services/courseAssignmentService";

export default function CourseAssignmentPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [workers, setWorkers] = useState<WorkerLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getAllCourses(), getWorkerTargets()])
      .then(([c, w]) => { setCourses(c); setWorkers(w); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );
  }, [courses, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedCourses = courses.filter((c) => selected.has(c.id));

  const handleAssign = async () => {
    setSubmitting(true);
    try {
      const result = await assignCourses(
        selectedCourses.map((c) => ({ idCurso: c.id, courseName: c.title })),
        workers.map((w) => ({ userId: w.keycloakId, userEmail: w.email }))
      );
      toast.success(
        `Asignación completada: ${result.ordersCreated} trabajador(es) actualizados, ` +
        `${result.workersSkipped} ya tenían los cursos.`
      );
      setSelected(new Set());
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message ? `Error: ${e.message}` : "No se pudo asignar los cursos");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" /> Asignación de Cursos
        </h1>
        <p className="text-muted">
          Selecciona los cursos de capacitación obligatoria y asígnalos a <strong>todos los trabajadores</strong>.
          Esto se suele hacer cada 6 meses. Los cursos que un trabajador ya tenga no se duplican.
        </p>
      </div>

      {/* Barra de acción */}
      <Card className="bg-surface/50 border-border sticky top-0 z-20 backdrop-blur-md">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{selected.size}</strong>
              <span className="text-muted">curso(s) seleccionado(s)</span>
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{workers.length}</strong>
              <span className="text-muted">trabajador(es) destino</span>
            </span>
          </div>
          <Button
            disabled={selected.size === 0 || workers.length === 0}
            onClick={() => setConfirmOpen(true)}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Asignar a todos los trabajadores
          </Button>
        </CardContent>
      </Card>

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Buscar curso..."
          className="pl-9 bg-surface/50 border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {workers.length === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          No hay trabajadores con rol TRABAJADOR y keycloakId válido. No se puede asignar todavía.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No hay cursos que coincidan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const isSel = selected.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`text-left rounded-xl border overflow-hidden transition-all group ${
                  isSel
                    ? "border-primary ring-2 ring-primary/40 bg-primary/5"
                    : "border-border bg-surface/40 hover:border-primary/40"
                }`}
              >
                <div className="aspect-[16/9] relative bg-slate-900 border-b border-border overflow-hidden">
                  {c.coverImageUrl ? (
                    <img src={c.coverImageUrl} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-slate-600" />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
                    isSel ? "bg-primary text-primary-foreground" : "bg-black/50 text-transparent"
                  }`}>
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 leading-tight mb-1">{c.title}</h3>
                  <p className="text-xs text-muted line-clamp-1 mb-2">{c.subtitle}</p>
                  <div className="flex items-center gap-2">
                    {c.level && <Badge variant="secondary" className="text-[10px]">{c.level}</Badge>}
                    {c.precio !== null && (
                      <span className="text-[10px] text-muted">
                        {c.precio === 0 ? "Gratuito" : `S/ ${c.precio}`}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación (anti error humano) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Confirmar asignación</h3>
                  <p className="text-xs text-muted">Revisa antes de enviar — esta acción notifica a todos.</p>
                </div>
              </div>
              <button onClick={() => setConfirmOpen(false)} disabled={submitting}
                className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm">
                Vas a asignar <strong className="text-primary">{selectedCourses.length} curso(s)</strong> a{" "}
                <strong className="text-primary">{workers.length} trabajador(es)</strong>:
              </p>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border/60">
                {selectedCourses.map((c) => (
                  <div key={c.id} className="p-3 text-sm flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-muted">
                Se crea el acceso sin costo. Los cursos que un trabajador ya tenga se omiten automáticamente (no se duplican).
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-3">
              <Button variant="ghost" disabled={submitting} onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button className="gap-2" disabled={submitting} onClick={handleAssign}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Confirmar y asignar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
