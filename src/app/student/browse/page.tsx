"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

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
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    price: "$49.99",
    isBestseller: true
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
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    price: "$29.99",
    isNew: true
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
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop",
    price: "$99.99",
    isBestseller: false
  },
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
    image: "https://images.unsplash.com/photo-1541888081156-fbd2ca91361b?q=80&w=800&auto=format&fit=crop",
    price: "$39.99",
    isBestseller: true
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
    image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?q=80&w=800&auto=format&fit=crop",
    price: "$59.99",
    isNew: false
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
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    price: "$24.99",
    isBestseller: false
  }
];

export default function StudentBrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section - Udemy Style but modern */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 backdrop-blur-md px-4 py-1.5 text-sm font-semibold">
              <Sparkles className="h-4 w-4 mr-2 text-purple-300" /> ¡Nueva temporada de cursos!
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Lleva tu carrera al <span className="text-purple-400">siguiente nivel</span>
            </h1>
            <p className="text-lg text-purple-100/80 max-w-lg leading-relaxed">
              Explora certificaciones internacionales y especializaciones técnicas diseñadas para los líderes de la industria moderna.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span>+50 nuevos cursos este mes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Award className="h-5 w-5 text-purple-400" />
                <span>Certificados avalados por ISO</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent z-10 rounded-2xl" />
             <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <Image 
                 src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop" 
                 alt="Browsing" 
                 fill 
                 className="object-cover"
               />
             </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="sticky top-20 z-30 flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/50 shadow-lg">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="¿Qué quieres aprender hoy? Ej: Altura, ISO 45001..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Button variant="secondary" className="flex items-center gap-2 whitespace-nowrap bg-slate-800/50 border-slate-700 hover:bg-slate-800">
            <Filter className="h-4 w-4" /> Categorías
          </Button>
          <Button variant="secondary" className="whitespace-nowrap bg-slate-800/50 border-slate-700 hover:bg-slate-800">
            Más Vendidos
          </Button>
          <Button variant="secondary" className="whitespace-nowrap bg-slate-800/50 border-slate-700 hover:bg-slate-800">
            Nuevos
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <div key={index} className="relative group">
            <CardAddToCartButton
              courseId={course.id}
              title={course.title}
              price={course.price}
              image={course.image}
              instructorName={course.instructor.name}
            />
            <Link href={`/cursos/${course.id}`} className="block h-full">
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-surface/50 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
                
                {/* Course Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge variant="secondary" className="w-fit bg-slate-950/70 backdrop-blur-md text-purple-400 border border-purple-500/30 font-bold uppercase text-[10px] tracking-wider">
                      {course.category}
                    </Badge>
                    {course.isBestseller && (
                      <Badge className="w-fit bg-amber-500 text-slate-950 border-none font-bold text-[10px] tracking-wider shadow-lg shadow-amber-500/30">
                        BESTSELLER
                      </Badge>
                    )}
                    {course.isNew && (
                      <Badge className="w-fit bg-emerald-500 text-white border-none font-bold text-[10px] tracking-wider shadow-lg shadow-emerald-500/30">
                        NUEVO
                      </Badge>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 backdrop-blur-[1px] transition-all duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/30 transform scale-75 transition-transform duration-300 group-hover:scale-100">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <CardContent className="relative p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-700">
                      <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">{course.instructor.name}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-400">{course.rating}</span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.floor(course.rating) ? 'fill-current' : 'text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">({course.reviews})</span>
                  </div>

                  <div className="mt-5 mb-6 flex-grow">
                    <div className="text-xl font-extrabold text-foreground">{course.price}</div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-purple-400 font-semibold">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* CTA Strip */}
      <section className="bg-surface border border-purple-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-purple-500/40 transition-colors shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">¿Buscas algo específico?</h2>
            <p className="text-slate-400 max-w-md">Si no encuentras el curso que necesitas, nuestro equipo de soporte puede ayudarte a encontrar la mejor capacitación para tu perfil.</p>
          </div>
          <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white px-8 h-12 rounded-xl transition-all">
            Contactar Soporte
          </Button>
        </div>
      </section>

    </div>
  );
}
