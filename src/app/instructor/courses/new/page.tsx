"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  ChevronRight,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Tipos basados en tu microservicio
interface Section {
  title: string;
  lectureList: Lecture[];
}

interface Lecture {
  title: string;
  duration: string;
  lectureType: "VIDEO" | "ARTICLE";
  contentUrl: string;
  isPreview: boolean;
  resourceList: any[];
}

export default function NewCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingProgress, setUploadingProgress] = useState<{ [key: string]: number }>({});

  // Estado del curso
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    teacher: { id: 0, name: "Cargando...", profession: "Instructor" },
    details: {
      language: "Español",
      level: "Básico",
      totalDurationHorus: 0,
      totalLecture: 0,
      precio: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    },
    requirements: [""],
    learningOutcomes: [""],
    sectionList: [] as Section[],
    reviews: { averageRating: 0, totalReviews: 0 }
  });

  // Sincronizar datos del docente desde la sesión
  React.useEffect(() => {
    if (session?.user) {
      setCourseData(prev => ({
        ...prev,
        teacher: { 
          // @ts-ignore
          id: Number(session.dbId) || 0, 
          name: session.user?.name || "Instructor", 
          profession: "Instructor Especialista" // Esto lo podrías traer de la DB si gustas
        }
      }));
    }
  }, [session]);

  // Funciones de utilidad para Secciones y Lecciones
  const addSection = () => {
    setCourseData({
      ...courseData,
      sectionList: [...courseData.sectionList, { title: "", lectureList: [] }]
    });
  };

  const addLecture = (sectionIndex: number) => {
    const newSections = [...courseData.sectionList];
    newSections[sectionIndex].lectureList.push({
      title: "",
      duration: "0:00",
      lectureType: "VIDEO",
      contentUrl: "",
      isPreview: false,
      resourceList: []
    });
    setCourseData({ ...courseData, sectionList: newSections });
  };

  // Lógica de subida a S3 usando tu microservicio
  const handleFileUpload = async (sectionIdx: number, lectureIdx: number, file: File) => {
    const lectureId = `s${sectionIdx}l${lectureIdx}`;
    
    try {
      // 1. Obtener URL firmada del microservicio
      const res = await fetch(`/api/proxy/storage/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
      const { uploadUrl, fileUrl } = await res.json();

      // 2. Subir directamente a S3
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadingProgress(prev => ({ ...prev, [lectureId]: percent }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const newSections = [...courseData.sectionList];
          newSections[sectionIdx].lectureList[lectureIdx].contentUrl = fileUrl;
          setCourseData({ ...courseData, sectionList: newSections });
          alert("Video subido con éxito a S3");
        }
      };

      xhr.send(file);
    } catch (error) {
      console.error("Error en subida:", error);
      alert("Error al subir el video");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ajustar totales antes de enviar
      const totalLectures = courseData.sectionList.reduce((acc, s) => acc + s.lectureList.length, 0);
      const finalData = { ...courseData, details: { ...courseData.details, totalLecture: totalLectures } };

      const res = await fetch("/api/proxy/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData)
      });

      if (res.ok) {
        alert("¡Curso creado con éxito!");
        router.push("/instructor/courses");
      }
    } catch (error) {
      console.error("Error creando curso:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-1 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Curso</h1>
            <p className="text-sm text-muted-foreground">Paso {step} de 3</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Continuar <ChevronRight className="ml-2 h-4 w-4" /></Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary">
              {isSubmitting ? "Publicando..." : "Publicar Curso"}
            </Button>
          )}
        </div>
      </div>

      {/* Stepper Visual */}
      <div className="flex justify-between max-w-md mx-auto mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all",
              step === i ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
              step > i ? "bg-success text-white" : "bg-surface-secondary text-muted"
            )}>
              {step > i ? <CheckCircle2 className="h-6 w-6" /> : i}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              {i === 1 ? "Básico" : i === 2 ? "Contenido" : "Finalizar"}
            </span>
          </div>
        ))}
      </div>

      {/* PASO 1: Información General */}
      {step === 1 && (
        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-surface/50 border-border">
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Define el título y la descripción principal de tu curso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título del Curso</label>
                <Input 
                  placeholder="Ej. Seguridad en Trabajos de Altura" 
                  value={courseData.title}
                  onChange={e => setCourseData({...courseData, title: e.target.value})}
                  className="text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtítulo o Resumen</label>
                <Textarea 
                  placeholder="Una breve descripción que atrape al alumno..." 
                  value={courseData.subtitle}
                  onChange={e => setCourseData({...courseData, subtitle: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel</label>
                  <select 
                    className="w-full bg-surface-secondary border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={courseData.details.level}
                    onChange={e => setCourseData({
                      ...courseData, 
                      details: {...courseData.details, level: e.target.value}
                    })}
                  >
                    <option>Básico</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio (USD)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={courseData.details.precio}
                    onChange={e => setCourseData({
                      ...courseData, 
                      details: {...courseData.details, precio: parseFloat(e.target.value)}
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PASO 2: Plan de Estudios (S3 Integration) */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Currículum del Curso</h2>
            <Button onClick={addSection} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Añadir Sección
            </Button>
          </div>

          {courseData.sectionList.length === 0 && (
            <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center text-muted-foreground bg-surface/20">
              <Plus className="h-12 w-12 mb-4 opacity-20" />
              <p>Aún no has añadido ninguna sección.</p>
            </div>
          )}

          {courseData.sectionList.map((section, sIdx) => (
            <Card key={sIdx} className="bg-surface/50 border-border overflow-hidden">
              <CardHeader className="bg-surface-secondary/30 pb-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-primary/20 text-primary border-none">Sección {sIdx + 1}</Badge>
                  <Input 
                    placeholder="Nombre de la sección (ej. Introducción)" 
                    className="bg-transparent border-none font-bold text-lg p-0 h-auto focus-visible:ring-0"
                    value={section.title}
                    onChange={e => {
                      const newSections = [...courseData.sectionList];
                      newSections[sIdx].title = e.target.value;
                      setCourseData({...courseData, sectionList: newSections});
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 border-t border-border">
                <div className="divide-y divide-border">
                  {section.lectureList.map((lecture, lIdx) => (
                    <div key={lIdx} className="p-4 space-y-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3 flex-1">
                           <Video className="h-4 w-4 text-muted-foreground" />
                           <Input 
                             placeholder="Título de la lección" 
                             className="bg-surface-secondary/50 border-border h-8 text-sm"
                             value={lecture.title}
                             onChange={e => {
                               const newSections = [...courseData.sectionList];
                               newSections[sIdx].lectureList[lIdx].title = e.target.value;
                               setCourseData({...courseData, sectionList: newSections});
                             }}
                           />
                         </div>
                         <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>

                      {/* Subida a S3 */}
                      {!lecture.contentUrl ? (
                        <div className="flex items-center gap-4 pl-7">
                          <Input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            id={`file-${sIdx}-${lIdx}`}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(sIdx, lIdx, file);
                            }}
                          />
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="gap-2 text-[10px] uppercase font-bold"
                            onClick={() => document.getElementById(`file-${sIdx}-${lIdx}`)?.click()}
                          >
                            <UploadCloud className="h-3 w-3" /> Subir Video
                          </Button>
                          {uploadingProgress[`s${sIdx}l${lIdx}`] && (
                            <div className="flex-1 max-w-xs space-y-1">
                              <Progress value={uploadingProgress[`s${sIdx}l${lIdx}`]} className="h-1" />
                              <p className="text-[10px] text-muted-foreground">{uploadingProgress[`s${sIdx}l${lIdx}`]}% subido</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pl-7 text-xs text-success font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Video vinculado correctamente
                          <span className="text-[10px] text-muted-foreground font-normal ml-2">({lecture.contentUrl.split('/').pop()})</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-surface-secondary/20">
                  <Button variant="ghost" size="sm" onClick={() => addLecture(sIdx)} className="text-primary hover:bg-primary/10 gap-2">
                    <Plus className="h-4 w-4" /> Añadir Lección
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PASO 3: Resumen y Metas */}
      {step === 3 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
           <Card className="bg-surface/50 border-border">
             <CardHeader>
               <CardTitle>Últimos Detalles</CardTitle>
               <CardDescription>¿Qué aprenderán tus alumnos y qué necesitan saber antes?</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Resultados de Aprendizaje
                  </h3>
                  {courseData.learningOutcomes.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder="Ej. Sabrá identificar riesgos críticos en andamios" 
                        value={item}
                        onChange={e => {
                          const newOutcomes = [...courseData.learningOutcomes];
                          newOutcomes[i] = e.target.value;
                          setCourseData({...courseData, learningOutcomes: newOutcomes});
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newOutcomes = [...courseData.learningOutcomes];
                        newOutcomes.splice(i, 1);
                        setCourseData({...courseData, learningOutcomes: newOutcomes});
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCourseData({
                    ...courseData, 
                    learningOutcomes: [...courseData.learningOutcomes, ""]
                  })}>+ Añadir más</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" /> Requerimientos del Curso
                  </h3>
                  {courseData.requirements.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder="Ej. 1 año de experiencia en construcción" 
                        value={item}
                        onChange={e => {
                          const newReqs = [...courseData.requirements];
                          newReqs[i] = e.target.value;
                          setCourseData({...courseData, requirements: newReqs});
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newReqs = [...courseData.requirements];
                        newReqs.splice(i, 1);
                        setCourseData({...courseData, requirements: newReqs});
                      }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCourseData({
                    ...courseData, 
                    requirements: [...courseData.requirements, ""]
                  })}>+ Añadir más</Button>
                </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
