"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = [
  { id: "S-101", name: "Carlos Díaz", role: "Operador de Planta", course: "Uso Correcto de EPP", progress: 100, time: "2h 15m", score: 95, status: "completed", date: "15 Abr 2026" },
  { id: "S-102", name: "Ana Torres", role: "Supervisor HSE", course: "Uso Correcto de EPP", progress: 60, time: "1h 10m", score: null, status: "in-progress", date: "--" },
  { id: "S-103", name: "Luis Mendoza", role: "Técnico Mantenimiento", course: "Trabajo en Alturas", progress: 100, time: "3h 45m", score: 65, status: "failed", date: "12 Abr 2026" },
  { id: "S-104", name: "Marta Gómez", role: "Operador de Planta", course: "Gestión de Residuos", progress: 30, time: "45m", score: null, status: "in-progress", date: "--" },
  { id: "S-105", name: "Pedro Silva", role: "Contratista", course: "Protocolo de Evacuación", progress: 0, time: "0m", score: null, status: "not-started", date: "--" },
  { id: "S-106", name: "Julia Ramírez", role: "Técnico Eléctrico", course: "Riesgo Eléctrico", progress: 100, time: "4h 20m", score: 100, status: "completed", date: "10 Abr 2026" },
];

export default function AnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Auditoría del Alumnado</h1>
          <p className="text-muted">Rastrea el progreso y calificaciones de los trabajadores inscritos en tus cursos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-surface">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="bg-surface/50 border-border overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-secondary/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input 
              placeholder="Buscar por nombre o curso..." 
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <select className="flex h-10 w-full sm:w-auto rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option>Todos los Cursos</option>
                <option>Uso Correcto de EPP</option>
                <option>Trabajo en Alturas</option>
             </select>
             <Button variant="outline" size="icon" className="shrink-0">
               <Filter className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted font-semibold uppercase bg-surface-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1">Alumno <ArrowUpDown className="h-3 w-3 cursor-pointer"/></div></th>
                <th className="px-6 py-4 whitespace-nowrap">Curso</th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1">Progreso <ArrowUpDown className="h-3 w-3 cursor-pointer"/></div></th>
                <th className="px-6 py-4 whitespace-nowrap">Nota Examen</th>
                <th className="px-6 py-4 whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Fecha Cert.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-surface-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{student.name}</div>
                    <div className="text-[10px] text-muted">{student.role}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{student.course}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-40">
                      <span className="text-xs font-semibold w-8">{student.progress}%</span>
                      <div className="h-1.5 flex-1 bg-surface-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", student.progress === 100 ? "bg-success" : "bg-primary")} 
                          style={{ width: `${student.progress}%` }} 
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-muted mt-1">Tiempo inv: {student.time}</div>
                  </td>

                  <td className="px-6 py-4">
                    {student.score !== null ? (
                      <span className={cn(
                        "font-bold", 
                        student.score >= 80 ? "text-success" : "text-danger flex items-center gap-1"
                      )}>
                        {student.score < 80 && <AlertCircle className="h-3 w-3" />}
                        {student.score}/100
                      </span>
                    ) : (
                      <span className="text-muted">--</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase tracking-wider",
                      student.status === 'completed' ? "border-success/30 text-success bg-success/5" :
                      student.status === 'failed' ? "border-danger/30 text-danger bg-danger/5" :
                      student.status === 'not-started' ? "border-muted/30 text-muted" :
                      "border-primary/30 text-primary bg-primary/5"
                    )}>
                      {student.status === 'completed' ? 'Aprobado' :
                       student.status === 'failed' ? 'Reprobado' :
                       student.status === 'not-started' ? 'Sin Iniciar' : 'En Curso'}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-right text-muted">{student.date}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    No se encontraron registros de alumnos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface-secondary/20">
           <p className="text-xs text-muted">Mostrando 1 a {filteredStudents.length} de {MOCK_STUDENTS.length} resultados</p>
           <div className="flex gap-1">
             <Button variant="outline" size="icon" className="h-8 w-8" disabled><ChevronLeft className="h-4 w-4" /></Button>
             <Button variant="outline" size="icon" className="h-8 w-8 text-primary border-primary bg-primary/10">1</Button>
             <Button variant="outline" size="icon" className="h-8 w-8">2</Button>
             <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
           </div>
        </div>

      </Card>
      
    </div>
  );
}
