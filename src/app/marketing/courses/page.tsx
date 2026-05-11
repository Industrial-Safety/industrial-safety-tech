"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import {
  BookOpen, Percent, Tag, Clock, Users, Star, Plus, Settings,
  Copy, CheckCircle, X, Loader2, Trash2, ToggleLeft, ToggleRight
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  price: number | null;
  details?: { totalLecture: number };
  teacher?: { name: string } | null;
  coverImageUrl: string | null;
}

interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  maxUses: number | null;
  currentUses: number;
  courseId: string | null;
  expiryDate: string | null;
  status: "ACTIVE" | "EXHAUSTED" | "EXPIRED" | "DISABLED";
  createdByName: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Activa", className: "bg-success/10 text-success border-success/30" },
  EXHAUSTED: { label: "Agotada", className: "bg-danger/10 text-danger border-danger/30" },
  EXPIRED: { label: "Expirada", className: "bg-muted/20 text-muted border-border" },
  DISABLED: { label: "Desactivada", className: "bg-warning/10 text-warning border-warning/30" },
};

export default function MarketingCoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [created, setCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: 20,
    code: "",
    maxUses: 100,
    expiryDate: "",
    applyToAll: true,
  });

  useEffect(() => { loadCourses(); loadCoupons(); }, []);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch("/api/proxy/course");
      if (res.ok) setCourses(await res.json());
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await fetch("/api/proxy/orders/coupons");
      if (res.ok) setCoupons(await res.json());
    } finally {
      setLoadingCoupons(false);
    }
  };

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
    setCreated(false);
    setForm({ type: "PERCENTAGE", value: 20, code: "", maxUses: 100, expiryDate: "", applyToAll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/proxy/orders/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountType: form.type,
          value: form.value,
          maxUses: form.maxUses,
          courseId: form.applyToAll ? null : selectedCourse?.id ?? null,
          expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
          createdByUserId: (session as any)?.dbId ?? null,
          createdByName: session?.user?.name ?? null,
        }),
      });
      if (res.ok) {
        setCreated(true);
        loadCoupons();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleToggle = async (id: number) => {
    const res = await fetch(`/api/proxy/orders/coupons/${id}/toggle`, { method: "PATCH" });
    if (res.ok) {
      const updated: Coupon = await res.json();
      setCoupons(prev => prev.map(c => c.id === id ? updated : c));
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/proxy/orders/coupons/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const couponForCourse = (courseId: string) =>
    coupons.find(c => (c.courseId === courseId || c.courseId === null) && c.status === "ACTIVE");

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Gestión de Cursos y Cupones</h1>
          <p className="text-muted">Crea descuentos para los cursos disponibles en el catálogo.</p>
        </div>
      </div>

      {/* Courses Grid */}
      <section>
        <h2 className="text-lg font-bold mb-4">Cursos del Catálogo</h2>
        {loadingCourses ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted" /></div>
        ) : courses.length === 0 ? (
          <p className="text-muted text-sm">No hay cursos disponibles.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {courses.map(course => {
              const activeCoupon = couponForCourse(course.id);
              const price = course.price ?? 0;
              return (
                <Card key={course.id} className="bg-surface/60 border-border overflow-hidden hover:border-pink-500/50 transition-colors group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-2/5 relative h-36 sm:h-auto overflow-hidden">
                        {course.coverImageUrl ? (
                          <img
                            src={course.coverImageUrl}
                            alt={course.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full bg-surface-secondary flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-muted" />
                          </div>
                        )}
                        {activeCoupon && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-pink-500 text-white text-xs">
                              {activeCoupon.discountType === "PERCENTAGE"
                                ? `${activeCoupon.value}% OFF`
                                : `S/${activeCoupon.value} OFF`}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="sm:w-3/5 p-5">
                        <h3 className="font-bold text-base mb-1 line-clamp-2">{course.title}</h3>
                        {course.teacher && (
                          <p className="text-xs text-muted mb-3">{course.teacher.name}</p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          {price > 0 ? (
                            <p className="text-xl font-bold text-pink-500">S/ {price.toFixed(2)}</p>
                          ) : (
                            <Badge variant="outline" className="text-success border-success/30">Gratis</Badge>
                          )}
                        </div>

                        {activeCoupon ? (
                          <div className="space-y-2">
                            <div className="p-2.5 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-semibold text-pink-500">Cupón activo</p>
                                <p className="text-sm font-mono font-bold">{activeCoupon.code}</p>
                              </div>
                              <Button variant="outline" size="sm" className="h-7" onClick={() => handleCopy(activeCoupon.code)}>
                                {copied === activeCoupon.code ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                              </Button>
                            </div>
                            <p className="text-xs text-muted">
                              {activeCoupon.currentUses}/{activeCoupon.maxUses ?? "∞"} usos
                              {activeCoupon.expiryDate && ` · Vence ${new Date(activeCoupon.expiryDate).toLocaleDateString("es-ES")}`}
                            </p>
                          </div>
                        ) : (
                          price > 0 && (
                            <Button
                              className="w-full bg-pink-500 hover:bg-pink-600 text-white h-9 text-sm"
                              onClick={() => openModal(course)}
                            >
                              <Plus className="h-4 w-4 mr-1.5" />
                              Crear Cupón
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* All coupons table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Todos los Cupones</h2>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white h-8 text-xs"
            onClick={() => { setSelectedCourse(null); setModalOpen(true); setCreated(false); setForm({ type: "PERCENTAGE", value: 20, code: "", maxUses: 100, expiryDate: "", applyToAll: true }); }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Cupón General
          </Button>
        </div>

        {loadingCoupons ? (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted" /></div>
        ) : coupons.length === 0 ? (
          <p className="text-muted text-sm">Aún no hay cupones creados.</p>
        ) : (
          <div className="space-y-2">
            {coupons.map(c => {
              const s = STATUS_LABELS[c.status] ?? STATUS_LABELS.DISABLED;
              return (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-secondary/30 hover:bg-surface-secondary/50 transition-colors gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
                      <Tag className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm">{c.code}</span>
                        <Badge variant="outline" className={`text-[9px] py-0 h-4 ${s.className}`}>{s.label}</Badge>
                        {c.courseId === null && <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary">Todos los cursos</Badge>}
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        {c.discountType === "PERCENTAGE" ? `${c.value}%` : `S/ ${c.value}`} de descuento
                        {" · "}{c.currentUses}/{c.maxUses ?? "∞"} usos
                        {c.expiryDate && ` · Vence ${new Date(c.expiryDate).toLocaleDateString("es-ES")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-foreground" onClick={() => handleCopy(c.code)}>
                      {copied === c.code ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    {c.status !== "EXHAUSTED" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-foreground" onClick={() => handleToggle(c.id)}>
                        {c.status === "ACTIVE" ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-destructive" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create coupon modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Crear Cupón</h3>
                  <p className="text-xs text-muted">{selectedCourse ? selectedCourse.title : "Aplica a todos los cursos"}</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-surface-secondary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {created ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">¡Cupón creado!</h4>
                  <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20 mb-6">
                    <p className="text-xs text-pink-300 mb-2">Código de Promoción</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-2xl font-mono font-bold text-pink-500">{form.code.toUpperCase()}</p>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(form.code.toUpperCase())}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => setModalOpen(false)} className="bg-pink-500 hover:bg-pink-600 text-white">Listo</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {(["PERCENTAGE", "FIXED"] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={`p-4 rounded-lg border-2 transition-all ${form.type === t ? "border-pink-500 bg-pink-500/10" : "border-border bg-surface-secondary/30 hover:border-pink-500/50"}`}
                      >
                        {t === "PERCENTAGE" ? <Percent className="h-6 w-6 mx-auto mb-1 text-pink-500" /> : <Tag className="h-6 w-6 mx-auto mb-1 text-pink-500" />}
                        <p className="text-sm font-semibold">{t === "PERCENTAGE" ? "Porcentaje" : "Monto Fijo"}</p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Valor {form.type === "PERCENTAGE" ? "(%)" : "(S/)"}</label>
                    <Input
                      type="number" value={form.value}
                      onChange={e => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                      min={1} max={form.type === "PERCENTAGE" ? 90 : 9999}
                      className="bg-surface-secondary/50 border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Código de cupón</label>
                    <Input
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="Ej: EPP20"
                      className="bg-surface-secondary/50 border-border font-mono uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Usos máximos</label>
                      <Input
                        type="number" value={form.maxUses}
                        onChange={e => setForm({ ...form, maxUses: parseInt(e.target.value) || 1 })}
                        min={1} className="bg-surface-secondary/50 border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Vencimiento</label>
                      <Input
                        type="date" value={form.expiryDate}
                        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                        className="bg-surface-secondary/50 border-border"
                      />
                    </div>
                  </div>

                  {selectedCourse && (
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox" checked={form.applyToAll}
                        onChange={e => setForm({ ...form, applyToAll: e.target.checked })}
                        className="rounded"
                      />
                      Aplicar a todos los cursos (no solo a este)
                    </label>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={!form.code.trim() || submitting} className="bg-pink-500 hover:bg-pink-600 text-white">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Crear Cupón
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
