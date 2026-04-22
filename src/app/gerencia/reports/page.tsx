"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileBarChart, 
  Download,
  Calendar,
  FileText,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

const REPORTS = [
  { id: "REP-2026-04", name: "Reporte Ejecutivo HSE - Abril 2026", type: "Mensual", date: "30 Abr 2026", size: "2.4 MB" },
  { id: "REP-2026-03", name: "Reporte Ejecutivo HSE - Marzo 2026", type: "Mensual", date: "31 Mar 2026", size: "2.1 MB" },
  { id: "REP-Q1-2026", name: "Balance Trimestral Q1 - 2026", type: "Trimestral", date: "31 Mar 2026", size: "5.8 MB" },
  { id: "AUD-2026-01", name: "Auditoría Externa OSHA - Resultado", type: "Auditoría", date: "15 Feb 2026", size: "12.5 MB" },
  { id: "REP-2026-02", name: "Reporte Ejecutivo HSE - Febrero 2026", type: "Mensual", date: "28 Feb 2026", size: "2.2 MB" },
  { id: "REP-2026-01", name: "Reporte Ejecutivo HSE - Enero 2026", type: "Mensual", date: "31 Ene 2026", size: "2.3 MB" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <FileBarChart className="h-8 w-8 text-emerald-500" /> Reportes Oficiales
          </h1>
          <p className="text-muted">Centro de descargas de informes ejecutivos y resultados de auditorías.</p>
        </div>
        <Button className="bg-primary text-black hover:bg-primary/90 gap-2 font-semibold shadow-lg">
          <Calendar className="h-4 w-4" /> Generar Reporte Personalizado
        </Button>
      </div>

      <Card className="bg-surface border-border shadow-sm">
         <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <CardTitle className="text-lg">Historial de Documentos</CardTitle>
                  <CardDescription>Formatos PDF firmados digitalmente, listos para impresión o junta de directorio.</CardDescription>
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                     <Input placeholder="Buscar reporte..." className="pl-9 bg-surface-secondary/50 border-border/50" />
                  </div>
                  <Button variant="outline" className="border-border/50 px-3">
                     <Filter className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="divide-y divide-border/50">
               {REPORTS.map((report) => (
                  <div key={report.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 hover:bg-surface-secondary/30 transition-colors">
                     <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                           <FileText className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                           <h4 className="font-bold text-foreground">{report.name}</h4>
                           <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                              <span className="font-mono">{report.id}</span>
                              <span>•</span>
                              <span>{report.date}</span>
                              <span>•</span>
                              <span>{report.size}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Badge variant="outline" className={
                           report.type === 'Mensual' ? 'border-primary/30 text-primary' : 
                           report.type === 'Trimestral' ? 'border-blue-500/30 text-blue-500' : 
                           'border-purple-500/30 text-purple-500'
                        }>
                           {report.type}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-border/50 hover:bg-surface hover:text-emerald-500 ml-auto sm:ml-0 gap-2">
                           <Download className="h-4 w-4" /> Descargar
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
      
    </div>
  );
}
