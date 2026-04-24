"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  MapPin,
  Camera as CameraIcon,
  Eye,
  Download,
  MessageSquare
} from "lucide-react";

interface Appeal {
  id: string;
  detectionId: string;
  workerName: string;
  workerAvatar: string;
  type: string;
  severity: string;
  location: string;
  camera: string;
  date: string;
  time: string;
  reason: string;
  description: string;
  evidenceFile?: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const appeals: Appeal[] = [
  {
    id: "APE-2026-001",
    detectionId: "DET-2026-319",
    workerName: "Alex Rivera",
    workerAvatar: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=100&h=100&fit=crop&crop=faces",
    type: "Ingreso a Zona Restringida",
    severity: "critical",
    location: "Cuarto de Máquinas 2",
    camera: "CAM-12",
    date: "12 Abr 2026",
    time: "14:30 PM",
    reason: "autorizacion-previa",
    description: "Ingresé a la zona con autorización del supervisor Carlos Mendoza para realizar una inspección de emergencia. Tenía el EPP completo pero la IA no registró la autorización previa.",
    evidenceFile: "autorizacion_carlos.pdf",
    status: "pending",
    submittedDate: "13 Abr 2026"
  },
  {
    id: "APE-2026-002",
    detectionId: "DET-2026-105",
    workerName: "María González",
    workerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    type: "Distancia Social / Aglomeración",
    severity: "low",
    location: "Pasillo Principal A",
    camera: "CAM-01",
    date: "05 Mar 2026",
    time: "10:05 AM",
    reason: "falso-positivo",
    description: "Era una reunión de trabajo autorizada en el pasillo. Mantuvimos la distancia requerida pero la IA detectó aglomeración por error.",
    status: "pending",
    submittedDate: "06 Mar 2026"
  },
  {
    id: "APE-2026-003",
    detectionId: "DET-2026-089",
    workerName: "Carlos Mendoza",
    workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    type: "Ausencia de Guantes",
    severity: "high",
    location: "Zona de Almacenamiento",
    camera: "CAM-07",
    date: "01 Mar 2026",
    time: "09:15 AM",
    reason: "equipo-mal-funcionamiento",
    description: "Los guantes se rompieron durante la operación. Reporté el incidente y solicité equipo nuevo inmediatamente.",
    evidenceFile: "reporte_incidente.jpg",
    status: "approved",
    submittedDate: "02 Mar 2026"
  }
];

export default function JefeAppealsPage() {
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning text-black hover:bg-warning/80"><Clock className="h-3 w-3 mr-1" /> Pendiente</Badge>;
      case "approved":
        return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" /> Aprobada</Badge>;
      case "rejected":
        return <Badge className="bg-danger text-white"><XCircle className="h-3 w-3 mr-1" /> Rechazada</Badge>;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">Crítica</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Alta</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-info/10 text-info border-info/30">Leve</Badge>;
      default:
        return null;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "falso-positivo":
        return "Falso Positivo";
      case "equipo-mal-funcionamiento":
        return "Equipo en Mal Estado";
      case "autorizacion-previa":
        return "Autorización Previa";
      case "emergencia":
        return "Emergencia";
      default:
        return "Otro";
    }
  };

  const handleReview = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setReviewModalOpen(true);
    setResolutionNote("");
  };

  const handleResolve = (decision: "approved" | "rejected") => {
    // Aquí iría la lógica para guardar la decisión
    console.log("Resolución:", {
      appealId: selectedAppeal?.id,
      decision,
      note: resolutionNote
    });
    setReviewModalOpen(false);
    setSelectedAppeal(null);
  };

  const pendingAppeals = appeals.filter(a => a.status === "pending");
  const resolvedAppeals = appeals.filter(a => a.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Gavel className="h-8 w-8 text-primary" /> Gestión de Apelaciones
          </h1>
          <p className="text-muted">Revisa y resuelve las apelaciones presentadas por los trabajadores.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Gavel className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Apelaciones</p>
                <p className="text-2xl font-bold">{appeals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted">Pendientes</p>
                <p className="text-2xl font-bold text-warning">{pendingAppeals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Aprobadas</p>
                <p className="text-2xl font-bold text-success">{appeals.filter(a => a.status === "approved").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger/10 rounded-lg">
                <XCircle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-xs text-muted">Rechazadas</p>
                <p className="text-2xl font-bold text-danger">{appeals.filter(a => a.status === "rejected").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pendientes Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Apelaciones Pendientes
        </h2>
        {pendingAppeals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingAppeals.map((appeal) => (
              <Card key={appeal.id} className="bg-surface/60 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={appeal.workerAvatar}
                        alt={appeal.workerName}
                        className="h-12 w-12 rounded-full object-cover border-2 border-border"
                      />
                      <div>
                        <h3 className="font-semibold">{appeal.workerName}</h3>
                        <p className="text-xs text-muted">{appeal.id}</p>
                      </div>
                    </div>
                    {getStatusBadge(appeal.status)}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-muted" />
                      <span className="text-muted">Infracción:</span>
                      <span className="font-medium">{appeal.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted" />
                      <span className="text-muted">Ubicación:</span>
                      <span className="font-medium">{appeal.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted" />
                      <span className="text-muted">Fecha:</span>
                      <span className="font-medium">{appeal.date} - {appeal.time}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-secondary/50 rounded-lg border border-border mb-4">
                    <p className="text-xs font-semibold mb-1">Motivo de apelación:</p>
                    <p className="text-sm text-muted">{getReasonLabel(appeal.reason)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleReview(appeal)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Revisar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">¡No hay apelaciones pendientes!</p>
              <p className="text-sm text-muted mt-1">Todas las apelaciones han sido resueltas.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Resueltas Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
          <CheckCircle className="h-5 w-5" /> Apelaciones Resueltas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {resolvedAppeals.map((appeal) => (
            <Card key={appeal.id} className="bg-surface/30 border-border opacity-80">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={appeal.workerAvatar}
                      alt={appeal.workerName}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-sm">{appeal.workerName}</h3>
                      <p className="text-xs text-muted">{appeal.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(appeal.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Resuelta: {appeal.submittedDate}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleReview(appeal)}>
                    <Eye className="h-3 w-3 mr-1" />
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalOpen && selectedAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary/30 sticky top-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Revisar Apelación</h3>
                  <p className="text-xs text-muted">{selectedAppeal.id} - {selectedAppeal.detectionId}</p>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Worker Info */}
              <div className="flex items-center gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                <img
                  src={selectedAppeal.workerAvatar}
                  alt={selectedAppeal.workerName}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold">{selectedAppeal.workerName}</h4>
                  <p className="text-sm text-muted">Trabajador / Empleado</p>
                  <p className="text-xs text-muted mt-1">Apelación presentada el {selectedAppeal.submittedDate}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedAppeal.status)}
                </div>
              </div>

              {/* Detection Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  Detalles de la Detección
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <div>
                    <p className="text-xs text-muted mb-1">Tipo de Infracción</p>
                    <p className="text-sm font-semibold">{selectedAppeal.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Severidad</p>
                    {getSeverityBadge(selectedAppeal.severity)}
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Ubicación</p>
                    <p className="text-sm font-semibold">{selectedAppeal.location} ({selectedAppeal.camera})</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Fecha y Hora</p>
                    <p className="text-sm font-semibold">{selectedAppeal.date} - {selectedAppeal.time}</p>
                  </div>
                </div>
              </div>

              {/* Appeal Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Información de la Apelación
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <p className="text-xs text-muted mb-1">Motivo</p>
                    <p className="text-sm font-semibold">{getReasonLabel(selectedAppeal.reason)}</p>
                  </div>
                  <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <p className="text-xs text-muted mb-2">Descripción del Trabajador</p>
                    <p className="text-sm">{selectedAppeal.description}</p>
                  </div>
                  {selectedAppeal.evidenceFile && (
                    <div className="flex items-center gap-3 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{selectedAppeal.evidenceFile}</p>
                        <p className="text-xs text-muted">Evidencia adjunta</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Section */}
              {selectedAppeal.status === "pending" ? (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Resolución
                  </h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Escribe tu decisión y justificativo..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-success hover:bg-success/90 text-white"
                        onClick={() => handleResolve("approved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar Apelación
                      </Button>
                      <Button
                        className="flex-1 bg-danger hover:bg-danger/90 text-white"
                        onClick={() => handleResolve("rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Apelación
                      </Button>
                    </div>
                    <p className="text-xs text-muted">
                      Al aprobar, se anulará la infracción y se restaurarán los puntos al trabajador.
                      Al rechazar, la infracción se mantendrá vigente.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Resolución Aplicada
                  </h4>
                  <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <p className="text-sm">
                      Esta apelación fue <strong>{selectedAppeal.status === "approved" ? "APROBADA" : "RECHAZADA"}</strong>.
                    </p>
                    {selectedAppeal.status === "approved" && (
                      <p className="text-xs text-success mt-2">
                        ✓ La infracción ha sido anulada y los puntos restaurados.
                      </p>
                    )}
                    {selectedAppeal.status === "rejected" && (
                      <p className="text-xs text-danger mt-2">
                        ✗ La infracción se mantiene vigente.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end">
              <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Textarea component
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}
