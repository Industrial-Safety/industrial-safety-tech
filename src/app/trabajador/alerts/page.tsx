"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, AlertTriangle, Info, Camera, Clock, X, Upload, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}

function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="text-sm font-semibold text-foreground"
      {...props}
    />
  );
}

interface Detection {
  id: string;
  date: string;
  time: string;
  type: string;
  severity: string;
  location: string;
  camera: string;
  status: "pending" | "reviewed" | "disputed" | "resolved";
  image: string;
}

const AI_DETECTIONS: Detection[] = [
  {
    id: "DET-2026-402",
    date: "17 Abr 2026",
    time: "08:14 AM",
    type: "Ausencia de Casco",
    severity: "high",
    location: "Zona de Carga B",
    camera: "CAM-04",
    status: "reviewed",
    image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?w=400&h=300&fit=crop"
  },
  {
    id: "DET-2026-319",
    date: "12 Abr 2026",
    time: "14:30 PM",
    type: "Ingreso a Zona Restringida",
    severity: "critical",
    location: "Cuarto de Máquinas 2",
    camera: "CAM-12",
    status: "pending",
    image: "https://images.unsplash.com/photo-1582214307525-ee9ebc82f939?w=400&h=300&fit=crop"
  },
  {
    id: "DET-2026-105",
    date: "05 Mar 2026",
    time: "10:05 AM",
    type: "Distancia Social / Aglomeración",
    severity: "low",
    location: "Pasillo Principal A",
    camera: "CAM-01",
    status: "disputed",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
  }
];

export default function AlertsPage() {
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    evidence: null as File | null
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30"><AlertTriangle className="mr-1 h-3 w-3" /> Crítica</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><AlertTriangle className="mr-1 h-3 w-3" /> Alta</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30"><Info className="mr-1 h-3 w-3" /> Leve</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning text-black hover:bg-warning/80">Pendiente de Revisión</Badge>;
      case 'reviewed':
        return <Badge className="bg-success text-white hover:bg-success/80">Validada por Supervisor</Badge>;
      case 'disputed':
        return <Badge variant="secondary" className="bg-surface-secondary text-foreground">En Disputa</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-white">Resuelta</Badge>;
      default:
        return null;
    }
  };

  const handleAppealClick = (detection: Detection) => {
    setSelectedDetection(detection);
    setAppealModalOpen(true);
    setAppealSubmitted(false);
    setFormData({ reason: "", description: "", evidence: null });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppealSubmitted(true);
    // Aquí iría la lógica para enviar la apelación al backend
    console.log("Apelación enviada:", { detection: selectedDetection, ...formData });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, evidence: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-danger" /> Mis Alertas y Detecciones IA
        </h1>
        <p className="text-muted">Historial de infracciones de seguridad detectadas automáticamente por el sistema de visión artificial.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* KPI Cards */}
        <Card className="bg-surface/50 border-danger/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Alertas Críticas</h3>
            <p className="text-4xl font-bold text-danger">1</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-warning/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Faltas de EPP</h3>
            <p className="text-4xl font-bold text-warning">1</p>
          </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Puntaje Actual</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground">92</p>
              <p className="text-sm font-medium text-danger">-8 pts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader>
          <CardTitle>Historial de Detecciones</CardTitle>
          <CardDescription>
            Si crees que una detección es un falso positivo, puedes iniciar una disputa para revisión manual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[100px]">ID / Evidencia</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Tipo de Infracción</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AI_DETECTIONS.map((det) => (
                    <TableRow key={det.id} className="border-border hover:bg-surface-secondary/30">
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-[10px] uppercase font-mono text-muted">{det.id}</span>
                          <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border group cursor-pointer">
                            <img src={det.image} alt="Evidencia" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{det.date}</span>
                          <span className="flex items-center gap-1 text-xs text-muted mt-0.5"><Clock className="h-3 w-3" /> {det.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{det.type}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{det.location}</span>
                          <span className="text-xs text-muted flex items-center gap-1 mt-0.5"><Camera className="h-3 w-3" /> {det.camera}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(det.severity)}</TableCell>
                      <TableCell>{getStatusBadge(det.status)}</TableCell>
                      <TableCell className="text-right">
                        {det.status === 'pending' || det.status === 'reviewed' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => handleAppealClick(det)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Apelar / Disputar
                          </Button>
                        ) : det.status === 'disputed' ? (
                          <Button disabled variant="outline" size="sm" className="h-8 text-xs border-border/10 opacity-50">
                            En Revisión
                          </Button>
                        ) : (
                          <Button disabled variant="outline" size="sm" className="h-8 text-xs border-border/10 opacity-50">
                            Cerrada
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appeal Modal */}
      {appealModalOpen && selectedDetection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Apelar Detección</h3>
                  <p className="text-xs text-muted">{selectedDetection.id} - {selectedDetection.type}</p>
                </div>
              </div>
              <button
                onClick={() => setAppealModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {appealSubmitted ? (
                /* Success State */
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">¡Apelación Enviada!</h4>
                  <p className="text-muted mb-6">
                    Tu apelación ha sido registrada y será revisada por el Jefe de Seguridad. Recibirás una notificación cuando se resuelva.
                  </p>
                  <Button onClick={() => setAppealModalOpen(false)} className="bg-primary hover:bg-primary/90">
                    Volver a las Alertas
                  </Button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  
                  {/* Detection Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <div>
                      <p className="text-xs text-muted mb-1">Fecha y Hora</p>
                      <p className="text-sm font-semibold">{selectedDetection.date} - {selectedDetection.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Ubicación</p>
                      <p className="text-sm font-semibold">{selectedDetection.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Tipo de Infracción</p>
                      <p className="text-sm font-semibold">{selectedDetection.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Severidad</p>
                      <div>{getSeverityBadge(selectedDetection.severity)}</div>
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo de la Apelación *</Label>
                    <select
                      id="reason"
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <option value="">Selecciona un motivo...</option>
                      <option value="falso-positivo">Falso Positivo (No era yo / Error de IA)</option>
                      <option value="equipo-mal-funcionamiento">Equipo en Mal Funcionamiento</option>
                      <option value="autorizacion-previa">Autorización Previa del Supervisor</option>
                      <option value="emergencia">Situación de Emergencia</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción Detallada *</Label>
                    <Textarea
                      id="description"
                      required
                      placeholder="Explica detalladamente por qué consideras que esta detección es incorrecta o debería ser revisada..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  {/* Evidence Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="evidence">Evidencia Adjunta (Opcional)</Label>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center bg-black/10 hover:bg-surface-secondary/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        id="evidence"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted" />
                      <p className="text-sm font-medium">
                        {formData.evidence ? formData.evidence.name : "Arrastra tu archivo o haz clic para subir"}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Fotos, documentos o cualquier evidencia que respalde tu apelación (PDF, JPG, PNG)
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs text-muted">
                      <strong>Nota:</strong> Las apelaciones son revisadas por el Jefe de Seguridad en un plazo máximo de 48 horas hábiles. 
                      Proporciona tanta información como sea posible para agilizar el proceso.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setAppealModalOpen(false)}
                      className="hover:bg-surface-secondary"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Apelación
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
