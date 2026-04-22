"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock Data
const EPP_REQUESTS = [
  {
    id: "REQ-001",
    worker: "Alex Rivera",
    role: "Operario / Empaque",
    equipment: "Botas Dieléctricas Cat. 3",
    status: "pending",
    date: "22 Abr 2026",
    reason: "Suela desgastada y perforación en bota derecha",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" // Mock image
  },
  {
    id: "REQ-002",
    worker: "María Gómez",
    role: "Técnico de Mantenimiento",
    equipment: "Casco de Seguridad ABS",
    status: "approved",
    date: "20 Abr 2026",
    reason: "Impacto recibido, requiere cambio por normativa",
    image: "https://images.unsplash.com/photo-1579621970233-aefbd922880a?w=400&h=400&fit=crop"
  },
  {
    id: "REQ-003",
    worker: "Juan Pérez",
    role: "Operario de Planta",
    equipment: "Lentes de Policarbonato",
    status: "rejected",
    date: "18 Abr 2026",
    reason: "Rayaduras menores, no impide la visibilidad",
    image: "https://images.unsplash.com/photo-1549449033-9366479fdfa7?w=400&h=400&fit=crop"
  }
];

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredRequests = EPP_REQUESTS.filter(req => {
    const matchesSearch = req.worker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/5 gap-1"><Clock className="h-3 w-3"/> Pendiente</Badge>;
      case 'approved': 
        return <Badge variant="outline" className="text-success border-success/30 bg-success/5 gap-1"><CheckCircle className="h-3 w-3"/> Aprobado</Badge>;
      case 'rejected': 
        return <Badge variant="outline" className="text-danger border-danger/30 bg-danger/5 gap-1"><XCircle className="h-3 w-3"/> Rechazado</Badge>;
      default: 
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" /> Solicitudes de EPP
          </h1>
          <p className="text-muted">Gestiona los reportes de daño y solicitudes de reemplazo de indumentaria.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-surface/50 p-4 rounded-xl border border-border/50">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Buscar por trabajador, equipo o ID..." 
            className="pl-9 bg-surface-secondary/50 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button 
            variant={filterStatus === "all" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("all")}
            className={filterStatus === "all" ? "bg-primary text-black" : "border-border/50"}
          >
            Todos
          </Button>
          <Button 
            variant={filterStatus === "pending" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={filterStatus === "pending" ? "bg-warning text-black" : "border-border/50"}
          >
            Pendientes
          </Button>
          <Button 
            variant={filterStatus === "approved" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("approved")}
            className={filterStatus === "approved" ? "bg-success text-white" : "border-border/50"}
          >
            Aprobados
          </Button>
          <Button 
            variant={filterStatus === "rejected" ? "primary" : "outline"} 
            size="sm"
            onClick={() => setFilterStatus("rejected")}
            className={filterStatus === "rejected" ? "bg-danger text-white" : "border-border/50"}
          >
            Rechazados
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {filteredRequests.map(req => (
          <Card key={req.id} className="border-border/50 bg-surface overflow-hidden hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row h-full">
              <div className="sm:w-48 h-48 sm:h-auto bg-surface-secondary relative shrink-0">
                <img src={req.image} alt={req.equipment} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 z-10 bg-surface/90 backdrop-blur-sm p-1 rounded-md shadow-sm">
                  {getStatusBadge(req.status)}
                </div>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{req.worker}</h3>
                      <p className="text-xs text-muted font-mono">{req.id} • {req.date}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold">Equipo Reportado</p>
                      <p className="text-sm font-medium">{req.equipment}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold">Motivo del Reporte</p>
                      <p className="text-sm italic text-foreground/80 bg-surface-secondary/30 p-2 rounded-md border border-border/20 mt-1">"{req.reason}"</p>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button className="flex-1 bg-success hover:bg-success/90 text-white gap-2">
                      <CheckCircle className="h-4 w-4" /> Aprobar
                    </Button>
                    <Button variant="outline" className="flex-1 text-danger border-danger/20 hover:bg-danger/10 hover:text-danger gap-2">
                      <XCircle className="h-4 w-4" /> Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {filteredRequests.length === 0 && (
          <div className="xl:col-span-2 p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-surface/30">
            <Filter className="h-12 w-12 text-muted mb-4 opacity-50" />
            <p className="text-lg font-medium">No se encontraron solicitudes</p>
            <p className="text-sm text-muted">Ajusta los filtros de búsqueda para ver más resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
