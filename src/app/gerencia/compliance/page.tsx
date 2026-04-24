"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock Data
const COMPLIANCE_RECORDS = [
  { id: "EMP-001", name: "Carlos Mendoza", dept: "Mantenimiento", course: "100%", epp: "Aprobado", status: "compliant", date: "10 Abr 2026" },
  { id: "EMP-045", name: "Ana Torres", dept: "Operaciones B", course: "60%", epp: "Pendiente", status: "non-compliant", date: "15 Abr 2026" },
  { id: "EMP-112", name: "Luis Ruiz", dept: "Almacén Central", course: "100%", epp: "Rechazado", status: "warning", date: "20 Abr 2026" },
  { id: "EMP-089", name: "Sofía Castro", dept: "Logística", course: "100%", epp: "Aprobado", status: "compliant", date: "12 Abr 2026" },
  { id: "EMP-204", name: "Miguel Rojas", dept: "Operaciones B", course: "40%", epp: "Aprobado", status: "non-compliant", date: "22 Abr 2026" },
];

export default function CompliancePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-emerald-500" /> Auditoría de Cumplimiento
          </h1>
          <p className="text-muted">Estado legal y formativo del personal operativo e inspectores.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-900/20">
          <Download className="h-4 w-4" /> Exportar Matriz
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
         <Card className="bg-success/5 border-success/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-success mb-1">Personal en Regla</p>
                     <h3 className="text-3xl font-bold text-success">385</h3>
                  </div>
                  <div className="p-3 bg-success/20 rounded-full"><CheckCircle className="h-6 w-6 text-success"/></div>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-danger/5 border-danger/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-danger mb-1">Brecha Formativa</p>
                     <h3 className="text-3xl font-bold text-danger">42</h3>
                  </div>
                  <div className="p-3 bg-danger/20 rounded-full"><XCircle className="h-6 w-6 text-danger"/></div>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-warning/5 border-warning/20">
            <CardContent className="p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-warning mb-1">Problemas de EPP</p>
                     <h3 className="text-3xl font-bold text-warning">23</h3>
                  </div>
                  <div className="p-3 bg-warning/20 rounded-full"><AlertTriangle className="h-6 w-6 text-warning"/></div>
               </div>
            </CardContent>
         </Card>
      </div>

      <Card className="bg-surface border-border shadow-sm">
         <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <CardTitle className="text-lg">Matriz de Cumplimiento General</CardTitle>
                  <CardDescription>Detalle por empleado sobre capacitaciones.</CardDescription>
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                     <Input placeholder="Buscar empleado..." className="pl-9 bg-surface-secondary/50 border-border/50" />
                  </div>
                  <Button variant="outline" className="border-border/50 px-3">
                     <Filter className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-surface-secondary/30 border-b border-border/50">
                     <tr>
                        <th className="px-6 py-4 font-semibold">Empleado</th>
                        <th className="px-6 py-4 font-semibold">Departamento</th>
                        <th className="px-6 py-4 font-semibold">Avance Cursos</th>
                        <th className="px-6 py-4 font-semibold">Estado EPP</th>
                        <th className="px-6 py-4 font-semibold">Última Auditoría</th>
                        <th className="px-6 py-4 font-semibold text-right">Estado</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                     {COMPLIANCE_RECORDS.map((row, i) => (
                        <tr key={i} className="hover:bg-surface-secondary/20 transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-medium text-foreground">{row.name}</div>
                              <div className="text-xs text-muted font-mono mt-0.5">{row.id}</div>
                           </td>
                           <td className="px-6 py-4 text-muted-foreground">{row.dept}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-16 h-2 bg-black/20 rounded-full overflow-hidden">
                                    <div 
                                       className={`h-full ${row.course === '100%' ? 'bg-success' : 'bg-warning'}`} 
                                       style={{ width: row.course }}
                                    ></div>
                                 </div>
                                 <span className="text-xs font-semibold">{row.course}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <Badge variant="outline" className={
                                 row.epp === 'Aprobado' ? 'text-success border-success/30' : 
                                 row.epp === 'Pendiente' ? 'text-warning border-warning/30' : 
                                 'text-danger border-danger/30'
                              }>
                                 {row.epp}
                              </Badge>
                           </td>
                           <td className="px-6 py-4 text-muted-foreground text-xs">{row.date}</td>
                           <td className="px-6 py-4 text-right">
                              {row.status === 'compliant' && <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">Conforme</Badge>}
                              {row.status === 'warning' && <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border-0">Observado</Badge>}
                              {row.status === 'non-compliant' && <Badge className="bg-danger/10 text-danger hover:bg-danger/20 border-0">No Conforme</Badge>}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

    </div>
  );
}
