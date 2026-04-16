"use client";

import { useState, use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, CheckCircle2, Circle, FileText, ChevronLeft, Download, Send, MessageSquare, Menu, X, Award } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// --- MOCK DATA ---
const COURSE_DATA = {
  id: "course-epp-101",
  title: "Uso Correcto de EPP Avanzado",
  instructor: "Ing. Roberto Martínez",
  description: "En este curso aprenderás sobre el equipamiento de protección personal requerido para ambientes con riesgo biológico y químico tipo B. Cubriremos la selección, colocación (donning), retiro (doffing) y mantenimiento del equipo.",
  modules: [
    {
      id: "m1",
      title: "Introducción al Riesgo Químico",
      lessons: [
        { id: "l1", title: "Tipos de contaminantes", duration: "12:00", completed: true, type: "video" },
        { id: "l2", title: "Matriz de compatibilidad", duration: "08:30", completed: true, type: "video" },
      ]
    },
    {
      id: "m2",
      title: "Trajes y Protección Respiratoria",
      lessons: [
        { id: "l3", title: "Normativa NIOSH / OSHA", duration: "15:45", completed: true, type: "video" },
        { id: "l4", title: "Prueba de ajuste a presión (Fit Test)", duration: "22:10", completed: false, type: "video", current: true },
        { id: "l5", title: "Secuencia de retiro seguro", duration: "18:00", completed: false, type: "video" },
      ]
    },
    {
      id: "m3",
      title: "Evaluación Final",
      lessons: [
        { id: "exam final", title: "Examen de Certificación EPP", duration: "20 min", completed: false, type: "exam" },
      ]
    }
  ]
};

const EXAM_QUESTIONS = [
  { q: "¿Cuál es el primer paso antes de ingresar a la zona caliente?", options: ["Revisar el SCBA", "Verificar comunicación", "Comprobar integridad del traje", "Todas las anteriores"], ans: 3 },
  { q: "El tiempo máximo recomendado con un Nivel A (sin línea de aire externa) es aproximadamente:", options: ["1 hora", "20-30 minutos", "4 horas", "Depende del clima externo"], ans: 1 },
];

