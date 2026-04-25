"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, BookOpen, Award, AlertTriangle, ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header text */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">¡Hola, Alex!</h1>
        <p className="text-muted">Aquí tienes un resumen de tu progreso y capacitaciones pendientes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Main "Continue Watching" Column */}
        <div className="md:col-span-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" /> Continuar Aprendiendo
            </h2>
            <Card className="bg-surface/60 border-border overflow-hidden hover:border-primary/50 transition-colors group">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-2/5 p-4 relative">
                  <div className="aspect-video relative rounded-md overflow-hidden bg-slate-800 group-hover:scale-[1.02] transition-transform">
                    {/* Simulated Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-80">
                      <ImageIcon className="h-12 w-12 text-slate-600" />
                    </div>
                    <div className="absolute bottom-2 right-2 z-20">
                      <Badge className="bg-black/60 text-white border-none pointer-events-none backdrop-blur-sm">
                        Módulo 3
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-2 border-primary text-primary">Seguridad Básica</Badge>
                  <h3 className="text-xl font-bold mb-2">Uso Correcto de EPP Avanzado</h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">
                    Aprende a identificar y utilizar correctamente el equipo de protección personal en zonas de alto riesgo radiológico.
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs text-muted font-medium">
                      <span>Progreso del Curso</span>
                      <span className="text-primary">65%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href="/student/learning/course-epp-101">
                      <Button className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        <PlayCircle className="h-4 w-4 mr-2" /> Reanudar Lección
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-surface/40 border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted">Horas de Estudio</p>
                    <p className="text-3xl font-bold">24.5</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface/40 border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted">Cursos Completados</p>
                    <p className="text-3xl font-bold">4</p>
                  </div>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-surface/40 border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted">Exámenes Aprobados</p>
                    <p className="text-3xl font-bold text-foreground">3</p>
                  </div>
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar / Alerts Column */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> Tareas Pendientes
          </h2>
          
          <div className="flex flex-col gap-4">
            {/* Warning Alert */}
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-5">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-warning mt-1.5 animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-warning tracking-wide">PRÓXIMO A VENCER</h4>
                    <p className="text-sm mt-1 mb-2">Tu certificación en <strong>Primeros Auxilios</strong> caduca en 5 días.</p>
                    <Link href="/student/learning" className="text-xs font-medium text-warning hover:underline flex items-center gap-1">
                      Realizar recertificación <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Alert */}
            <Card className="bg-danger/5 border-danger/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-danger"></div>
              <CardContent className="p-5 pl-6">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-danger tracking-wide">REQUERIDO URGENTE</h4>
                    <p className="text-sm mt-1 mb-3">Tienes un nuevo módulo obligatorio asignado por RRHH: <strong>Protocolo de Evacuación Sísmica</strong>.</p>
                    <Button variant="danger" size="sm" className="w-full text-xs h-8">
                      Iniciar Módulo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Normal Assignment */}
             <Card className="bg-surface/40 border-border">
              <CardContent className="p-5">
                <div className="flex gap-3">
                   <div className="shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground tracking-wide">NUEVA ASIGNACIÓN</h4>
                    <p className="text-sm text-muted mt-1">Curso "Manejo de Extintores Nivel 2". Tienes 14 días para completarlo.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>

      {/* Discover New Courses Section - Modern & Visible */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" /> Descubrir nuevos cursos
          </h2>
          <Link href="/student/browse">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
              Ver todo el catálogo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'prevencion-riesgos', title: 'Prevención de Riesgos', category: 'Normativas', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' },
            { id: 'trabajos-altura', title: 'Seguridad en Altura', category: 'Operaciones', image: 'https://images.unsplash.com/photo-1541888081156-fbd2ca91361b?w=400&q=80' },
            { id: 'auditor-interno-45001', title: 'Auditor ISO 45001', category: 'Auditoría', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80' },
            { id: 'liderazgo-seguridad', title: 'Liderazgo de Seguridad', category: 'Gestión', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' }
          ].map((course) => (
            <Link href={`/cursos/${course.id}`} key={course.id} className="group">
              <Card className="bg-surface/30 border-border/50 overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-1">
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon className="h-10 w-10 text-slate-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-3">
                    <Badge className="bg-purple-600 text-white border-none text-[10px]">{course.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">{course.title}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted">Explorar</span>
                    <PlayCircle className="h-4 w-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
