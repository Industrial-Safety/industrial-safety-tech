"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Video, Image as ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface CourseResponse {
  id?: string;
  _id?: string;
  title: string;
  subtitle: string;
  coverImageUrl?: string;
  details: {
    level: string;
    totalDurationHorus: number;
    totalLecture: number;
    precio: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=225&fit=crop";

export default function InstructorCoursesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "Seguridad Basica",
    audience: "Todos (T) - Publico general y contratistas",
    description: "",
    requirements: "",
    learningOutcomes: "",
    precio: 0,
  });

  useEffect(() => {
    if (status === "authenticated" && session) fetchCourses();
  }, [status, session]);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/proxy/course/my-courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCourse = async () => {
    setIsCreating(true);
    try {
      const teacherId = (session as any)?.keycloakId || "";
      let coverImageUrl = "";

      // 1. Subir imagen de portada a S3 si existe
      if (coverFile) {
        const presignRes = await fetch(
          `/api/proxy/storage/upload-url/cover?fileName=${encodeURIComponent(coverFile.name)}&contentType=${encodeURIComponent(coverFile.type)}`
        );
        if (presignRes.ok) {
          const { uploadUrl, fileUrl } = await presignRes.json();
          const s3Res = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": coverFile.type },
            body: coverFile,
          });
          if (s3Res.ok) coverImageUrl = fileUrl;
        }
      }

      // 2. Crear el curso con la URL de la imagen
      const payload = {
        title: newCourse.title,
        subtitle: newCourse.description,
        coverImageUrl,
        teacher: {
          id: teacherId,
          name: session?.user?.name || "Instructor",
          profession: "Instructor Especialista"
        },
        details: {
          language: "Espanol",
          level: "Basico",
          totalDurationHorus: 0,
          totalLecture: 0,
          precio: newCourse.precio,
          lastUpdated: new Date().toISOString().split("T")[0]
        },
        requirements: [newCourse.requirements || "Requerimiento base"],
        learningOutcomes: [newCourse.learningOutcomes || "Resultado esperado"],
        sectionList: [
          {
            title: "Introduccion al Curso",
            lectureList: [
              {
                title: "Bienvenida y Objetivos",
                duration: "0:00",
                lectureType: "VIDEO",
                contentUrl: "https://industrial-safety-tech.com/placeholder",
                isPreview: true,
                resourceList: []
              }
            ]
          }
        ],
        reviews: { averageRating: 0, totalReviews: 0 }
      };

      const res = await fetch("/api/proxy/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const createdCourse = await res.json();
        const cId = createdCourse.id || createdCourse._id;
        setIsModalOpen(false);
        setNewCourse({ title: "", category: "Seguridad Basica", audience: "Todos (T)", description: "", requirements: "", learningOutcomes: "", precio: 0 });
        setImagePreview(null);
        setCoverFile(null);
        if (cId) router.push(`/instructor/courses/${cId}`);
        else fetchCourses();
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsCreating(false);
    }
  };



  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Estas seguro de que deseas eliminar este curso?")) return;
    try {
      const res = await fetch(`/api/proxy/course/${courseId}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setCourses(prev => prev.filter(c => (c.id || c._id) !== courseId));
      } else {
        console.error("Error deleting course:", res.status);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de Cursos</h1>
          <p className="text-muted-foreground mt-1">Crea la informacion base y luego anade el contenido.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Plus className="h-4 w-4" /> Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-surface border-border shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Crear Nuevo Curso</DialogTitle>
              <DialogDescription>Proporciona la informacion base para empezar.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Titulo del Curso</label>
                <Input
                  placeholder="Ej. Riesgo Electrico Nivel 1"
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                  className="bg-surface-secondary/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <select
                  className="w-full bg-surface-secondary/50 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={newCourse.category}
                  onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                >
                  <option>Seguridad Basica</option>
                  <option>Prevencion Critica</option>
                  <option>Salud Ocupacional</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Publico Objetivo (Audiencia)</label>
                <select
                  className="w-full bg-surface-secondary/50 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  value={newCourse.audience}
                  onChange={e => setNewCourse({...newCourse, audience: e.target.value})}
                >
                  <option>Todos (T) - Publico general y contratistas</option>
                  <option>Solo Personal de Planta</option>
                  <option>Personal de Riesgo Alto</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Descripcion Corta</label>
                <Textarea
                  placeholder="Describe brevemente de que trata este modulo..."
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                  className="bg-surface-secondary/50 border-border min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Requerimientos</label>
                  <Input
                    placeholder="Ej. Conocimientos basicos..."
                    value={newCourse.requirements}
                    onChange={e => setNewCourse({...newCourse, requirements: e.target.value})}
                    className="bg-surface-secondary/50 border-border text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Que aprendera?</label>
                  <Input
                    placeholder="Ej. Uso de EPP..."
                    value={newCourse.learningOutcomes}
                    onChange={e => setNewCourse({...newCourse, learningOutcomes: e.target.value})}
                    className="bg-surface-secondary/50 border-border text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Precio (USD)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ej. 49.99"
                  value={newCourse.precio || ""}
                  onChange={e => setNewCourse({...newCourse, precio: parseFloat(e.target.value) || 0})}
                  className="bg-surface-secondary/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Portada del Curso</label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="course-image"
                  onChange={handleImageChange}
                />
                <div
                  onClick={() => document.getElementById("course-image")?.click()}
                  className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 bg-surface-secondary/20 hover:bg-surface-secondary/40 transition-colors cursor-pointer group relative overflow-hidden h-[160px]"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">Sube una imagen o arrastrala</p>
                        <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleCreateCourse}
                disabled={isCreating || !newCourse.title}
                className="bg-warning hover:bg-warning/90 text-warning-foreground font-bold"
              >
                {isCreating ? "Creando..." : "Guardar y Continuar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="bg-surface/50 border-border backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por titulo..."
              className="pl-10 bg-surface-secondary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-surface-secondary/50">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
            <Badge variant="secondary" className="px-4 flex items-center bg-primary/10 text-primary border-none">
              {courses.length} Cursos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cursos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-surface-secondary/50 animate-pulse border border-border" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const cId = course.id || course._id;
            const coverSrc = course.coverImageUrl || FALLBACK_IMAGE;
            return (
              <Card key={cId || index} className="group overflow-hidden bg-[#0B101A] border-border/40 hover:border-warning/30 transition-all duration-300 shadow-xl">
                <div className="aspect-video bg-surface-secondary relative overflow-hidden">
                  <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <Badge className="bg-primary/80 backdrop-blur-md border-none text-[10px] py-0 px-2 h-5">
                      I - Internos
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className="bg-warning text-warning-foreground font-bold border-none text-[10px] py-0 px-2 h-5">
                      Borrador
                    </Badge>
                  </div>
                  <img
                    src={coverSrc}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                  />
                </div>

                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl leading-tight text-warning group-hover:text-warning/80 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{course.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-t border-border/30">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">Alumnos</p>
                      <p className="text-lg font-bold text-foreground">0</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">Calif.</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className={`h-3 w-3 ${star <= Math.round(course.reviews?.averageRating || 0) ? "fill-warning text-warning" : "fill-muted text-muted"}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({course.reviews?.totalReviews || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border/30">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">Precio</p>
                      <p className="text-lg font-bold text-warning">{course.details?.precio ? "$" + course.details.precio.toFixed(2) : "Gratis"}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    {cId ? (
                      <>
                        <Link href={`/instructor/courses/${cId}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2 border-border/40 bg-surface-secondary/30 hover:bg-warning hover:text-warning-foreground transition-all">
                            <Plus className="h-4 w-4" /> Editar Curso
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteCourse(cId)}
                          className="border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-all shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button disabled variant="outline" className="flex-1 gap-2 border-border/40 bg-surface-secondary/30 opacity-50 cursor-not-allowed">
                        ID no disponible
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-surface/50 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Video className="h-10 w-10 text-primary/40" />
          </div>
          <h2 className="text-xl font-semibold">No tienes cursos todavia</h2>
          <Button onClick={() => setIsModalOpen(true)} className="mt-6 gap-2">
            <Plus className="h-4 w-4" /> Crear mi primer curso
          </Button>
        </Card>
      )}
    </div>
  );
}