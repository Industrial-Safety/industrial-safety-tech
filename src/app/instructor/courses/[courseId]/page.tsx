"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Video, 
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  Settings,
  LayoutDashboard,
  Database,
  BarChart3,
  GripVertical,
  Pencil
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CourseBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number | null>(0);

  useEffect(() => {
    if (params.courseId) {
      fetchCourse();
    }
  }, [params.courseId]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/proxy/course/${params.courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourseData(data);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newData = { ...courseData };
    newData.sectionList.push({ title: "Nuevo Módulo", lectureList: [] });
    setCourseData(newData);
    setSelectedModuleIdx(newData.sectionList.length - 1);
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse">Cargando Constructor del Curso...</div>;

  if (!courseData) {
    return (
      <div className="p-20 text-center space-y-4">
        <p className="text-muted-foreground">No se pudo cargar la información del curso.</p>
        <Button onClick={() => router.push('/instructor/courses')}>Volver a la lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/instructor/courses')}>Portal de Instructores</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground/60">Control Académico</span>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-surface-secondary" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
             </Button>
             <h1 className="text-2xl font-bold flex items-center gap-3">
               Constructor del Curso 
               <Badge className="bg-warning/10 text-warning border-warning/20 text-[10px]">Borrador</Badge>
             </h1>
          </div>
          <p className="text-xs text-muted-foreground font-mono">ID: {params.courseId}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-surface-secondary/30 border-border/40">
            <Settings className="h-4 w-4" /> Configuración General
          </Button>
          <Button className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold shadow-lg shadow-warning/10">
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="bg-transparent border-b border-border/40 w-full justify-start rounded-none h-12 p-0 gap-8">
          <TabsTrigger value="curriculum" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-warning data-[state=active]:text-warning rounded-none h-full px-0 gap-2 font-bold text-xs">
            <LayoutDashboard className="h-4 w-4" /> Temario y Lecciones
          </TabsTrigger>
          <TabsTrigger value="s3" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-warning data-[state=active]:text-warning rounded-none h-full px-0 gap-2 font-bold text-xs">
            <Database className="h-4 w-4" /> Repositorio AWS (S3)
          </TabsTrigger>
          <TabsTrigger value="eval" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-warning data-[state=active]:text-warning rounded-none h-full px-0 gap-2 font-bold text-xs">
            <BarChart3 className="h-4 w-4" /> Sistema de Evaluación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Content: Module Manager */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Gestor de Módulos (Drag & Drop)</h2>
                <Button onClick={addSection} size="sm" variant="outline" className="gap-2 border-border/40 bg-surface-secondary/20">
                   <Plus className="h-4 w-4" /> Añadir Módulo
                </Button>
              </div>

              <div className="space-y-4">
                {courseData.sectionList.map((section: any, sIdx: number) => (
                  <Card 
                    key={sIdx} 
                    onClick={() => setSelectedModuleIdx(sIdx)}
                    className={cn(
                      "bg-[#0B101A] border-border/40 overflow-hidden transition-all",
                      selectedModuleIdx === sIdx ? "ring-1 ring-warning/50 border-warning/30" : "hover:border-border"
                    )}
                  >
                    <div className="p-4 flex items-center justify-between bg-surface-secondary/10 border-b border-border/20">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Módulo {sIdx + 1}:</span>
                        <h3 className="font-bold text-sm">{section.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Settings className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/20">
                        {section.lectureList.map((lecture: any, lIdx: number) => (
                          <div key={lIdx} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-surface-secondary/50 flex items-center justify-center">
                                <Video className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{lecture.title}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{lecture.duration || "0:00"}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-surface-secondary/5 border-t border-border/20">
                        <Button variant="ghost" size="sm" className="w-full border border-dashed border-border/40 text-[10px] uppercase font-bold tracking-widest hover:bg-warning/10 hover:text-warning transition-all">
                          + Agregar Lección
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar: Metadatos */}
            <div className="lg:col-span-4">
              <Card className="bg-[#0B101A] border-border/40 sticky top-8">
                <CardHeader className="border-b border-border/20 pb-4">
                  <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Metadatos del módulo seleccionado</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Título</label>
                     <Input 
                       value={selectedModuleIdx !== null ? courseData.sectionList[selectedModuleIdx]?.title : ""}
                       onChange={(e) => {
                         if (selectedModuleIdx !== null) {
                           const newData = { ...courseData };
                           newData.sectionList[selectedModuleIdx].title = e.target.value;
                           setCourseData(newData);
                         }
                       }}
                       className="bg-surface-secondary/30 border-border/40 h-10 text-sm font-medium"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Restricciones de Prerrequisito</label>
                     <select className="w-full bg-surface-secondary/30 border border-border/40 rounded-md h-10 px-3 text-sm outline-none">
                       <option>Debe aprobar el módulo anterior</option>
                       <option>Ninguno</option>
                     </select>
                   </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        <TabsContent value="s3">
          <Card className="bg-[#0B101A] border-border/40 p-12 text-center flex flex-col items-center">
            <Database className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-bold">Repositorio AWS S3</h3>
            <p className="text-muted-foreground text-sm mt-2">Aquí aparecerán todos tus archivos subidos a la nube.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
