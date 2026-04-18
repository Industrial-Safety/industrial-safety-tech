"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HardHat, Shield, CloudUpload, CheckCircle, AlertTriangle, XCircle, Camera } from "lucide-react";

// Mock Data
const ASSIGNED_EQUIPMENT = [
  { id: "epp-001", name: "Casco de Seguridad ABS", status: "approved", lastCheck: "15 Abr 2026", nextCheck: "15 Oct 2026", image: "https://images.unsplash.com/photo-1579621970233-aefbd922880a?w=400&h=400&fit=crop" },
  { id: "epp-002", name: "Lentes de Policarbonato", status: "pending", lastCheck: "--", nextCheck: "Requiere evidencia", image: "https://images.unsplash.com/photo-1549449033-9366479fdfa7?w=400&h=400&fit=crop" },
  { id: "epp-003", name: "Botas Dieléctricas Cat. 3", status: "rejected", lastCheck: "10 Ene 2026", nextCheck: "Reemplazo Urgente", image: null },
  { id: "epp-004", name: "Chaleco Reflectivo", status: "approved", lastCheck: "01 Mar 2026", nextCheck: "01 Sep 2026", image: "https://images.unsplash.com/photo-1621255562719-74d6423d24ab?w=400&h=400&fit=crop" },
];

export default function EquipmentPage() {
  const [selectedEq, setSelectedEq] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-danger" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary" /> Control de EPP
          </h1>
          <p className="text-muted">Gestiona y reporta el estado de tu Equipo de Protección Personal.</p>
        </div>
        <Button className="shrink-0 gap-2 shadow-lg shadow-primary/20">
          <CloudUpload className="h-4 w-4" /> Sincronizar Evaluaciones
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Equipment List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Indumentaria Asignada</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {ASSIGNED_EQUIPMENT.map((eq) => (
              <Card 
                key={eq.id} 
                className={`cursor-pointer transition-all border-2 overflow-hidden group ${selectedEq === eq.id ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-border/50 hover:border-primary/50'}`}
                onClick={() => setSelectedEq(eq.id)}
              >
                <div className="flex h-32">
                  <div className="w-1/3 min-w-[100px] bg-surface-secondary/50 relative border-r border-border/50">
                     {eq.image ? (
                        <img src={eq.image} alt={eq.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/20 text-muted">
                           <Shield className="h-8 w-8 opacity-20" />
                        </div>
                     )}
                     <div className="absolute top-2 left-2 z-10 bg-surface/80 p-0.5 rounded-full backdrop-blur-md shadow-sm">
                       {getStatusIcon(eq.status)}
                     </div>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <p className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{eq.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted font-mono">{eq.id}</p>
                    </div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] py-0 h-5 mt-2
                          ${eq.status === 'approved' && 'text-success border-success/30 bg-success/5'}
                          ${eq.status === 'pending' && 'text-warning border-warning/30 bg-warning/5'}
                          ${eq.status === 'rejected' && 'text-danger border-danger/30 bg-danger/5'}
                        `}
                      >
                        {eq.status === 'approved' && 'Óptimas Condiciones'}
                        {eq.status === 'pending' && 'Pendiente Revisión'}
                        {eq.status === 'rejected' && 'Recomendado Cambio'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Panel */}
        <div className="lg:col-span-1">
           <Card className="bg-surface/50 border-border sticky top-6">
            <CardHeader className="border-b border-border/50 bg-black/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" /> Evidencia EPP
              </CardTitle>
              <CardDescription>
                Sube fotos de tu equipo actual para la validación por IA/Supervisor.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {!selectedEq ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-surface-secondary/20">
                   <HardHat className="h-12 w-12 text-muted mb-4 opacity-50" />
                   <p className="text-sm font-medium text-foreground">Selecciona un equipo</p>
                   <p className="text-xs text-muted mt-2">Haz clic en un ítem de tu inventario para subir o actualizar su evidencia.</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-primary">Equipo Seleccionado:</p>
                    <p className="text-base font-semibold">{ASSIGNED_EQUIPMENT.find(e => e.id === selectedEq)?.name}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-primary/40 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <CloudUpload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-semibold mb-1">Arrastra tu foto aquí</p>
                    <p className="text-xs text-muted">Soporta JPG, PNG (Max 5MB)</p>
                    <Button variant="outline" size="sm" className="mt-4 border-primary/50 hover:bg-primary/20">
                      Examinar Archivos
                    </Button>
                  </div>
                  
                  <div className="mt-6 bg-surface-secondary/50 rounded-lg p-4 border border-border/50">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Instrucciones de Captura</h4>
                    <ul className="text-xs space-y-2 text-foreground/80">
                      <li className="flex gap-2 items-start"><CheckCircle className="h-3 w-3 text-success shrink-0 mt-0.5" /> Asegúrate de buena iluminación.</li>
                      <li className="flex gap-2 items-start"><CheckCircle className="h-3 w-3 text-success shrink-0 mt-0.5" /> El equipo debe estar completo en la foto.</li>
                      <li className="flex gap-2 items-start"><CheckCircle className="h-3 w-3 text-success shrink-0 mt-0.5" /> Muestra partes sujetas a desgaste (correas, micas, suelas).</li>
                    </ul>
                  </div>

                  <Button className="w-full mt-6 bg-primary text-black font-bold hover:bg-primary/90 shadow-md">
                    Subir Evidencia a S3
                  </Button>
                </div>
              )}
              
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
