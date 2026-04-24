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
  Plus,
  Eye,
  Trash2,
  Percent,
  Tag,
  X
} from "lucide-react";

interface Request {
  id: string;
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

const requests: Request[] = [
  {
    id: "SOL-2026-001",
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

export default function MarketingRequestsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState({
    type: "coupon" as "coupon" | "discount",
    promotionName: "",
    courseName: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 20,
    code: "",
    maxUses: 100,
    description: ""
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar a backend
    console.log("Solicitud enviada:", formData);
    setCreateModalOpen(false);
  };

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

  const pendingRequests = requests.filter(r => r.status === "pending");
  const resolvedRequests = requests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Solicitudes de Promoción</h1>
          <p className="text-muted">Envía solicitudes de promociones y cupones para aprobación de Gerencia.</p>
        </div>
        <Button 
          className="bg-pink-500 hover:bg-pink-600 text-white"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-pink-500" />
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
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2 mb-4">
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
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted" />
                      <span className="text-muted">Enviada:</span>
                      <span className="font-medium">{new Date(request.submittedDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-border"
                    onClick={() => { setSelectedRequest(request); setViewModalOpen(true); }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
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
                    onClick={() => { setSelectedRequest(request); setViewModalOpen(true); }}
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

      {/* Create Request Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Nueva Solicitud</h3>
                  <p className="text-xs text-muted">Completa los detalles de la promoción</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
              
              {/* Request Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "coupon" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === "coupon" 
                      ? "border-pink-500 bg-pink-500/10" 
                      : "border-border bg-surface-secondary/30 hover:border-pink-500/50"
                  }`}
                >
                  <Tag className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                  <p className="text-sm font-semibold">Cupón General</p>
                  <p className="text-xs text-muted mt-1">Válido para todos los cursos</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "discount" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === "discount" 
                      ? "border-pink-500 bg-pink-500/10" 
                      : "border-border bg-surface-secondary/30 hover:border-pink-500/50"
                  }`}
                >
                  <Percent className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                  <p className="text-sm font-semibold">Descuento por Curso</p>
                  <p className="text-xs text-muted mt-1">Exclusivo para un curso</p>
                </button>
              </div>

              {/* Promotion Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nombre de la Promoción</label>
                <Input
                  value={formData.promotionName}
                  onChange={(e) => setFormData({ ...formData, promotionName: e.target.value })}
                  placeholder="Ej: Descuento Fin de Semana"
                  className="bg-surface-secondary/50 border-border"
                  required
                />
              </div>

              {/* Course Selection (if discount type) */}
              {formData.type === "discount" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Curso</label>
                  <select
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Selecciona un curso...</option>
                    <option value="Uso Correcto de EPP">Uso Correcto de EPP</option>
                    <option value="Seguridad en Alturas">Seguridad en Alturas</option>
                    <option value="Primeros Auxilios Básicos">Primeros Auxilios Básicos</option>
                    <option value="Manejo de Extintores">Manejo de Extintores</option>
                  </select>
                </div>
              )}

              {/* Discount Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tipo de Descuento</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })}
                    className="flex h-10 w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Valor</label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseInt(e.target.value) || 0 })}
                    className="bg-surface-secondary/50 border-border"
                    required
                  />
                </div>
              </div>

              {/* Code (if coupon type) */}
              {formData.type === "coupon" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Código del Cupón</label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ej: FINDE20"
                    className="bg-surface-secondary/50 border-border font-mono uppercase"
                    required
                  />
                </div>
              )}

              {/* Max Uses */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Usos Máximos</label>
                <Input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                  className="bg-surface-secondary/50 border-border"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Descripción y Justificación</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica el objetivo de esta promoción y por qué debería ser aprobada..."
                  className="flex w-full rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm min-h-[100px]"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <strong>Nota:</strong> Tu solicitud será revisada por Gerencia. Recibirás una notificación cuando sea aprobada o rechazada.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCreateModalOpen(false)}
                  className="hover:bg-surface-secondary"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {viewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  selectedRequest.status === "approved" ? "bg-success/10" : 
                  selectedRequest.status === "rejected" ? "bg-danger/10" : "bg-warning/10"
                }`}>
                  {selectedRequest.status === "approved" ? <CheckCircle className="h-5 w-5 text-success" /> :
                   selectedRequest.status === "rejected" ? <XCircle className="h-5 w-5 text-danger" /> :
                   <Clock className="h-5 w-5 text-warning" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedRequest.promotionName}</h3>
                  <p className="text-xs text-muted">{selectedRequest.id}</p>
                </div>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-2 rounded-lg hover:bg-surface-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Estado</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Tipo</p>
                  <p className="text-sm font-semibold capitalize">{selectedRequest.type}</p>
                </div>
              </div>

              <div className="p-4 bg-surface-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Descuento</p>
                  <p className="text-lg font-bold text-pink-500">
                    {selectedRequest.discountType === "percentage" 
                      ? `${selectedRequest.discountValue}%` 
                      : `$${selectedRequest.discountValue}`}
                  </p>
                </div>
                {selectedRequest.code && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">Código</p>
                    <p className="text-sm font-mono">{selectedRequest.code}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted mb-2">Descripción</p>
                <p className="text-sm">{selectedRequest.description}</p>
              </div>

              {selectedRequest.gerenciaResponse && (
                <div className={`p-4 rounded-lg border ${
                  selectedRequest.status === "approved" 
                    ? "bg-success/5 border-success/20" 
                    : "bg-danger/5 border-danger/20"
                }`}>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                    {selectedRequest.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                    Respuesta de Gerencia
                  </p>
                  <p className="text-sm">{selectedRequest.gerenciaResponse}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end">
              <Button variant="ghost" onClick={() => setViewModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}
