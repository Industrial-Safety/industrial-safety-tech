"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LandingNav from "@/components/layout/landing-nav";
import { CardAddToCartButton } from "@/components/courses/card-add-to-cart-button";
import {
  Star,
  PlayCircle,
  Clock,
  BookOpen,
  Filter,
  Search,
  Image as ImageIcon,
} from "lucide-react";

interface CourseFromAPI {
  id?: string;
  _id?: string;
  title: string;
  subtitle: string;
  coverImageUrl?: string;
  teacher: { id: string; name: string; profession: string };
  details: {
    language: string;
    level: string;
    totalDurationHorus: number;
    totalLecture: number;
    precio: number;
    lastUpdated: string;
  };
  reviews: { averageRating: number; totalReviews: number };
}

const COLS = 3;
const ROW_HEIGHT = 420; // approximate card height + gap

function CourseCard({ course }: { course: CourseFromAPI }) {
  const courseId = course._id ?? course.id ?? "";
  const price = course.details?.precio ? `$${course.details.precio.toFixed(2)}` : "$0.00";
  const rating = course.reviews?.averageRating ?? 0;
  const reviewCount = course.reviews?.totalReviews ?? 0;
  const duration = course.details?.totalDurationHorus
    ? `${course.details.totalDurationHorus} h`
    : "—";
  const level = course.details?.level ?? "Básico";

  return (
    <div className="relative group">
      <CardAddToCartButton
        courseId={courseId}
        title={course.title}
        price={price}
        image={course.coverImageUrl ?? ""}
        instructorName={course.teacher?.name ?? "Instructor"}
      />
      <Link href={`/cursos/${courseId}`} className="block h-full">
        <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/50 bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20">
          <div className="relative h-48 w-full overflow-hidden bg-slate-800 flex items-center justify-center">
            {course.coverImageUrl ? (
              <img
                src={course.coverImageUrl}
                alt={course.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <ImageIcon className="h-16 w-16 text-slate-600 transition-transform duration-700 group-hover:scale-110" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-slate-950/60 backdrop-blur-md text-amber-400 border border-amber-500/30">
                {level}
              </Badge>
            </div>
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
            <div className="mt-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-amber-400">
                  {(course.teacher?.name ?? "I").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300 leading-none">{course.teacher?.name ?? "Instructor"}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{course.teacher?.profession ?? ""}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-bold text-amber-400">{rating.toFixed(1)}</span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.floor(rating) ? "fill-current" : "text-slate-600"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({reviewCount})</span>
            </div>
            <p className="mt-4 mb-6 flex-grow text-sm text-muted line-clamp-2">{course.subtitle}</p>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-slate-500" />
                <span>{duration}</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{price}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function CatalogPage() {
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/proxy/course")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    search.trim() === "" ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.subtitle?.toLowerCase().includes(search.toLowerCase())
  );

  // Group into rows of COLS for window virtualizer
  const rows: CourseFromAPI[][] = [];
  for (let i = 0; i < filtered.length; i += COLS) {
    rows.push(filtered.slice(i, i + COLS));
  }

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />

      {/* Header */}
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cursos, certificaciones, normas..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <Button variant="secondary" className="flex items-center gap-2 whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">
                <Filter className="h-4 w-4" /> Categorías
              </Button>
              <Button variant="secondary" className="whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">Nivel</Button>
              <Button variant="secondary" className="whitespace-nowrap bg-slate-800 border-slate-700 hover:bg-slate-700">Duración</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10 flex-grow">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {loading ? "Cargando cursos..." : `Todos los cursos (${filtered.length})`}
            </h2>
            <div className="text-sm text-slate-400">
              Ordenar por:{" "}
              <span className="font-semibold text-slate-200 cursor-pointer hover:text-amber-400">
                Más populares
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <BookOpen className="h-16 w-16 text-slate-700 mb-4" />
              <p className="text-xl font-semibold text-slate-400">No hay cursos disponibles aún</p>
              <p className="text-sm text-slate-600 mt-2">Los instructores están preparando el contenido.</p>
            </div>
          ) : (
            <div
              ref={listRef}
              style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                    }}
                  >
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                      {row.map((course) => (
                        <CourseCard key={course._id ?? course.id} course={course} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-surface px-6 py-10 mt-auto">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted">
          &copy; 2026 PrevenciónTech. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
