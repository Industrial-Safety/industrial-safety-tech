"use client";

import { useState, use, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlayCircle, CheckCircle2, Circle, FileText, ChevronLeft,
  Menu, X, Award, Send, Loader2, ClipboardList, Trophy, XCircle, Download
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Lecture {
  id: string;
  title: string;
  duration: string;
  lectureType: string;
  contentUrl: string | null;
  isPreview: boolean;
}

interface Section {
  id: string;
  title: string;
  lectureList: Lecture[];
}

interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  coverImageUrl: string | null;
  teacher: { id: string; name: string; profession: string } | null;
  details: { level: string; totalDurationHorus: number; totalLecture: number } | null;
  sectionList: Section[];
}

interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string | null;
  authorAvatarUrl: string | null;
  content: string;
  createdAt: string;
  replies: {
    authorId: string;
    authorName: string;
    authorRole: string | null;
    authorAvatarUrl: string | null;
    content: string;
    createdAt: string;
  }[];
}

export default function CoursePlayerPage({ params }: { params: Promise<{ cursoId: string }> }) {
  const { cursoId } = use(params);
  const { data: session } = useSession();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"desc" | "forum">("desc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // Progreso (localStorage — clave por usuario para evitar contaminación entre sesiones)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const uid = (session as any)?.keycloakId ?? "guest";
  const progressKey = `completed_${uid}_${cursoId}`;

  // Examen
  const [hasExam, setHasExam] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [examOpen, setExamOpen] = useState(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examStep, setExamStep] = useState<"taking" | "result">("taking");
  const [examResult, setExamResult] = useState<any>(null);
  const [submittingExam, setSubmittingExam] = useState(false);

  // Foro
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [forumLoading, setForumLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!uid || uid === "guest") return;
    fetchCourse();
    loadProgress();
    fetch(`/api/proxy/exams/exists/${cursoId}`)
      .then(r => r.ok ? r.json() : { exists: false })
      .then(({ exists }) => setHasExam(exists))
      .catch(() => {});
  }, [cursoId, uid]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/proxy/course/${cursoId}`);
      if (!res.ok) return;
      const data: CourseData = await res.json();
      setCourse(data);
      // Auto-seleccionar primera lección no completada
      const saved = JSON.parse(localStorage.getItem(`completed_${cursoId}`) ?? "[]") as string[];
      const savedSet = new Set(saved);
      for (const sec of data.sectionList ?? []) {
        for (const lec of sec.lectureList ?? []) {
          if (lec.lectureType !== "EXAM" && !savedSet.has(lec.id)) {
            setActiveLecture(lec);
            return;
          }
        }
      }
      // Si todo completado, seleccionar la primera
      const first = data.sectionList?.[0]?.lectureList?.[0];
      if (first) setActiveLecture(first);
    } catch (e) {
      console.error("Error cargando curso:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const saved = JSON.parse(localStorage.getItem(progressKey) ?? "[]") as string[];
    setCompletedIds(new Set(saved));
  };

  const markLectureCompleted = (lectureId: string) => {
    const updated = new Set(completedIds);
    updated.add(lectureId);
    setCompletedIds(updated);
    localStorage.setItem(progressKey, JSON.stringify(Array.from(updated)));

    // Actualizar progreso global para el dashboard
    if (course) {
      const totalLectures = course.sectionList.flatMap(s => s.lectureList).filter(l => l.lectureType !== "EXAM").length;
      const pct = totalLectures > 0 ? Math.round((updated.size / totalLectures) * 100) : 0;
      localStorage.setItem(`progress_${uid}_${cursoId}`, String(pct));
    }
  };

  const totalLectures = course?.sectionList.flatMap(s => s.lectureList).filter(l => l.lectureType !== "EXAM").length ?? 0;
  const progressPct = totalLectures > 0 ? Math.round((completedIds.size / totalLectures) * 100) : 0;

  // ---- EXAMEN ----
  const openExam = async () => {
    let data = examData;
    if (!data) {
      const res = await fetch(`/api/proxy/exams/by-course/${cursoId}`);
      if (!res.ok) { toast.error("No se pudo cargar el examen"); return; }
      data = await res.json();
      setExamData(data);
    }
    setExamAnswers({});
    setExamStep("taking");
    setExamResult(null);
    setExamOpen(true);
  };

  const handleSubmitExam = async () => {
    if (!examData || !session) return;
    const unanswered = (examData.questions ?? []).filter((q: any) => !examAnswers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Faltan ${unanswered.length} pregunta(s) por responder`);
      return;
    }
    setSubmittingExam(true);
    try {
      const res = await fetch(`/api/proxy/exams/${examData.id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: (session as any).keycloakId,
          studentName: session.user?.name ?? "",
          studentEmail: session.user?.email ?? "",
          answers: examAnswers,
        }),
      });
      if (!res.ok) { toast.error("Error al enviar el examen"); return; }
      const result = await res.json();
      setExamResult(result);
      setExamStep("result");
    } catch {
      toast.error("Error al enviar el examen");
    } finally {
      setSubmittingExam(false);
    }
  };

  // ---- FORO ----
  const loadForum = async () => {
    setForumLoading(true);
    try {
      const res = await fetch(`/api/proxy/chat/forum/${cursoId}`);
      if (res.ok) setForumPosts(await res.json());
    } catch (e) {
      console.error("Error cargando foro:", e);
    } finally {
      setForumLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "forum") loadForum();
  }, [activeTab, cursoId]);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;
    setSubmitting(true);
    try {
      const body = {
        authorId: session.dbId ?? session.user?.email ?? "unknown",
        authorName: session.user?.name ?? "Estudiante",
        authorRole: "ALUMNO",
        authorAvatarUrl: session.user?.image ?? null,
        content: newComment.trim(),
      };

      const url = replyTo
        ? `/api/proxy/chat/forum/${cursoId}/${replyTo}/reply`
        : `/api/proxy/chat/forum/${cursoId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setNewComment("");
        setReplyTo(null);
        loadForum();
      }
    } catch (e) {
      console.error("Error enviando mensaje:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60_000) return "Ahora";
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted">
        <p>No se pudo cargar el curso.</p>
        <Link href="/student/learning"><Button variant="outline" className="mt-4">Volver</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">

      {/* Barra superior del player */}
      <div className="h-14 bg-surface border-b border-border flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/student/learning" className="flex items-center text-muted hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium hidden sm:inline">Volver</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <h2 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md">{course.title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Tu Progreso</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">{progressPct}%</span>
              <div className="w-24 h-1.5 bg-surface-secondary rounded-full">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Player / Contenido */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-background">

          {/* Video o imagen */}
          <div className="bg-black w-full aspect-video md:aspect-auto md:h-[60vh] flex items-center justify-center shrink-0 border-b border-border relative group">
            {activeLecture?.contentUrl ? (
              <video
                key={activeLecture.id}
                src={activeLecture.contentUrl}
                controls
                className="w-full h-full object-contain"
                onEnded={() => markLectureCompleted(activeLecture.id)}
              />
            ) : course.coverImageUrl ? (
              <>
                <img
                  src={course.coverImageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="h-16 w-16 bg-primary/90 hover:bg-primary text-black rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xl shadow-primary/20"
                    onClick={() => activeLecture && markLectureCompleted(activeLecture.id)}
                  >
                    <PlayCircle className="h-8 w-8 ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <PlayCircle className="h-16 w-16" />
                <p className="text-sm">Selecciona una lección del menú lateral</p>
              </div>
            )}
          </div>

          {/* Tabs descripción / foro */}
          <div className="flex-1 flex flex-col">
            <div className="flex border-b border-border px-6">
              {(["desc", "forum"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === t
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {t === "desc" ? "Descripción" : "Foro de Dudas"}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 overflow-y-auto">

              {/* Descripción */}
              {activeTab === "desc" && (
                <div className="animate-in fade-in duration-300 max-w-3xl">
                  <h3 className="text-xl font-bold mb-3">{activeLecture?.title ?? course.title}</h3>
                  {course.subtitle && (
                    <p className="text-muted leading-relaxed mb-6">{course.subtitle}</p>
                  )}
                  {course.details && (
                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted">
                      {course.details.level && <span>Nivel: <strong className="text-foreground">{course.details.level}</strong></span>}
                      {course.details.totalDurationHorus > 0 && (
                        <span>Duración: <strong className="text-foreground">{course.details.totalDurationHorus}h</strong></span>
                      )}
                      {course.details.totalLecture > 0 && (
                        <span>Lecciones: <strong className="text-foreground">{course.details.totalLecture}</strong></span>
                      )}
                    </div>
                  )}
                  {course.teacher && (
                    <div className="flex items-center gap-4 bg-surface-secondary/50 p-4 rounded-xl border border-border">
                      <Avatar src={undefined} fallback={course.teacher.name[0]} />
                      <div>
                        <p className="text-sm text-muted">Instructor</p>
                        <p className="text-base font-bold text-foreground">{course.teacher.name}</p>
                        {course.teacher.profession && (
                          <p className="text-xs text-muted">{course.teacher.profession}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {activeLecture && !completedIds.has(activeLecture.id) && activeLecture.lectureType !== "EXAM" && (
                    <Button
                      className="mt-6 gap-2"
                      onClick={() => markLectureCompleted(activeLecture.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Marcar como completada
                    </Button>
                  )}

                  {/* Banner Examen Final */}
                  {hasExam && (
                    <div className={`mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                      progressPct === 100
                        ? "bg-warning/10 border-warning/40"
                        : "bg-surface-secondary/30 border-border/40"
                    }`}>
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                        progressPct === 100 ? "bg-warning/20" : "bg-surface-secondary"
                      }`}>
                        <ClipboardList className={`h-6 w-6 ${progressPct === 100 ? "text-warning" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">Examen Final del Curso</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {progressPct === 100
                            ? "¡Completaste todas las lecciones! Ya puedes rendir el examen final."
                            : `Completa todas las lecciones para desbloquear el examen final (${progressPct}% completado).`}
                        </p>
                      </div>
                      <Button
                        onClick={openExam}
                        disabled={progressPct < 100}
                        className={`shrink-0 gap-2 font-bold ${
                          progressPct === 100
                            ? "bg-warning hover:bg-warning/90 text-warning-foreground"
                            : ""
                        }`}
                      >
                        <Award className="h-4 w-4" />
                        {progressPct === 100 ? "Rendir Examen" : "Bloqueado"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Foro */}
              {activeTab === "forum" && (
                <div className="animate-in fade-in duration-300 max-w-3xl">
                  {forumLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted" />
                    </div>
                  ) : (
                    <div className="space-y-6 mb-6">
                      {forumPosts.length === 0 && (
                        <p className="text-muted text-sm py-4">Sé el primero en hacer una pregunta.</p>
                      )}
                      {forumPosts.map(post => (
                        <div key={post.id}>
                          <div className="flex gap-4">
                            <Avatar
                              src={post.authorAvatarUrl ?? undefined}
                              fallback={post.authorName[0]}
                              className="shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{post.authorName}</span>
                                {post.authorRole === "INSTRUCTOR" && (
                                  <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary">Instructor</Badge>
                                )}
                                <span className="text-xs text-muted">{formatDate(post.createdAt)}</span>
                              </div>
                              <p className="text-sm text-foreground/90 bg-surface-secondary/40 p-3 rounded-lg rounded-tl-none border border-border/50">
                                {post.content}
                              </p>
                              <button
                                onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                                className="text-xs text-muted hover:text-primary mt-1 transition-colors"
                              >
                                {replyTo === post.id ? "Cancelar" : "Responder"}
                              </button>
                            </div>
                          </div>

                          {/* Respuestas */}
                          {post.replies.map((r, ri) => (
                            <div key={ri} className="flex gap-4 ml-12 mt-3">
                              <Avatar
                                src={r.authorAvatarUrl ?? undefined}
                                fallback={r.authorName[0]}
                                className={`shrink-0 ${r.authorRole === "INSTRUCTOR" ? "ring-2 ring-primary/50" : ""}`}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-semibold text-sm ${r.authorRole === "INSTRUCTOR" ? "text-primary" : ""}`}>
                                    {r.authorName}
                                  </span>
                                  {r.authorRole === "INSTRUCTOR" && (
                                    <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary">Instructor</Badge>
                                  )}
                                  <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                                </div>
                                <p className={`text-sm text-foreground/90 p-3 rounded-lg rounded-tl-none border ${
                                  r.authorRole === "INSTRUCTOR"
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-surface-secondary/40 border-border/50"
                                }`}>
                                  {r.content}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* Reply input inline */}
                          {replyTo === post.id && (
                            <form onSubmit={handleSubmitPost} className="mt-3 ml-12 flex gap-3 items-center">
                              <Avatar src={session?.user?.image ?? undefined} fallback={(session?.user?.name ?? "U")[0]} />
                              <div className="relative flex-1">
                                <Input
                                  placeholder="Escribe una respuesta..."
                                  value={newComment}
                                  onChange={e => setNewComment(e.target.value)}
                                  className="pr-12 bg-surface-secondary border-border"
                                />
                                <Button
                                  size="icon" type="submit" variant="ghost"
                                  disabled={!newComment.trim() || submitting}
                                  className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nueva pregunta */}
                  {!replyTo && (
                    <form onSubmit={handleSubmitPost} className="flex gap-3 items-center">
                      <Avatar src={session?.user?.image ?? undefined} fallback={(session?.user?.name ?? "U")[0]} />
                      <div className="relative flex-1">
                        <Input
                          placeholder="Haz una pregunta o deja un comentario..."
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          className="pr-12 bg-surface-secondary border-border"
                        />
                        <Button
                          size="icon" type="submit" variant="ghost"
                          disabled={!newComment.trim() || submitting}
                          className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar: Temario */}
        <div className={`
          absolute lg:relative right-0 top-0 bottom-0 z-20
          w-80 bg-surface border-l border-border flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-secondary/30">
            <h3 className="font-bold">Contenido del Curso</h3>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.sectionList.map((sec, sIdx) => (
              <div key={sec.id} className="border-b border-border">
                <div className="p-4 bg-surface-secondary/20 sticky top-0 backdrop-blur-sm z-10">
                  <h4 className="text-sm font-bold">Módulo {sIdx + 1}: {sec.title}</h4>
                </div>
                <div className="flex flex-col">
                  {sec.lectureList.map(lec => {
                    const done = completedIds.has(lec.id);
                    const active = activeLecture?.id === lec.id;
                    const isExam = lec.lectureType === "EXAM";
                    return (
                      <button
                        key={lec.id}
                        onClick={() => { setActiveLecture(lec); setSidebarOpen(false); }}
                        className={`p-3 pl-5 flex gap-3 transition-colors text-left group ${
                          active ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : isExam ? (
                            <FileText className={`h-4 w-4 ${active ? "text-primary" : "text-muted group-hover:text-foreground"}`} />
                          ) : (
                            <Circle className={`h-4 w-4 ${active ? "text-primary" : "text-muted group-hover:text-foreground"}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${active ? "font-semibold text-primary" : "text-foreground/80 group-hover:text-foreground"}`}>
                            {lec.title}
                          </p>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                            {isExam ? <Award className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                            {lec.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Entrada Examen Final en sidebar */}
          {hasExam && (
            <div className="p-3 border-t border-border">
              <button
                onClick={progressPct === 100 ? openExam : undefined}
                disabled={progressPct < 100}
                className={`w-full p-3 pl-4 flex gap-3 rounded-xl text-left transition-colors ${
                  progressPct === 100
                    ? "bg-warning/10 hover:bg-warning/20 border border-warning/30"
                    : "bg-surface-secondary/20 border border-border/30 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <ClipboardList className={`h-4 w-4 ${progressPct === 100 ? "text-warning" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${progressPct === 100 ? "text-warning" : "text-muted-foreground"}`}>
                    Examen Final
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {progressPct === 100 ? "¡Disponible! Click para rendir" : `Completa el curso (${progressPct}%)`}
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Examen */}
      <Dialog open={examOpen} onOpenChange={setExamOpen}>
        <DialogContent className="bg-[#0F172A] border-border/40 text-foreground max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 border-b border-border/20 shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <ClipboardList className="h-5 w-5 text-warning" />
              Examen Final — {course.title}
            </DialogTitle>
          </DialogHeader>

          {examStep === "taking" && examData && (
            <>
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {/* Contador de respuestas */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Object.keys(examAnswers).length} de {examData.questions?.length ?? 0} respondidas</span>
                  <span>Score mínimo para aprobar: <span className="text-warning font-bold">{examData.passingScore}%</span></span>
                </div>

                {(examData.questions ?? []).map((q: any, idx: number) => (
                  <div key={q.id} className={`rounded-xl border p-5 transition-colors ${
                    examAnswers[q.id] ? "border-warning/30 bg-warning/5" : "border-border/40 bg-surface-secondary/10"
                  }`}>
                    <p className="text-sm font-bold mb-4">
                      <span className="text-warning mr-2">{idx + 1}.</span>{q.text}
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: "A", value: q.optionA },
                        { label: "B", value: q.optionB },
                        { label: "C", value: q.optionC },
                        { label: "D", value: q.optionD },
                      ].map(opt => (
                        <label
                          key={opt.label}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                            examAnswers[q.id] === opt.label
                              ? "bg-warning/15 border-warning/50"
                              : "bg-surface-secondary/20 border-transparent hover:border-border/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt.label}
                            checked={examAnswers[q.id] === opt.label}
                            onChange={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt.label }))}
                            className="accent-warning"
                          />
                          <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{opt.label}.</span>
                          <span className="text-sm">{opt.value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border/20 shrink-0 flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  {Object.keys(examAnswers).length < (examData.questions?.length ?? 0)
                    ? `Responde todas las preguntas para enviar`
                    : "¡Todas las preguntas respondidas!"}
                </p>
                <Button
                  onClick={handleSubmitExam}
                  disabled={Object.keys(examAnswers).length < (examData.questions?.length ?? 0) || submittingExam}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold gap-2 px-8"
                >
                  {submittingExam ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {submittingExam ? "Enviando..." : "Enviar Examen"}
                </Button>
              </div>
            </>
          )}

          {examStep === "result" && examResult && (
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                examResult.passed ? "bg-green-500/20" : "bg-destructive/20"
              }`}>
                {examResult.passed
                  ? <Trophy className="h-12 w-12 text-green-500" />
                  : <XCircle className="h-12 w-12 text-destructive" />}
              </div>

              <div>
                <p className="text-4xl font-black mb-1">{examResult.score}%</p>
                <p className={`text-lg font-bold ${examResult.passed ? "text-green-500" : "text-destructive"}`}>
                  {examResult.passed ? "¡Aprobado!" : "No aprobado"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {examResult.passed
                    ? "Felicidades, obtuviste tu certificado de finalización."
                    : `Necesitabas ${examData?.passingScore ?? 70}% para aprobar. ¡Inténtalo de nuevo!`}
                </p>
              </div>

              {examResult.passed && examResult.certificateUrl && (
                <a href={examResult.certificateUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2 px-8">
                    <Download className="h-4 w-4" /> Descargar Certificado
                  </Button>
                </a>
              )}

              {!examResult.passed && (
                <Button
                  variant="outline"
                  className="border-border/40 gap-2"
                  onClick={() => {
                    setExamAnswers({});
                    setExamStep("taking");
                    setExamResult(null);
                  }}
                >
                  <ClipboardList className="h-4 w-4" /> Reintentar Examen
                </Button>
              )}

              <Button variant="ghost" className="text-muted-foreground text-xs" onClick={() => setExamOpen(false)}>
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
