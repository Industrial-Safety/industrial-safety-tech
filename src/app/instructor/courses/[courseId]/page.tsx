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
  Pencil,
  FileText,
  Link as LinkIcon,
  X,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function CourseBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number | null>(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [currentLectureUrl, setCurrentLectureUrl] = useState("");

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSaveCourse = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/proxy/course/${params.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (res.ok) alert("¡Cambios guardados con éxito! 🛡️✨");
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const urlRes = await fetch(`/api/proxy/storage/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
      if (!urlRes.ok) throw new Error("No se pudo obtener la URL de subida");
      const { uploadUrl, fileUrl } = await urlRes.json();

      setUploadProgress(30);

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      if (!uploadRes.ok) throw new Error("Error al subir el archivo a S3");

      setUploadProgress(100);
      setCurrentLectureUrl(fileUrl);
      alert("¡Video subido con éxito! 🎥✨");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error en la subida. Revisa tu configuración de S3.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddModule = () => {
    if (!newModuleTitle) return;
    const newData = { ...courseData };
    newData.sectionList.push({ title: newModuleTitle, lectureList: [] });
    setCourseData(newData);
    setNewModuleTitle("");
    setIsModuleModalOpen(false);
    setSelectedModuleIdx(newData.sectionList.length - 1);
  };

  const handleAddLecture = () => {
    if (!newLectureTitle || selectedModuleIdx === null) return;
    const newData = { ...courseData };
    newData.sectionList[selectedModuleIdx].lectureList.push({
      title: newLectureTitle,
      duration: "0:00",
      lectureType: "VIDEO",
      contentUrl: currentLectureUrl,
      isPreview: false,
      resourceList: []
    });
    setCourseData(newData);
    setNewLectureTitle("");
    setCurrentLectureUrl("");
    setIsLectureModalOpen(false);
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse">Cargando Constructor...</div>;
  if (!courseData) return <div className="p-10 text-center">Curso no encontrado.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Top Header */}
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
               {courseData.title} <Badge className="bg-warning text-warning-foreground text-[10px]">Borrador</Badge>
             </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-surface-secondary/30 border-border/40 text-xs h-9">
            <Settings className="h-4 w-4" /> Configuración General
          </Button>
          <Button 
            onClick={handleSaveCourse}
            disabled={isSaving}
            className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold shadow-lg shadow-warning/10 text-xs h-9"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
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
        </TabsList>

        <TabsContent value="curriculum" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Gestor de Módulos</h2>
                <Button onClick={() => setIsModuleModalOpen(true)} size="sm" variant="outline" className="gap-2 border-border/40 bg-surface-secondary/20 h-9">
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
                      selectedModuleIdx === sIdx ? "ring-1 ring-warning/50 border-warning/30" : ""
                    )}
                  >
                    <div className="p-4 flex items-center justify-between bg-surface-secondary/10 border-b border-border/20">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Módulo {sIdx + 1}:</span>
                        <h3 className="font-bold text-sm">{section.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10"><Settings className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <CardContent className="p-0">
                      {section.lectureList.map((lecture: any, lIdx: number) => (
                        <div key={lIdx} className="p-4 flex items-center justify-between border-b border-border/10 last:border-0 group hover:bg-white/5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center">
                              <Video className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{lecture.title}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{lecture.duration}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><Pencil className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <div className="p-4 bg-black/20">
                        <Button 
                          onClick={() => { setSelectedModuleIdx(sIdx); setIsLectureModalOpen(true); }}
                          variant="ghost" className="w-full border border-dashed border-border/40 h-10 text-[10px] uppercase font-bold tracking-widest hover:bg-warning/10 hover:text-warning"
                        >
                          + Agregar Lección
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar Metadatos */}
            <div className="lg:col-span-4">
               <Card className="bg-[#0B101A] border-border/40 sticky top-8">
                  <CardHeader className="border-b border-border/20">
                    <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Metadatos del módulo</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Título</label>
                        <Input 
                          value={selectedModuleIdx !== null ? courseData.sectionList[selectedModuleIdx]?.title : ""}
                          onChange={(e) => {
                            if (selectedModuleIdx !== null) {
                              const newData = { ...courseData };
                              newData.sectionList[selectedModuleIdx].title = e.target.value;
                              setCourseData(newData);
                            }
                          }}
                          className="bg-surface-secondary/30 border-border/40 h-10 text-xs" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Restricciones</label>
                        <select className="w-full bg-surface-secondary/30 border border-border/40 rounded-md h-10 px-3 text-sm outline-none">
                          <option>Debe aprobar el módulo anterior</option>
                          <option>Ninguna</option>
                        </select>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal: Añadir Nuevo Módulo */}
      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent className="bg-[#0F172A] border-border/40 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Añadir Nuevo Módulo</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título del Módulo</label>
              <Input 
                placeholder="Ej. Fundamentos de Seguridad..." 
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="bg-surface-secondary/50 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Restricciones</label>
              <select className="w-full bg-surface-secondary/50 border border-border/40 rounded-md h-10 px-3 text-sm outline-none">
                <option>Debe aprobar el módulo anterior</option>
                <option>Ninguna</option>
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsModuleModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddModule} className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold px-8 h-10">Guardar Módulo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Añadir Lección */}
      <Dialog open={isLectureModalOpen} onOpenChange={setIsLectureModalOpen}>
        <DialogContent className="bg-[#0F172A] border-border/40 text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Añadir Lección al Módulo</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título de la Lección</label>
              <Input 
                placeholder="Ej. Presentación del traje..." 
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
                className="bg-surface-secondary/50 border-border/40"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido Principal (Video o Documento)</label>
              <input 
                type="file" 
                id="video-upload" 
                className="hidden" 
                accept="video/*,application/pdf"
                onChange={handleVideoUpload}
              />
              <div 
                onClick={() => document.getElementById('video-upload')?.click()}
                className="border-2 border-dashed border-border/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-surface-secondary/20 hover:bg-surface-secondary/40 transition-all cursor-pointer group relative overflow-hidden"
              >
                {isUploading ? (
                  <div className="w-full space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-warning mx-auto" />
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center font-bold">{uploadProgress}% subiendo...</p>
                  </div>
                ) : currentLectureUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <p className="text-xs font-bold text-green-500 line-clamp-1">¡Archivo listo!</p>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-surface-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Sube el Video (MP4) o Lectura Base (PDF)</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase">Máx. 500MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/20">
              <label className="text-sm font-medium">Recursos Adicionales (Opcional)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Adjuntar archivo o ruta" className="pl-10 bg-surface-secondary/50 border-border/40 text-xs" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 bg-surface-secondary/50 border-border/40"><UploadCloud className="h-4 w-4" /></Button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Añadir Enlace Web externo" className="pl-10 bg-surface-secondary/50 border-border/40 text-xs" />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 bg-surface-secondary/50 border-border/40"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsLectureModalOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleAddLecture} 
              disabled={isUploading || !newLectureTitle}
              className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold px-8 h-10"
            >
              Añadir Lección
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