export default function CoursePlayerPage({ params }: { params: Promise<{ cursoId: string }> }) {
  const { cursoId } = use(params);
  const [activeTab, setActiveTab] = useState("desc"); // 'desc' | 'forum'
  const [mode, setMode] = useState<"video" | "exam" | "exam-result">("video");
  const [examState, setExamState] = useState({ qIndex: 0, answers: [] as number[], score: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Funciones simuladas
  const handleStartExam = () => setMode("exam");
  
  const handleAnswer = (optIndex: number) => {
    const newAnswers = [...examState.answers, optIndex];
    if (examState.qIndex < EXAM_QUESTIONS.length - 1) {
      setExamState({ ...examState, answers: newAnswers, qIndex: examState.qIndex + 1 });
    } else {
      // Calcular puntaje final
      const score = newAnswers.reduce((acc, curr, idx) => curr === EXAM_QUESTIONS[idx].ans ? acc + 100/EXAM_QUESTIONS.length : acc, 0);
      setMode("exam-result");
      setExamState({ ...examState, answers: newAnswers, score });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 lg:-m-8">
      {/* Top Navigation Bar of the Player */}
      <div className="h-14 bg-surface border-b border-border flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/student/learning" className="flex items-center text-muted hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium hidden sm:inline">Volver</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <h2 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-md">{COURSE_DATA.title}</h2>
        </div>
        
        {/* Progreso rápido */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Tu Progreso</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">60%</span>
              <div className="w-24 h-1.5 bg-surface-secondary rounded-full">
                <div className="w-[60%] h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          {/* Mobile sidebar toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left/Center: Player or Exam Interface */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-background">
          
          {/* CONTENT RENDERER */}
          <div className="bg-black w-full aspect-video md:aspect-auto md:h-[60vh] flex items-center justify-center shrink-0 border-b border-border relative group">
            
            {mode === "video" && (
              <>
                <img 
                  src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=1200&q=80" 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="h-16 w-16 bg-primary/90 hover:bg-primary text-black rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xl shadow-primary/20">
                    <PlayCircle className="h-8 w-8 ml-1" />
                  </button>
                </div>
                {/* Fake player controls overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-4">
                  <div className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative">
                    <div className="w-[30%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
              </>
            )}

            {mode === "exam" && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                  <div className="mb-8">
                    <Badge variant="outline" className="text-warning border-warning/50 mb-4">Pregunta {examState.qIndex + 1} de {EXAM_QUESTIONS.length}</Badge>
                    <h3 className="text-2xl font-bold">{EXAM_QUESTIONS[examState.qIndex].q}</h3>
                  </div>
                  <div className="space-y-3">
                    {EXAM_QUESTIONS[examState.qIndex].options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full text-left p-4 rounded-xl border border-border bg-surface-secondary/50 hover:border-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                      >
                        <div className="h-5 w-5 rounded-full border border-muted flex items-center justify-center">
                          <span className="text-[10px] font-bold text-muted">{['A','B','C','D'][idx]}</span>
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "exam-result" && (
              <div className="absolute inset-0 bg-surface flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                </div>
                <h2 className="text-3xl font-bold mb-2">¡Examen Aprobado!</h2>
                <p className="text-muted mb-6">Has completado el curso con éxito obtenendo un {examState.score}%.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="gap-2 shadow-lg shadow-primary/20 h-12 px-8">
                    <Download className="h-5 w-5" /> Descargar Certificado
                  </Button>
                  <Button variant="outline" className="h-12" onClick={() => setMode("video")}>
                    Volver al curso
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* BELOW PLAYER TABS */}
          {mode === "video" && (
            <div className="flex-1 flex flex-col">
              <div className="flex border-b border-border px-6">
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'desc' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}
                >Descripción Explicativa</button>
                <button 
                   onClick={() => setActiveTab('forum')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'forum' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'}`}
                >Foro de Dudas</button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto">
                {activeTab === 'desc' && (
                  <div className="animate-in fade-in duration-300 max-w-3xl">
                    <h3 className="text-xl font-bold mb-4">Sobre esta lección</h3>
                    <p className="text-muted leading-relaxed mb-6">
                      {COURSE_DATA.description}
                    </p>
                    <div className="flex items-center gap-4 bg-surface-secondary/50 p-4 rounded-xl border border-border">
                      <Avatar src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" />
                      <div>
                        <p className="text-sm font-medium">Instructor</p>
                        <p className="text-base font-bold text-foreground">{COURSE_DATA.instructor}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'forum' && (
                  <div className="animate-in fade-in duration-300 max-w-3xl flex flex-col h-full min-h-[300px]">
                    <div className="flex-1 space-y-6 mb-6">
                      {/* Fake comment */}
                      <div className="flex gap-4">
                        <Avatar src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=faces" className="shrink-0" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">María Pérez</span>
                            <span className="text-xs text-muted">Hace 2 días</span>
                          </div>
                          <p className="text-sm text-foreground/90 bg-surface-secondary/40 p-3 rounded-lg rounded-tl-none border border-border/50">
                            ¿Cada cuánto tiempo es obligatorio realizar la prueba de ajuste según OSHA para los respiradores de cara completa?
                          </p>
                        </div>
                      </div>
                      {/* Reply */}
                      <div className="flex gap-4 ml-12">
                        <Avatar src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces" className="shrink-0 ring-2 ring-primary/50" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-primary">Ing. Roberto Martínez</span>
                            <Badge variant="outline" className="text-[9px] py-0 h-4 border-primary/20 text-primary">Instructor</Badge>
                          </div>
                          <p className="text-sm text-foreground/90 bg-primary/5 p-3 rounded-lg rounded-tl-none border border-primary/20">
                            Hola María. Según OSHA 1910.134, el fit test es obligatorio de forma anual, o cada vez que haya cambios físicos en el usuario que puedan afectar el sellado.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mt-auto flex gap-3 items-center">
                      <Avatar src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces" />
                      <div className="relative flex-1">
                        <Input placeholder="Haz una pregunta o deja un comentario..." className="pr-12 bg-surface-secondary border-border" />
                        <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Syllabus / Temario */}
        <div className={`
          absolute lg:relative right-0 top-0 bottom-0 z-20
          w-80 bg-surface border-l border-border flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 border-b border-border flex justify-between items-center bg-surface-secondary/30">
            <h3 className="font-bold">Contenido del Curso</h3>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {COURSE_DATA.modules.map((mod, mIdx) => (
              <div key={mod.id} className="border-b border-border">
                <div className="p-4 bg-surface-secondary/20 hover:bg-surface-secondary/40 cursor-pointer transition-colors sticky top-0 backdrop-blur-sm z-10 border-y border-transparent">
                  <h4 className="text-sm font-bold flex justify-between">
                    <span>Módulo {mIdx + 1}: {mod.title}</span>
                  </h4>
                </div>
                
                <div className="flex flex-col">
                  {mod.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className={`
                        p-3 pl-5 flex gap-3 transition-colors cursor-pointer group
                        ${lesson.current ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-surface-secondary'}
                      `}
                      onClick={() => lesson.type === 'exam' ? handleStartExam() : setMode('video')}
                    >
                      <div className="shrink-0 mt-0.5">
                        {lesson.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : lesson.type === 'exam' ? (
                          <FileText className={`h-4 w-4 ${lesson.current ? 'text-primary' : 'text-muted group-hover:text-foreground'}`} />
                        ) : (
                          <Circle className={`h-4 w-4 ${lesson.current ? 'text-primary' : 'text-muted group-hover:text-foreground'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${lesson.current ? 'font-semibold text-primary' : 'text-foreground/80 group-hover:text-foreground'}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                          {lesson.type === 'video' ? <PlayCircle className="h-3 w-3" /> : <Award className="h-3 w-3" />}
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
