"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, CheckCircle2, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const MOCK_COURSES = [
  {
    id: "course-epp-101",
    title: "Uso Correcto de EPP Avanzado",
    category: "Seguridad Básica",
    status: "in-progress",
    progress: 65,
    dueDate: "2026-05-10",
    image: "https://images.unsplash.com/photo-1571116666359-dc348ccbae97?w=800&q=80"
  },
  {
    id: "course-fire-01",
    title: "Manejo de Extintores Nivel 2",
    category: "Emergencias",
    status: "not-started",
    progress: 0,
    dueDate: "2026-04-30",
    image: "https://images.unsplash.com/photo-1582214307525-ee9ebc82f939?w=800&q=80"
  },
  {
    id: "course-firstaid",
    title: "Primeros Auxilios Básicos",
    category: "Salud",
    status: "completed",
    progress: 100,
    completionDate: "2026-02-15",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80"
  },
  {
    id: "course-evacuation",
    title: "Protocolo de Evacuación Sísmica",
    category: "Emergencias",
    status: "not-started",
    progress: 0,
    dueDate: "Urgent",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  }
];

export default function MiAprendizajePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Aprendizaje</h1>
          <p className="text-muted">Cursos inscritos y tu progreso actual.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input 
              type="search" 
              placeholder="Buscar curso..." 
              className="pl-9 bg-surface/50 border-border"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-surface/50 border-border">
            <Filter className="h-4 w-4 text-muted" />
          </Button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex gap-4 border-b border-border pb-px overflow-x-auto scrollbar-hide whitespace-nowrap">
        <button className="text-sm font-medium text-primary border-b-2 border-primary pb-2 px-1">Todos los Cursos</button>
        <button className="text-sm font-medium text-muted hover:text-foreground transition-colors pb-2 px-1">En Progreso</button>
        <button className="text-sm font-medium text-muted hover:text-foreground transition-colors pb-2 px-1">Completados</button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className="bg-surface/50 border-border overflow-hidden group flex flex-col h-full hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="aspect-[16/9] relative bg-slate-900 border-b border-border overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-10" />
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 z-20">
                <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-md">
                  {course.category}
                </Badge>
              </div>
              {course.status === 'completed' && (
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
                {/* Progress Bar Area */}
                {course.status !== 'completed' ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted font-medium">
                      <span>Progreso</span>
                      <span className={course.progress > 0 ? "text-primary text-xs" : "text-xs"}>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-success font-medium">
                    <Award className="h-4 w-4" /> Completado el {course.completionDate}
                  </div>
                )}

                {/* Footer Action */}
                <div className="flex items-center gap-3">
                  <Link href={`/trabajador/learning/${course.id}`} className="flex-1">
                     <Button 
                      variant={course.status === 'completed' ? 'outline' : 'primary'} 
                      className="w-full shadow-md"
                    >
                      {course.status === 'completed' ? 'Repasar Material' : (course.progress > 0 ? 'Continuar' : 'Empezar Curso')}
                      {course.status !== 'completed' && <PlayCircle className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
