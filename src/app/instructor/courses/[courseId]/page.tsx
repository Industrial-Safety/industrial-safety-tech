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
import { toast } from "sonner";

export default function CourseBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [currentLectureUrl, setCurrentLectureUrl] = useState("");

  // Upload state (modal añadir)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLectureDuration, setCurrentLectureDuration] = useState("0:00");

  // Recursos adicionales (modal añadir lección)
  const [lectureResources, setLectureResources] = useState<{ title: string; resourceType: "FILE" | "LINK"; url: string; fileSize: string }[]>([]);
  const [newResourceLink, setNewResourceLink] = useState("");
  const [isUploadingResource, setIsUploadingResource] = useState(false);

  // Modal editar lección
  const [isEditLectureModalOpen, setIsEditLectureModalOpen] = useState(false);
  const [editSectionIdx, setEditSectionIdx] = useState<number>(0);
  const [editLectureIdx, setEditLectureIdx] = useState<number>(0);
  const [editLectureTitle, setEditLectureTitle] = useState("");
  const [editLectureUrl, setEditLectureUrl] = useState("");
  const [editLectureDuration, setEditLectureDuration] = useState("0:00");
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [isEditUploading, setIsEditUploading] = useState(false);

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
        setSelectedModuleIdx(data.sectionList?.length > 0 ? 0 : null);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async (data: any) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/proxy/course/${params.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Error al guardar");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCourse = async () => {
    await saveCourse(courseData);
    toast.success("¡Cambios guardados con éxito!");
  };

  const extractVideoDuration = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const totalSeconds = Math.floor(video.duration);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const formatted = h > 0
          ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${m}:${String(s).padStart(2, "0")}`;
        resolve(formatted);
      };
      video.onerror = () => resolve("0:00");
      video.src = URL.createObjectURL(file);
    });

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Extraer duración localmente antes de subir (no requiere backend)
      if (file.type.startsWith("video/")) {
        const duration = await extractVideoDuration(file);
        setCurrentLectureDuration(duration);
      }

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
      // Breve pausa para que se vea el 100% antes de transicionar al CheckCircle
      await new Promise(resolve => setTimeout(resolve, 700));
      setCurrentLectureUrl(fileUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error en la subida. Revisa tu configuración de S3.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingResource(true);
      const urlRes = await fetch(`/api/proxy/storage/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
      if (!urlRes.ok) throw new Error();
      const { uploadUrl, fileUrl } = await urlRes.json();
      const uploadRes = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!uploadRes.ok) throw new Error();
      setLectureResources(prev => [...prev, {
        title: file.name,
        resourceType: "FILE",
        url: fileUrl,
        fileSize: formatFileSize(file.size),
      }]);
      toast.success("Recurso subido");
    } catch {
      toast.error("Error al subir el recurso");
    } finally {
      setIsUploadingResource(false);
      e.target.value = "";
    }
  };

  const handleAddResourceLink = () => {
    const trimmed = newResourceLink.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch { toast.error("Ingresa una URL válida (incluye https://)"); return; }
    setLectureResources(prev => [...prev, { title: trimmed, resourceType: "LINK", url: trimmed, fileSize: "" }]);
    setNewResourceLink("");
  };

  const resetLectureModal = () => {
    setNewLectureTitle("");
    setCurrentLectureUrl("");
    setCurrentLectureDuration("0:00");
    setLectureResources([]);
    setNewResourceLink("");
    setIsLectureModalOpen(false);
  };

  const handleOpenEditLecture = (sIdx: number, lIdx: number) => {
    const lecture = courseData.sectionList[sIdx].lectureList[lIdx];
    setEditSectionIdx(sIdx);
    setEditLectureIdx(lIdx);
    setEditLectureTitle(lecture.title);
    setEditLectureUrl(lecture.contentUrl ?? "");
    setEditLectureDuration(lecture.duration ?? "0:00");
    setIsEditLectureModalOpen(true);
  };

  const handleEditVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsEditUploading(true);
      setEditUploadProgress(10);
      if (file.type.startsWith("video/")) {
        const duration = await extractVideoDuration(file);
        setEditLectureDuration(duration);
      }
      const urlRes = await fetch(`/api/proxy/storage/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
      if (!urlRes.ok) throw new Error("No se pudo obtener la URL de subida");
      const { uploadUrl, fileUrl } = await urlRes.json();
      setEditUploadProgress(30);
      const uploadRes = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!uploadRes.ok) throw new Error("Error al subir el archivo a S3");
      setEditUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 700));
      setEditLectureUrl(fileUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error en la subida. Revisa tu configuración de S3.");
    } finally {
      setIsEditUploading(false);
      setEditUploadProgress(0);
    }
  };

  const handleSaveEditLecture = async () => {
    if (!editLectureTitle) return;
    const updatedSections = courseData.sectionList.map((sec: any, sIdx: number) =>
      sIdx === editSectionIdx
        ? {
            ...sec,
            lectureList: sec.lectureList.map((lec: any, lIdx: number) =>
              lIdx === editLectureIdx
                ? { ...lec, title: editLectureTitle, contentUrl: editLectureUrl, duration: editLectureDuration }
                : lec
            ),
          }
        : sec
    );
    const newData = { ...courseData, sectionList: updatedSections };
    setCourseData(newData);
    setIsEditLectureModalOpen(false);
    await saveCourse(newData);
    toast.success("Lección actualizada y guardada");
  };

  const handleDeleteModule = async (sIdx: number) => {
    const updatedSections = courseData.sectionList.filter((_: any, i: number) => i !== sIdx);
    const newData = { ...courseData, sectionList: updatedSections };
    setCourseData(newData);
    setSelectedModuleIdx(updatedSections.length > 0 ? 0 : null);
    await saveCourse(newData);
    toast.success("Módulo eliminado");
  };

  const handleAddModule = async () => {
    if (!newModuleTitle) return;
    const newData = { ...courseData, sectionList: [...courseData.sectionList, { title: newModuleTitle, lectureList: [] }] };
    setCourseData(newData);
    setNewModuleTitle("");
    setIsModuleModalOpen(false);
    setSelectedModuleIdx(newData.sectionList.length - 1);
    await saveCourse(newData);
    toast.success("Módulo añadido y guardado");
  };

  const handleAddLecture = async () => {
    if (!newLectureTitle || selectedModuleIdx === null) return;
    const updatedSections = courseData.sectionList.map((sec: any, idx: number) =>
      idx === selectedModuleIdx
        ? { ...sec, lectureList: [...sec.lectureList, {
            title: newLectureTitle,
            duration: currentLectureDuration,
            lectureType: "VIDEO",
            contentUrl: currentLectureUrl,
            isPreview: false,
            resourceList: lectureResources
          }] }
        : sec
    );
    const newData = { ...courseData, sectionList: updatedSections };
    setCourseData(newData);
    resetLectureModal();
    await saveCourse(newData);
    toast.success("Lección añadida y guardada");
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
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 hover:bg-white/10"
                          onClick={(e) => { e.stopPropagation(); setSelectedModuleIdx(sIdx); }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 text-destructive/70 hover:bg-destructive/10"
                          onClick={(e) => { e.stopPropagation(); handleDeleteModule(sIdx); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                          <Button
                            variant="ghost" size="icon"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); handleOpenEditLecture(sIdx, lIdx); }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
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
                          value={selectedModuleIdx !== null ? (courseData.sectionList[selectedModuleIdx]?.title ?? "") : ""}
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
              {/* PDF upload */}
              <input type="file" id="resource-upload" className="hidden" accept="application/pdf" onChange={handleResourceUpload} />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    readOnly
                    value={isUploadingResource ? "Subiendo..." : ""}
                    placeholder="Selecciona un PDF para subir"
                    className="pl-10 bg-surface-secondary/50 border-border/40 text-xs cursor-pointer"
                    onClick={() => document.getElementById("resource-upload")?.click()}
                  />
                </div>
                <Button
                  variant="outline" size="icon"
                  className="shrink-0 bg-surface-secondary/50 border-border/40"
                  disabled={isUploadingResource}
                  onClick={() => document.getElementById("resource-upload")?.click()}
                >
                  {isUploadingResource ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                </Button>
              </div>
              {/* Link add */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://enlace-externo.com"
                    value={newResourceLink}
                    onChange={(e) => setNewResourceLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddResourceLink()}
                    className="pl-10 bg-surface-secondary/50 border-border/40 text-xs"
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 bg-surface-secondary/50 border-border/40" onClick={handleAddResourceLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Lista de recursos añadidos */}
              {lectureResources.length > 0 && (
                <div className="space-y-1">
                  {lectureResources.map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-surface-secondary/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {r.resourceType === "FILE" ? <FileText className="h-3 w-3 text-warning shrink-0" /> : <LinkIcon className="h-3 w-3 text-primary shrink-0" />}
                        <span className="text-xs truncate">{r.title}</span>
                        {r.fileSize && <span className="text-[10px] text-muted-foreground shrink-0">{r.fileSize}</span>}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setLectureResources(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={resetLectureModal}>Cancelar</Button>
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
      {/* Modal: Editar Lección */}
      <Dialog open={isEditLectureModalOpen} onOpenChange={setIsEditLectureModalOpen}>
        <DialogContent className="bg-[#0F172A] border-border/40 text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Lección</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título de la Lección</label>
              <Input
                placeholder="Ej. Presentación del traje..."
                value={editLectureTitle}
                onChange={(e) => setEditLectureTitle(e.target.value)}
                className="bg-surface-secondary/50 border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido Principal (Video o Documento)</label>
              <input
                type="file"
                id="video-upload-edit"
                className="hidden"
                accept="video/*,application/pdf"
                onChange={handleEditVideoUpload}
              />
              <div
                onClick={() => document.getElementById("video-upload-edit")?.click()}
                className="border-2 border-dashed border-border/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-surface-secondary/20 hover:bg-surface-secondary/40 transition-all cursor-pointer group relative overflow-hidden"
              >
                {isEditUploading ? (
                  <div className="w-full space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-warning mx-auto" />
                    <Progress value={editUploadProgress} className="h-2" />
                    <p className="text-xs text-center font-bold">{editUploadProgress}% subiendo...</p>
                  </div>
                ) : editLectureUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <p className="text-xs font-bold text-green-500">Archivo listo — click para reemplazar</p>
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
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditLectureModalOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleSaveEditLecture}
              disabled={isEditUploading || !editLectureTitle}
              className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold px-8 h-10"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
