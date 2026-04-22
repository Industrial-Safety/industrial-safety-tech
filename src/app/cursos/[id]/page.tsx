import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LandingNav from "@/components/layout/landing-nav";
import { CourseReviews } from "@/components/courses/course-reviews";
import { AddToCartButton } from "@/components/courses/add-to-cart-button";
import {
  Star,
  Clock,
  GraduationCap,
  PlayCircle,
  CheckCircle2,
  Globe,
  MonitorPlay,
  FileText,
  Award,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileSignature,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  MoreVertical
} from "lucide-react";

// Mock data (in a real app, this would be fetched from a database)
const coursesData = {
  "prevencion-riesgos": {
    title: "Prevención de Riesgos Laborales",
    description: "Curso fundamental sobre normativas de seguridad, identificación de peligros, y control de riesgos en la industria.",
    fullDescription: "En este curso aprenderás a identificar, evaluar y controlar los riesgos en el entorno laboral. Conocerás las normativas vigentes y cómo aplicar medidas preventivas eficaces para garantizar la seguridad y salud de todos los trabajadores.",
    duration: "40 horas",
    level: "Básico",
    category: "Normativas",
    rating: 4.8,
    reviews: 1240,
    students: 5430,
    lastUpdated: "10/2025",
    language: "Español",
    instructor: {
      name: "Ing. Carlos Mendoza",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Especialista en SST",
      bio: "Ingeniero Industrial con más de 15 años de experiencia en gestión de seguridad y salud ocupacional en el sector minero y de construcción.",
      rating: 4.9,
      reviews: 3200,
      students: 15000,
      courses: 4
    },
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    price: "$49.99",
    learningOutcomes: [
      "Identificar los principales riesgos laborales en entornos industriales.",
      "Aplicar la normativa legal vigente en materia de SST.",
      "Diseñar matrices IPERC (Identificación de Peligros y Evaluación de Riesgos).",
      "Implementar controles operacionales efectivos."
    ],
    syllabus: [
      { title: "Módulo 1: Introducción a la Seguridad Industrial", duration: "2 horas" },
      { title: "Módulo 2: Marco Legal y Normativo", duration: "4 horas" },
      { title: "Módulo 3: Metodología IPERC", duration: "6 horas" },
      { title: "Módulo 4: Medidas de Control y Prevención", duration: "8 horas" }
    ]
  },
  "uso-correcto-epp": {
    title: "Uso Correcto de EPP",
    description: "Capacitación práctica en la selección, uso, mantenimiento y disposición final del Equipo de Protección Personal.",
    fullDescription: "El uso adecuado del Equipo de Protección Personal (EPP) es la última línea de defensa contra los riesgos laborales. Este curso práctico te enseñará a seleccionar el EPP adecuado para cada tarea, cómo usarlo correctamente, mantenerlo y cuándo reemplazarlo.",
    duration: "20 horas",
    level: "Intermedio",
    category: "Equipos",
    rating: 4.9,
    reviews: 856,
    students: 3200,
    lastUpdated: "11/2025",
    language: "Español",
    instructor: {
      name: "Lic. Ana Torres",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Auditora HSEQ",
      bio: "Licenciada en Seguridad e Higiene con amplia experiencia en la implementación de programas de EPP en la industria manufacturera.",
      rating: 4.8,
      reviews: 2100,
      students: 8500,
      courses: 3
    },
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    price: "$29.99",
    learningOutcomes: [
      "Clasificar los diferentes tipos de EPP según el riesgo.",
      "Realizar el ajuste y colocación correcta de equipos.",
      "Inspeccionar el EPP antes, durante y después de su uso.",
      "Establecer programas de mantenimiento y limpieza."
    ],
    syllabus: [
      { title: "Módulo 1: Fundamentos del EPP", duration: "2 horas" },
      { title: "Módulo 2: Protección Auditiva y Visual", duration: "4 horas" },
      { title: "Módulo 3: Protección Respiratoria", duration: "4 horas" },
      { title: "Módulo 4: Protección contra Caídas", duration: "6 horas" }
    ]
  },
  "auditor-interno-45001": {
    title: "Auditor Interno ISO 45001",
    description: "Formación especializada para preparar y ejecutar auditorías internas en sistemas de gestión de seguridad y salud en el trabajo.",
    fullDescription: "Conviértete en un auditor interno certificado bajo la norma ISO 45001:2018. Aprenderás las técnicas de auditoría, cómo planificar, ejecutar y reportar los hallazgos para asegurar la mejora continua del sistema de gestión de SST de tu organización.",
    duration: "60 horas",
    level: "Avanzado",
    category: "Auditoría",
    rating: 4.7,
    reviews: 512,
    students: 1800,
    lastUpdated: "09/2025",
    language: "Español",
    instructor: {
      name: "Dr. Roberto Silva",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      role: "Lead Auditor ISO 45001",
      bio: "Auditor Líder Certificado con más de 20 años de experiencia auditando sistemas integrados de gestión en corporaciones multinacionales.",
      rating: 4.9,
      reviews: 1800,
      students: 5000,
      courses: 2
    },
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    price: "$99.99",
    learningOutcomes: [
      "Interpretar los requisitos de la norma ISO 45001:2018.",
      "Planificar y preparar una auditoría interna efectiva.",
      "Conducir reuniones de apertura y cierre.",
      "Redactar no conformidades y reportes de auditoría claros."
    ],
    syllabus: [
      { title: "Módulo 1: Interpretación de ISO 45001:2018", duration: "10 horas" },
      { title: "Módulo 2: Directrices de Auditoría ISO 19011", duration: "8 horas" },
      { title: "Módulo 3: Planificación y Preparación", duration: "12 horas" },
      { title: "Módulo 4: Ejecución y Reporte (Casos Prácticos)", duration: "15 horas" }
    ]
  }
};

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = coursesData[id as keyof typeof coursesData];

  if (!course) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* ======================== HERO SECTION (Dark Banner) ======================== */}
      <section className="relative bg-slate-950 pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-amber-400 font-medium mb-6">
              <Link href="/" className="hover:text-amber-300 transition-colors">Inicio</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/#cursos" className="hover:text-amber-300 transition-colors">Cursos</Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-slate-400">{course.category}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              {course.description}
            </p>

            {/* Ratings & Stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{course.rating}</span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= Math.floor(course.rating) ? 'fill-current' : 'text-slate-600'}`} />
                  ))}
                </div>
                <span className="text-slate-400 underline decoration-slate-600 hover:text-slate-300 cursor-pointer">
                  ({course.reviews.toLocaleString()} valoraciones)
                </span>
              </div>
              <div className="text-slate-300">
                {course.students.toLocaleString()} estudiantes
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700">
                  Creado por {course.instructor.name}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Última actualización {course.lastUpdated}
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> {course.language}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== MAIN CONTENT ======================== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Learning Outcomes Box */}
            <div className="border border-slate-700/50 bg-surface-secondary/20 p-6 sm:p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Lo que aprenderás</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Profile (Udemy Style) */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Instructor</h2>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-xl font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/30">
                  {course.instructor.name}
                </Link>
                <div className="text-slate-400">{course.instructor.role}</div>
                
                <div className="flex items-center gap-6 mt-2 mb-4">
                  <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-slate-700 shrink-0">
                    <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-3"><Star className="h-4 w-4 text-amber-500" /> {course.instructor.rating} Calificación del instructor</li>
                    <li className="flex items-center gap-3"><Award className="h-4 w-4 text-amber-500" /> {course.instructor.reviews.toLocaleString()} Reseñas</li>
                    <li className="flex items-center gap-3"><UserCheck className="h-4 w-4 text-amber-500" /> {course.instructor.students.toLocaleString()} Estudiantes</li>
                    <li className="flex items-center gap-3"><PlayCircle className="h-4 w-4 text-amber-500" /> {course.instructor.courses} Cursos</li>
                  </ul>
                </div>
                
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {course.instructor.bio}
                </p>
              </div>
            </div>

            {/* Requirements / Description */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Requisitos</h2>
              <ul className="list-disc pl-5 text-slate-300 text-sm space-y-2 mb-8 marker:text-slate-500">
                <li>Conocimientos básicos de operaciones industriales.</li>
                <li>Disposición para aprender y aplicar normativas de seguridad.</li>
                <li>No se requiere experiencia previa en auditorías para cursos básicos.</li>
              </ul>

              <h2 className="text-2xl font-bold text-foreground mb-4">Descripción</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-10">
                {course.fullDescription}
                <br /><br />
                Este programa está diseñado para profesionales que buscan destacar en la gestión de la seguridad, garantizando entornos de trabajo libres de accidentes y cumpliendo con los más altos estándares internacionales.
              </p>
            </div>

            {/* Syllabus Accordion (Temario) */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Contenido del curso</h2>
                <span className="text-sm text-slate-400">{course.syllabus.length} secciones • {course.duration} de duración total</span>
              </div>
              
              <div className="flex flex-col border border-slate-700/50 rounded-xl overflow-hidden bg-surface-secondary/10">
                {course.syllabus.map((module, idx) => (
                  <details key={idx} className="group border-b border-slate-700/50 last:border-b-0">
                    <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer bg-surface/50 hover:bg-surface transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-300 group-open:-rotate-180" />
                        <span className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">{module.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{module.duration}</span>
                    </summary>
                    <div className="p-4 sm:px-12 sm:pb-5 bg-surface-secondary/5 text-sm text-slate-400">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <PlayCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>Lección 1: Introducción a los conceptos clave</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <PlayCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>Lección 2: Casos de estudio y aplicación práctica</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>Material de lectura complementario (PDF)</span>
                        </li>
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <CourseReviews 
              courseRating={course.rating} 
              courseReviewCount={course.reviews} 
              instructorName={course.instructor.name} 
            />

          </div>

          {/* Desktop version of the sticky floating card */}
          <div className="hidden lg:block">
             <div className="sticky top-28 -mt-[420px] w-full max-w-[380px] ml-auto bg-surface rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-30">
                <div className="relative h-56 w-full group cursor-pointer border-b border-slate-700">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 w-full text-center">
                    <span className="text-white font-semibold text-sm drop-shadow-md">Vista previa de este curso</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-3xl font-bold text-foreground mb-6">{course.price}</div>
                  <AddToCartButton 
                    courseId={id} 
                    title={course.title} 
                    price={course.price} 
                    image={course.image} 
                    instructorName={course.instructor.name} 
                  />
                  <Button variant="outline" className="w-full mb-6 h-12 border-slate-600 hover:bg-slate-800">
                    Comprar ahora
                  </Button>
                  <div className="text-center text-xs text-muted mb-6">
                    Garantía de reembolso de 30 días
                  </div>
                  
                  <h4 className="font-semibold text-foreground mb-3">Este curso incluye:</h4>
                  <ul className="space-y-3 text-sm text-slate-300 mb-6">
                    <li className="flex items-center gap-3"><MonitorPlay className="h-4 w-4 text-slate-400" /> {course.duration} de video bajo demanda</li>
                    <li className="flex items-center gap-3"><FileText className="h-4 w-4 text-slate-400" /> 14 recursos descargables</li>
                    <li className="flex items-center gap-3"><Globe className="h-4 w-4 text-slate-400" /> Acceso en dispositivos móviles y TV</li>
                    <li className="flex items-center gap-3"><Award className="h-4 w-4 text-slate-400" /> Certificado de finalización</li>
                  </ul>
                  
                  <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                    <Link href="#" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors underline underline-offset-4 decoration-slate-600">
                      Aplicar cupón
                    </Link>
                  </div>
                </div>
             </div>
          </div>

          {/* Mobile version of the floating card */}
          <div className="block lg:hidden mt-8">
             <div className="w-full bg-surface rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="text-3xl font-bold text-foreground mb-6">{course.price}</div>
                  <AddToCartButton 
                    courseId={id} 
                    title={course.title} 
                    price={course.price} 
                    image={course.image} 
                    instructorName={course.instructor.name} 
                  />
                  <Button variant="outline" className="w-full mb-6 h-12 border-slate-600 hover:bg-slate-800">
                    Comprar ahora
                  </Button>
                  <div className="text-center text-xs text-muted mb-6">
                    Garantía de reembolso de 30 días
                  </div>
                  <div className="border-t border-slate-700 pt-4 text-center">
                    <Link href="#" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors underline underline-offset-4 decoration-slate-600">
                      Aplicar cupón
                    </Link>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-surface px-6 py-10 mt-auto">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted">
          &copy; 2026 PrevenciónTech. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
