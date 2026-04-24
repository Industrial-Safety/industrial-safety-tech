"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Tag,
  Percent,
  Calendar,
  Users
} from "lucide-react";

interface MarketingRequest {
  id: string;
  requestedBy: string;
  requestedByEmail: string;
  type: "coupon" | "discount";
  courseName?: string;
  promotionName: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  code?: string;
  maxUses: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  gerenciaResponse?: string;
  resolvedDate?: string;
}

const requests: MarketingRequest[] = [
  {
    id: "SOL-2026-001",
    requestedBy: "Laura Martínez",
    requestedByEmail: "laura.martinez@prevenciontech.com",
    type: "coupon",
    promotionName: "Cupón Fin de Semana",
    discountType: "fixed",
    discountValue: 20,
    code: "FINDE20",
    maxUses: 150,
    description: "Cupón promocional para impulsar ventas de fin de semana en todos los cursos.",
    status: "pending",
    submittedDate: "2026-04-20"
  },
  {
    id: "SOL-2026-002",
    requestedBy: "Laura Martínez",
    requestedByEmail: "laura.martinez@prevenciontech.com",
    type: "discount",
    courseName: "Uso Correcto de EPP",
    promotionName: "Descuento EPP Abril",
    discountType: "percentage",
    discountValue: 25,
    maxUses: 100,
    description: "Descuento exclusivo para el curso de EPP por campaña de concientización.",
    status: "approved",
    submittedDate: "2026-04-15",
    gerenciaResponse: "Aprobado. Excelente iniciativa para impulsar el curso más importante.",
    resolvedDate: "2026-04-16"
  },
  {
    id: "SOL-2026-003",
    requestedBy: "Laura Martínez",
    requestedByEmail: "laura.martinez@prevenciontech.com",
    type: "discount",
    courseName: "Seguridad en Alturas",
    promotionName: "Flash Sale Alturas",
    discountType: "percentage",
    discountValue: 40,
    maxUses: 50,
    description: "Promoción flash por 24 horas para el curso de alturas.",
    status: "rejected",
    submittedDate: "2026-04-10",
    gerenciaResponse: "El descuento es muy alto y afecta el margen de ganancia. Máximo 25%.",
    resolvedDate: "2026-04-11"
  }
];

