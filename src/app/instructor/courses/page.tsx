"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreVertical, LayoutGrid, List, BarChart3, Edit3, Trash2, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_INSTRUCTOR_COURSES = [
  {
    id: "ins-course-1",
    title: "Uso Correcto de EPP Avanzado",
    category: "Seguridad Básica",
    status: "published",
    students: 1205,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571116666359-dc348ccbae97?w=800&q=80",
    lastUpdated: "Hace 2 días",
    audience: "T" // T para Todos
  },
  {
    id: "ins-course-2",
    title: "Gestión de Residuos Tóxicos",
    category: "Medio Ambiente",
    status: "draft",
    students: 0,
    rating: 0,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    lastUpdated: "Hace 5 horas",
    audience: "I" // I para Internos
  },
  {
    id: "ins-course-3",
    title: "Protocolo de Evacuación",
    category: "Emergencias",
    status: "published",
    students: 335,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582214307525-ee9ebc82f939?w=800&q=80",
    lastUpdated: "Hace 1 mes",
    audience: "T"
  }
];

export default function InstructorCoursesPage() {
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Administrar Cursos</h1>
          <p className="text-muted">Crea, edita y gestiona el contenido de tus capacitaciones.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowModal(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface/50 p-2 rounded-xl border border-border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input 
              placeholder="Buscar curso..." 
              className="pl-9 bg-background border-border h-9"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-background shrink-0">
            <Filter className="h-4 w-4 text-muted" />
          </Button>
        </div>
        
        <div className="hidden sm:flex bg-background border border-border p-1 rounded-lg">
           <button 
             onClick={() => setViewMode('grid')}
             className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-surface-secondary text-foreground" : "text-muted hover:text-foreground")}
           >
             <LayoutGrid className="h-4 w-4" />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-surface-secondary text-foreground" : "text-muted hover:text-foreground")}
           >
             <List className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_INSTRUCTOR_COURSES.map(course => (
             <Card key={course.id} className="bg-surface/50 border-border overflow-hidden flex flex-col group relative">
               <div className="aspect-video relative overflow-hidden bg-slate-900 border-b border-border">
                  <Badge 
                    variant={course.status === 'published' ? 'default' : 'secondary'} 
                    className={cn(
                      "absolute top-3 right-3 z-20 backdrop-blur-md",
                      course.status === 'published' ? "bg-success/90 text-black hover:bg-success" : "bg-warning/90 text-black border-none hover:bg-warning"
                    )}
                  >
                    {course.status === 'published' ? "Publicado" : "Borrador"}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "absolute top-3 left-3 z-20 backdrop-blur-md px-2",
                      course.audience === 'T' ? "bg-blue-500/90 text-white border-none" : "bg-purple-500/90 text-white border-none"
                    )}
                    title={course.audience === 'T' ? 'Público General' : 'Personal Interno'}
                  >
                    {course.audience === 'T' ? 'T - Todos' : 'I - Internos'}
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-10" />
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               
               <CardContent className="p-5 flex flex-col flex-1">
                 <div className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-2">{course.category}</div>
                 <h3 className="font-bold text-base leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                   {course.title}
                 </h3>

                 <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4 mb-4">
                   <div>
                     <p className="text-xs text-muted">Alumnos</p>
                     <p className="font-semibold text-sm">{course.students}</p>
                   </div>
                   <div>
                     <p className="text-xs text-muted">Calif.</p>
                     <p className="font-semibold text-sm">{course.rating === 0 ? '--' : course.rating}</p>
                   </div>
                 </div>

                 <div className="flex gap-2">
                    <Link href={`/instructor/courses/${course.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full text-xs h-9 bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                        <Edit3 className="h-3 w-3 mr-2" /> Editar Curso
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-border text-muted">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                 </div>
               </CardContent>
             </Card>
          ))}
        </div>
      )}

      {/* Modals Simulation using standard div overlays */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                 <h2 className="text-xl font-bold">Crear Nuevo Curso</h2>
                 <p className="text-sm text-muted">Proporciona la información base para empezar.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-5">
               <div className="space-y-1.5">
                 <label className="text-sm font-semibold">Título del Curso</label>
                 <Input placeholder="Ej. Riesgo Eléctrico Nivel 1" className="bg-surface-secondary border-border" />
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-sm font-semibold">Categoría</label>
                 <select className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Seguridad Básica</option>
                    <option>Emergencias y Rescate</option>
                    <option>Salud Ocupacional</option>
                    <option>Medio Ambiente</option>
                 </select>
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-semibold">Público Objetivo (Audiencia)</label>
                 <select className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Todos (T) - Público general y contratistas</option>
                    <option>Internos (I) - Solo personal de planta</option>
                 </select>
               </div>

               <div className="space-y-1.5">
                 <label className="text-sm font-semibold">Descripción Corta</label>
                 <textarea 
                   placeholder="Describe brevemente de qué trata este módulo..."
                   className="flex min-h-[80px] w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                 />
               </div>

               <div className="space-y-1.5 pt-2">
                 <label className="text-sm font-semibold">Portada del Curso</label>
                 <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-secondary/50 hover:border-primary/50 transition-colors group">
                    <div className="h-12 w-12 rounded-full bg-surface-secondary flex items-center justify-center mb-3 group-hover:bg-primary/10">
                      <ImageIcon className="h-6 w-6 text-muted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Sube una imagen o arrástrala</p>
                    <span className="text-xs text-muted block mt-1">PNG, JPG hasta 5MB</span>
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border-border bg-surface-secondary/30 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Link href="/instructor/courses/new-draft">
                <Button className="shadow-lg shadow-primary/20">Guardar y Continuar</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
