import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LandingNav from "@/components/layout/landing-nav";
import { CardAddToCartButton } from "@/components/courses/card-add-to-cart-button";
import {
  ShieldCheck,
  UserCheck,
  FileSignature,
  Star,
  PlayCircle,
  Clock,
  GraduationCap,
  Search,
  Filter,
  Image as ImageIcon
} from "lucide-react";

// Mock data to match what's in page.tsx
const courses = [
  {
    id: "prevencion-riesgos",
    title: "Prevención de Riesgos Laborales",
    description: "Curso fundamental sobre normativas de seguridad, identificación de peligros, y control de riesgos en la industria.",
    duration: "40 horas",
    level: "Básico",
    category: "Normativas",
    rating: 4.8,
    reviews: 1240,
    instructor: {
      name: "Ing. Carlos Mendoza",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Especialista en SST",
    },
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    price: "$49.99",
  },
  {
    id: "uso-correcto-epp",
    title: "Uso Correcto de EPP",
    description: "Capacitación práctica en la selección, uso, mantenimiento y disposición final del Equipo de Protección Personal.",
    duration: "20 horas",
    level: "Intermedio",
    category: "Equipos",
    rating: 4.9,
    reviews: 856,
    instructor: {
      name: "Lic. Ana Torres",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Auditora HSEQ",
    },
    icon: UserCheck,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    price: "$29.99",
  },
  {
    id: "auditor-interno-45001",
    title: "Auditor Interno ISO 45001",
    description: "Formación especializada para preparar y ejecutar auditorías internas en sistemas de gestión de seguridad y salud en el trabajo.",
    duration: "60 horas",
    level: "Avanzado",
    category: "Auditoría",
    rating: 4.7,
    reviews: 512,
    instructor: {
      name: "Dr. Roberto Silva",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      role: "Lead Auditor ISO 45001",
    },
    icon: FileSignature,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    price: "$99.99",
  },
  // Adding a few more mock courses to make the catalog look full
  {
    id: "trabajos-altura",
    title: "Seguridad en Trabajos en Altura",
    description: "Técnicas, normativas y uso de arneses para operaciones seguras en altura.",
    duration: "16 horas",
    level: "Intermedio",
    category: "Operaciones",
    rating: 4.9,
    reviews: 2150,
    instructor: {
      name: "Téc. Luis Ramos",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg",
      role: "Instructor de Rescate",
    },
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1541888081156-fbd2ca91361b?q=80&w=800&auto=format&fit=crop",
    price: "$39.99",
  },
  {
    id: "espacios-confinados",
    title: "Ingreso a Espacios Confinados",
    description: "Procedimientos de seguridad, medición de gases y rescate en espacios reducidos.",
    duration: "24 horas",
    level: "Avanzado",
    category: "Operaciones",
    rating: 4.8,
    reviews: 930,
    instructor: {
      name: "Ing. Sofia Castro",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "Ingeniera de Seguridad",
    },
    icon: UserCheck,
    image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=800&auto=format&fit=crop",
    price: "$59.99",
  },
  {
    id: "liderazgo-seguridad",
    title: "Liderazgo y Cultura de Seguridad",
    description: "Cómo desarrollar un liderazgo efectivo para promover una cultura de prevención de cero accidentes.",
    duration: "12 horas",
    level: "Básico",
    category: "Gestión",
    rating: 4.6,
    reviews: 425,
    instructor: {
      name: "Mg. Fernando Ruiz",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      role: "Consultor Organizacional",
    },
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    price: "$24.99",
  }
];

export default function CatalogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-surface-secondary/30 border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Catálogo de <span className="text-amber-400">Cursos</span>
            </h1>
            <p className="text-lg text-slate-400">
              Explora nuestra amplia selección de programas de capacitación en seguridad industrial. 
              Desarrollados por expertos para garantizar el cumplimiento normativo y proteger vidas.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar cursos, certificaciones, normas..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Button variant="secondary" className="flex items-center gap-2 whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">
                <Filter className="h-4 w-4" /> Categorías
              </Button>
              <Button variant="secondary" className="whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">
                Nivel
              </Button>
              <Button variant="secondary" className="whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">
                Duración
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Todos los cursos ({courses.length})</h2>
            <div className="text-sm text-slate-400">
              Ordenar por: <span className="font-semibold text-slate-200 cursor-pointer hover:text-amber-400">Más populares</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <div key={index} className="relative group">
                <CardAddToCartButton
                  courseId={course.id}
                  title={course.title}
                  price={course.price ?? "$49.99"}
                  image={course.image}
                  instructorName={course.instructor.name}
                />
                <Link href={`/cursos/${course.id}`} className="block h-full">
                  <Card
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20"
                  >
                    {/* Main Course Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-slate-600 transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-slate-950/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                          {course.category}
                        </Badge>
                      </div>

                      {/* Play Button Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 transform scale-75 transition-transform duration-300 group-hover:scale-100">
                          <PlayCircle className="h-7 w-7" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="relative p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-amber-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Instructor Info */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-slate-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">{course.instructor.name}</span>
                      </div>

                      {/* Rating */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-400">{course.rating}</span>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${star <= Math.floor(course.rating) ? 'fill-current' : 'text-slate-600'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">({course.reviews})</span>
                      </div>

                      <p className="mt-4 mb-6 flex-grow text-sm text-muted line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                          <GraduationCap className="h-4 w-4" />
                          <span>{course.level}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <Button variant="outline" className="border-slate-700 text-foreground hover:bg-slate-800 px-8 py-6 rounded-xl font-medium">
              Cargar más cursos
            </Button>
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