export default function GerenciaRequestsPage() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MarketingRequest | null>(null);
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

  const handleReview = (request: MarketingRequest) => {
    setSelectedRequest(request);
    setReviewModalOpen(true);
    setResolutionNote("");
  };

  const handleResolve = (decision: "approved" | "rejected") => {
    // Aquí iría la lógica para guardar la decisión
    console.log("Resolución:", {
      requestId: selectedRequest?.id,
      decision,
      note: resolutionNote
    });
    
    // Simular actualización
    if (selectedRequest) {
      selectedRequest.status = decision;
      selectedRequest.gerenciaResponse = resolutionNote;
      selectedRequest.resolvedDate = new Date().toISOString().split('T')[0];
    }
    
    setReviewModalOpen(false);
    setSelectedRequest(null);
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const resolvedRequests = requests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-teal-500" /> Solicitudes de Marketing
          </h1>
          <p className="text-muted">Revisa y aprueba las solicitudes de promociones y cupones del equipo de Marketing.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Solicitudes</p>
                <p className="text-2xl font-bold">{requests.length}</p>
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
                <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
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
                <p className="text-2xl font-bold text-success">{requests.filter(r => r.status === "approved").length}</p>
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
                <p className="text-2xl font-bold text-danger">{requests.filter(r => r.status === "rejected").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Pendientes de Aprobación
        </h2>
        {pendingRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.promotionName}</h3>
                        <p className="text-xs text-muted">{request.id}</p>
                        <p className="text-xs text-muted mt-1">Solicitado por: {request.requestedBy}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-muted" />
                      <span className="text-muted">Tipo:</span>
                      <span className="font-medium capitalize">{request.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Percent className="h-4 w-4 text-muted" />
                      <span className="text-muted">Descuento:</span>
                      <span className="font-medium">
                        {request.discountType === "percentage" ? `${request.discountValue}%` : `$${request.discountValue}`}
                      </span>
                    </div>
                    {request.type === "coupon" && request.code && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-muted" />
                        <span className="text-muted">Código:</span>
                        <span className="font-mono font-semibold">{request.code}</span>
                      </div>
                    )}
                    {request.courseName && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted" />
                        <span className="text-muted">Curso:</span>
                        <span className="font-medium">{request.courseName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted" />
                      <span className="text-muted">Enviada:</span>
                      <span className="font-medium">{new Date(request.submittedDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-secondary/30 rounded-lg border border-border mb-4">
                    <p className="text-xs text-muted line-clamp-2">{request.description}</p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-teal-500/30 text-teal-500 hover:bg-teal-500/10"
                    onClick={() => handleReview(request)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Revisar Solicitud
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="font-semibold">¡No hay solicitudes pendientes!</p>
              <p className="text-sm text-muted mt-1">Todas las solicitudes han sido procesadas.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Resolved Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
          <CheckCircle className="h-5 w-5" /> Solicitudes Resueltas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {resolvedRequests.map((request) => (
            <Card key={request.id} className="bg-surface/30 border-border opacity-80">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      request.status === "approved" ? "bg-success/10" : "bg-danger/10"
                    }`}>
                      {request.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-danger" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{request.promotionName}</h3>
                      <p className="text-xs text-muted">{request.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Resuelta: {request.resolvedDate && new Date(request.resolvedDate).toLocaleDateString('es-ES')}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => handleReview(request)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Review Modal */}
      {reviewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  selectedRequest.status === "pending" ? "bg-warning/10" :
                  selectedRequest.status === "approved" ? "bg-success/10" : "bg-danger/10"
                }`}>
                  {selectedRequest.status === "pending" ? <Clock className="h-5 w-5 text-warning" /> :
                   selectedRequest.status === "approved" ? <CheckCircle className="h-5 w-5 text-success" /> :
                   <XCircle className="h-5 w-5 text-danger" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">Revisar Solicitud</h3>
                  <p className="text-xs text-muted">{selectedRequest.id}</p>
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
              
              {/* Requester Info */}
              <div className="flex items-center gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <span className="text-teal-500 font-bold text-lg">LM</span>
                </div>
                <div>
                  <h4 className="font-bold">{selectedRequest.requestedBy}</h4>
                  <p className="text-xs text-muted">{selectedRequest.requestedByEmail}</p>
                  <p className="text-xs text-muted mt-1">Solicitado el {new Date(selectedRequest.submittedDate).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-500" />
                  Detalles de la Solicitud
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <div>
                    <p className="text-xs text-muted mb-1">Tipo</p>
                    <p className="text-sm font-semibold capitalize">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Descuento</p>
                    <p className="text-lg font-bold text-teal-500">
                      {selectedRequest.discountType === "percentage" 
                        ? `${selectedRequest.discountValue}%` 
                        : `$${selectedRequest.discountValue}`}
                    </p>
                  </div>
                  {selectedRequest.code && (
                    <div>
                      <p className="text-xs text-muted mb-1">Código</p>
                      <p className="text-sm font-mono font-semibold">{selectedRequest.code}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted mb-1">Usos Máximos</p>
                    <p className="text-sm font-semibold">{selectedRequest.maxUses}</p>
                  </div>
                  {selectedRequest.courseName && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted mb-1">Curso</p>
                      <p className="text-sm font-semibold">{selectedRequest.courseName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-teal-500" />
                  Descripción
                </h4>
                <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Resolution Section */}
              {selectedRequest.status === "pending" ? (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-teal-500" />
                    Decisión de Gerencia
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
                        Aprobar Solicitud
                      </Button>
                      <Button
                        className="flex-1 bg-danger hover:bg-danger/90 text-white"
                        onClick={() => handleResolve("rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Solicitud
                      </Button>
                    </div>
                    <p className="text-xs text-muted">
                      Al aprobar, se generará automáticamente el cupón o descuento solicitado.
                      Al rechazar, Marketing deberá enviar una nueva solicitud.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Resolución Aplicada
                  </h4>
                  <div className={`p-4 rounded-lg border ${
                    selectedRequest.status === "approved" 
                      ? "bg-success/5 border-success/20" 
                      : "bg-danger/5 border-danger/20"
                  }`}>
                    <p className="text-sm">
                      Esta solicitud fue <strong>{selectedRequest.status === "approved" ? "APROBADA" : "RECHAZADA"}</strong>.
                    </p>
                    {selectedRequest.gerenciaResponse && (
                      <div className="mt-3 p-3 bg-surface/50 rounded-lg">
                        <p className="text-xs text-muted mb-1">Comentario:</p>
                        <p className="text-sm">{selectedRequest.gerenciaResponse}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted mt-2">
                      Resuelta el {selectedRequest.resolvedDate && new Date(selectedRequest.resolvedDate).toLocaleDateString('es-ES')}
                    </p>
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

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}
