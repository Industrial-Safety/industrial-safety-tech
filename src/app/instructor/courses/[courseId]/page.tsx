"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, GripVertical, Plus, Settings, Video, FileText, 
  Trash2, UploadCloud, Save, Award, AlignLeft, ShieldCheck, Edit3, X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_MODULES = [
  {
    id: "mod-1",
    title: "Introducción al Riesgo Químico",
    lessons: [
      { id: "l-1", title: "Tipos de contaminantes", type: "video", duration: "12:00" },
      { id: "l-2", title: "Matriz de compatibilidad B2", type: "video", duration: "08:30" }
    ]
  },
  {
    id: "mod-2",
    title: "Manejo de Trajes Nivel A",
    lessons: [
      { id: "l-3", title: "Normativa Internacional", type: "video", duration: "15:45" },
      { id: "l-4", title: "Tabla de referencias NIOSH", type: "pdf", duration: "Lectura" }
    ]
  }
];

export default function CourseBuilderPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [activeTab, setActiveTab] = useState<"structure" | "resources" | "evaluation">("structure");
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 md:pb-0">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses" className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-surface-secondary hover:bg-primary/20 hover:text-primary transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-2xl font-bold tracking-tight">Constructor del Curso</h1>
               <Badge className="bg-warning/20 text-warning hover:bg-warning/30 border-warning/30">Borrador</Badge>
            </div>
            <p className="text-sm text-muted">ID: {courseId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => setShowSettingsModal(true)}>
            <Settings className="h-4 w-4" /> Configuración General
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" /> Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-border overflow-x-auto scrollbar-hide whitespace-nowrap">
        <button 
          onClick={() => setActiveTab('structure')}
          className={cn("text-sm font-medium pb-3 px-2 border-b-2 transition-colors", activeTab === 'structure' ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}
        >
          <AlignLeft className="inline h-4 w-4 mr-2 mb-0.5" />
          Temario y Lecciones
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={cn("text-sm font-medium pb-3 px-2 border-b-2 transition-colors", activeTab === 'resources' ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}
        >
          <UploadCloud className="inline h-4 w-4 mr-2 mb-0.5" />
          Repositorio AWS (Pro)
        </button>
        <button 
          onClick={() => setActiveTab('evaluation')}
          className={cn("text-sm font-medium pb-3 px-2 border-b-2 transition-colors", activeTab === 'evaluation' ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground")}
        >
          <ShieldCheck className="inline h-4 w-4 mr-2 mb-0.5" />
          Sistema de Evaluación
        </button>
      </div>

      {/* TABS CONTENT */}
      <div className="pt-2">
        
        {/* TAB 1: STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Gestor de Módulos (Drag & Drop)</h3>
                <Button variant="secondary" size="sm" className="gap-2" onClick={() => setShowModuleModal(true)}>
                  <Plus className="h-4 w-4"/> Añadir Módulo
                </Button>
              </div>

              {MOCK_MODULES.map((mod, mIdx) => (
                <Card key={mod.id} className="bg-surface/50 border-border overflow-hidden group">
                  <div className="bg-surface-secondary/40 p-3 border-b border-border flex items-center justify-between group-hover:bg-surface-secondary/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab hover:bg-background p-1.5 rounded text-muted hover:text-foreground active:cursor-grabbing transition-colors">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-base">Módulo {mIdx + 1}: {mod.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-foreground"><Settings className="h-4 w-4"/></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-danger/70 hover:text-danger hover:bg-danger/10"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between bg-background border border-border p-3 rounded-lg hover:border-primary/40 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="cursor-grab text-muted hover:text-foreground active:cursor-grabbing">
                              <GripVertical className="h-4 w-4" />
                           </div>
                           <div className="h-8 w-8 rounded-full bg-surface-secondary flex items-center justify-center text-muted shrink-0">
                             {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                           </div>
                           <div>
                             <p className="text-sm font-semibold">{lesson.title}</p>
                             <p className="text-[10px] text-muted font-medium mt-0.5">{lesson.duration}</p>
                           </div>
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-foreground"><Edit3 className="h-4 w-4"/></Button>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={() => setShowLessonModal(true)} className="w-full border-dashed bg-transparent hover:bg-surface-secondary/40 gap-2 border-border mt-2 h-10">
                      <Plus className="h-4 w-4" /> Agregar Lección
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar Inspector */}
            <div className="space-y-6">
              <Card className="bg-surface/50 border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-bold text-muted uppercase tracking-wider">Metadatos del Módulo Seleccionado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-semibold">Título</label>
                     <Input defaultValue="Introducción al Riesgo Químico" className="bg-surface-secondary border-border" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-semibold">Restricciones de Prerrequisito</label>
                     <select className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground">
                        <option>Debe aprobar el módulo anterior</option>
                        <option>Sin restricciones (Libre)</option>
                     </select>
                   </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        )}

        {/* TAB 2: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-1">AWS S3 Storage Habilitado</h3>
                <p className="text-sm text-muted">Aprovecha la infraestructura en la nube para adjuntar manuales pesados, PDFs y plantillas que tus alumnos podrán descargar directamente.</p>
              </div>
              <Button className="md:ml-auto whitespace-nowrap shadow-md gap-2" variant="secondary"><Plus className="h-4 w-4" /> Subir Archivo</Button>
            </div>

            <Card className="bg-surface/50 border-border">
               <CardHeader>
                 <CardTitle className="text-base font-bold">Archivos Actualmente Vinculados</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-col gap-2">
                   {/* Mock Files */}
                   <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                     <div className="flex items-center gap-3">
                       <FileText className="h-5 w-5 text-indigo-400" />
                       <div>
                         <p className="text-sm font-semibold">manual_epp_2026.pdf</p>
                         <p className="text-xs text-muted">2.4 MB • Vinculado al Módulo 1</p>
                       </div>
                     </div>
                     <Button variant="ghost" size="icon" className="text-danger hover:text-danger hover:bg-danger/10"><Trash2 className="h-4 w-4"/></Button>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                     <div className="flex items-center gap-3">
                       <FileText className="h-5 w-5 text-emerald-400" />
                       <div>
                         <p className="text-sm font-semibold">normativa_iso_45001.pdf</p>
                         <p className="text-xs text-muted">5.1 MB • Vinculado al Módulo 2</p>
                       </div>
                     </div>
                     <Button variant="ghost" size="icon" className="text-danger hover:text-danger hover:bg-danger/10"><Trash2 className="h-4 w-4"/></Button>
                   </div>
                 </div>
               </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: EVALUATION */}
        {activeTab === 'evaluation' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              
              <Card className="bg-surface/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                  <div>
                    <CardTitle className="text-lg font-bold">Banco de Preguntas</CardTitle>
                    <p className="text-sm text-muted mt-1">Configura las opciones para el examen final del curso.</p>
                  </div>
                  <Button size="sm" onClick={() => setShowQuestionModal(true)}>
                    <Plus className="h-4 w-4 mr-2"/> Añadir Pregunta
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                   <div className="p-4 border border-border rounded-xl bg-background space-y-4">
                     <div className="flex justify-between items-start gap-4">
                       <div className="space-y-1 w-full">
                         <Badge variant="outline" className="mb-2">Opción Múltiple</Badge>
                         <Input defaultValue="¿Cuál es el primer paso antes de ingresar a la zona caliente?" className="font-semibold bg-surface border-border" />
                       </div>
                       <Button variant="ghost" size="icon" className="text-danger"><Trash2 className="h-4 w-4" /></Button>
                     </div>
                     
                     <div className="pl-4 border-l-2 border-border space-y-2">
                       <div className="flex items-center gap-3">
                         <div className="h-4 w-4 rounded-full border border-border"></div>
                         <Input defaultValue="Revisar el SCBA" className="h-8 bg-surface-secondary/50 border-transparent w-full max-w-sm text-sm" />
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="h-4 w-4 rounded-full border border-primary bg-primary flex items-center justify-center"><div className="h-1.5 w-1.5 bg-black rounded-full"></div></div>
                         <Input defaultValue="Comprobar integridad del traje" className="h-8 bg-surface-secondary/50 border-transparent w-full max-w-sm text-sm font-semibold text-primary" />
                         <span className="text-xs text-primary font-medium ml-2">Correcta</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="h-4 w-4 rounded-full border border-border"></div>
                         <Input defaultValue="Verificar comunicación" className="h-8 bg-surface-secondary/50 border-transparent w-full max-w-sm text-sm" />
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>

            </div>

            <div className="space-y-6">
              <Card className="bg-surface/50 border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-muted uppercase tracking-wider">Reglas de Evaluación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                   <div className="space-y-1.5">
                     <label className="text-sm font-semibold">Puntaje mínimo aprobatorio (%)</label>
                     <Input type="number" defaultValue={80} className="bg-surface-secondary border-border" />
                   </div>
                   
                   <div className="space-y-1.5">
                     <label className="text-sm font-semibold">Aleatoriedad</label>
                     <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg">
                       <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-surface border-border text-primary focus:ring-primary" />
                       <span className="text-sm">Extraer 10 preguntas aleatorias del banco por cada intento.</span>
                     </div>
                   </div>

                   <hr className="border-border" />

                   <div className="space-y-1.5">
                     <label className="text-sm font-semibold flex items-center gap-2">
                       <Award className="h-4 w-4 text-emerald-400"/> Plantilla de Certificado
                     </label>
                     <select className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground">
                        <option>Plantilla Estándar IS (Horizontal)</option>
                        <option>Plantilla Corporativa OSHA</option>
                        <option>Constancia Simple</option>
                     </select>
                   </div>
                </CardContent>
              </Card>
            </div>
            
          </div>
        )}

      </div>

      {/* Module Modal Simulation */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Añadir Nuevo Módulo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowModuleModal(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Título del Módulo</label>
                <Input placeholder="Ej. Fundamentos de Seguridad..." className="bg-surface-secondary border-border" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Restricciones</label>
                <select className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground">
                  <option>Debe aprobar el módulo anterior</option>
                  <option>Sin restricciones (Libre)</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border bg-surface-secondary/30 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowModuleModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowModuleModal(false)} className="shadow-lg shadow-primary/20">Guardar Módulo</Button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal Simulation */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Añadir Pregunta al Examen</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowQuestionModal(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Enunciado de la Pregunta</label>
                <textarea 
                  placeholder="Escribe la pregunta aquí..."
                  className="flex min-h-[80px] w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue=""
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold">Opciones de Respuesta</label>
                
                {[1, 2, 3].map((opt, i) => (
                  <div key={opt} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-border shrink-0"></div>
                    <Input placeholder={`Opción ${i + 1}`} className="bg-surface-secondary border-border" />
                    {i === 0 && <span className="text-xs text-primary font-medium shrink-0 ml-1">Marcar Correcta</span>}
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" className="text-primary gap-1"><Plus className="h-3 w-3" /> Añadir Opción</Button>
              </div>
            </div>
            <div className="p-5 border-t border-border bg-surface-secondary/30 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowQuestionModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowQuestionModal(false)} className="shadow-lg shadow-primary/20">Añadir al Banco</Button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal Simulation */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Añadir Lección al Módulo</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowLessonModal(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Título de la Lección</label>
                <Input placeholder="Ej. Presentación del traje..." className="bg-surface-secondary border-border" />
              </div>
              
              <div className="space-y-1.5">
                 <label className="text-sm font-semibold">Contenido Principal (Video o Documento)</label>
                 <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-secondary/50 hover:border-primary/50 transition-colors group">
                    <div className="h-8 w-8 rounded-full bg-surface-secondary flex items-center justify-center mb-2 group-hover:bg-primary/10">
                      <Video className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Sube el Video (MP4) o Lectura Base (PDF)</p>
                    <span className="text-[10px] text-muted block mt-0.5">Máx. 500MB</span>
                 </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <label className="text-sm font-semibold">Recursos Adicionales (Opcional)</label>
                 </div>
                 
                 <div className="space-y-2">
                   {/* File Attachment Mock */}
                   <div className="flex items-center gap-3">
                     <FileText className="h-4 w-4 text-muted shrink-0" />
                     <Input placeholder="Adjuntar archivo o ruta (Ej. Guía Complementaria)" className="h-8 text-sm bg-surface-secondary border-border" />
                     <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted hover:text-foreground">
                       <UploadCloud className="h-4 w-4" />
                     </Button>
                   </div>
                   
                   {/* Link Attachment Mock */}
                   <div className="flex items-center gap-3">
                     <Settings className="h-4 w-4 text-muted shrink-0" />
                     <Input placeholder="Añadir Enlace Web externo (Ej. https://...)" className="h-8 text-sm bg-surface-secondary border-border" />
                     <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted hover:text-foreground">
                       <Plus className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
                 
                 <Button variant="ghost" size="sm" className="text-primary gap-1 w-full border border-dashed border-border"><Plus className="h-3 w-3" /> Añadir otro recurso adjunto</Button>
              </div>

            </div>
            <div className="p-5 border-t border-border bg-surface-secondary/30 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowLessonModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowLessonModal(false)} className="shadow-lg shadow-primary/20">Añadir Lección</Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal Simulation */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Configuración General</h2>
                <p className="text-sm text-muted">Ajusta los detalles base de este curso.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Título del Curso</label>
                <Input defaultValue="Identificación y Manejo de Riesgos Químicos" className="bg-surface-secondary border-border" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Categoría</label>
                <select defaultValue="Salud Ocupacional" className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground">
                  <option>Seguridad Básica</option>
                  <option>Salud Ocupacional</option>
                  <option>Emergencias y Rescate</option>
                  <option>Medio Ambiente</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Público Objetivo (Audiencia)</label>
                <select defaultValue="Todos (T) - Público general y contratistas" className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground">
                  <option>Todos (T) - Público general y contratistas</option>
                  <option>Internos (I) - Solo personal de planta</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Descripción</label>
                <textarea 
                  defaultValue="Este módulo enseña los protocolos esenciales para la manipulación segura de agentes químicos según las normativas vigentes."
                  className="flex min-h-[80px] w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm"
                />
              </div>

            </div>
            <div className="p-5 border-t border-border bg-surface-secondary/30 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancelar</Button>
              <Button onClick={() => setShowSettingsModal(false)} className="shadow-lg shadow-primary/20">Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
