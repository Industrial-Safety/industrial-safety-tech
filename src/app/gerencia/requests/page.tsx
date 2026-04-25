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
  Users,
  Package,
  Truck
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

interface LogisticsRequest {
  id: string;
  requestedBy: string;
  requestedByEmail: string;
  category: string;
  quantity: number;
  estimatedCost: number;
  supplier: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  gerenciaResponse?: string;
  resolvedDate?: string;
}

const marketingRequests: MarketingRequest[] = [
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

const logisticsRequests: LogisticsRequest[] = [
  {
    id: "LOG-2026-145",
    requestedBy: "Carlos Ruiz",
    requestedByEmail: "carlos.ruiz@prevenciontech.com",
    category: "Guantes de Nitrilo",
    quantity: 500,
    estimatedCost: 1250.00,
    supplier: "3M Perú S.A.",
    description: "Reposición urgente de guantes de nitrilo. Stock actual en nivel crítico (10 unidades). El consumo proyectado para la parada de planta requiere al menos 400 unidades.",
    status: "pending",
    submittedDate: "2026-04-24"
  },
  {
    id: "LOG-2026-144",
    requestedBy: "Carlos Ruiz",
    requestedByEmail: "carlos.ruiz@prevenciontech.com",
    category: "Cascos de Seguridad Tipo 1",
    quantity: 150,
    estimatedCost: 3400.00,
    supplier: "MSA Safety",
    description: "Reposición trimestral de cascos para el personal de planta. Los cascos actuales tienen más de 2 años de uso.",
    status: "approved",
    submittedDate: "2026-04-22",
    gerenciaResponse: "Aprobado. Coordinar entrega con almacén para la próxima semana.",
    resolvedDate: "2026-04-23"
  },
  {
    id: "LOG-2026-141",
    requestedBy: "Carlos Ruiz",
    requestedByEmail: "carlos.ruiz@prevenciontech.com",
    category: "Botas Dieléctricas",
    quantity: 80,
    estimatedCost: 4800.00,
    supplier: "Sodimac Constructor",
    description: "Compra de botas dieléctricas para el nuevo personal de mantenimiento.",
    status: "rejected",
    submittedDate: "2026-04-18",
    gerenciaResponse: "El costo unitario es muy elevado. Solicitar cotización a otros proveedores.",
    resolvedDate: "2026-04-19"
  }
];

export default function GerenciaRequestsPage() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MarketingRequest | LogisticsRequest | null>(null);
  const [requestType, setRequestType] = useState<"marketing" | "logistics" | null>(null);
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

  const handleReviewMarketing = (request: MarketingRequest) => {
    setSelectedRequest(request);
    setRequestType("marketing");
    setReviewModalOpen(true);
    setResolutionNote("");
  };

  const handleReviewLogistics = (request: LogisticsRequest) => {
    setSelectedRequest(request);
    setRequestType("logistics");
    setReviewModalOpen(true);
    setResolutionNote("");
  };

  const handleResolve = (decision: "approved" | "rejected") => {
    console.log("Resolución:", {
      requestId: selectedRequest?.id,
      requestType,
      decision,
      note: resolutionNote
    });

    if (selectedRequest) {
      selectedRequest.status = decision;
      selectedRequest.gerenciaResponse = resolutionNote;
      selectedRequest.resolvedDate = new Date().toISOString().split('T')[0];
    }

    setReviewModalOpen(false);
    setSelectedRequest(null);
    setRequestType(null);
  };

  const pendingMarketingRequests = marketingRequests.filter(r => r.status === "pending");
  const resolvedMarketingRequests = marketingRequests.filter(r => r.status !== "pending");
  const pendingLogisticsRequests = logisticsRequests.filter(r => r.status === "pending");
  const resolvedLogisticsRequests = logisticsRequests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-teal-500" /> Solicitudes de Gerencia
          </h1>
          <p className="text-muted">Revisa y aprueba las solicitudes de Marketing y Logística.</p>
        </div>
      </div>

      {/* Stats - Marketing */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-pink-500" /> Marketing
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-xs text-muted">Total</p>
                  <p className="text-2xl font-bold">{marketingRequests.length}</p>
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
                  <p className="text-2xl font-bold text-warning">{pendingMarketingRequests.length}</p>
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
                  <p className="text-2xl font-bold text-success">{marketingRequests.filter(r => r.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold text-danger">{marketingRequests.filter(r => r.status === "rejected").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Marketing Requests Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Pendientes de Marketing
        </h2>
        {pendingMarketingRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingMarketingRequests.map((request) => (
              <Card key={request.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-pink-500" />
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
                    onClick={() => handleReviewMarketing(request)}
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
              <p className="font-semibold">¡No hay solicitudes de Marketing pendientes!</p>
              <p className="text-sm text-muted mt-1">Todas las solicitudes han sido procesadas.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Logistics Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-rose-500" /> Logística
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-surface/40 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <Package className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs text-muted">Total</p>
                  <p className="text-2xl font-bold">{logisticsRequests.length}</p>
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
                  <p className="text-2xl font-bold text-warning">{pendingLogisticsRequests.length}</p>
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
                  <p className="text-2xl font-bold text-success">{logisticsRequests.filter(r => r.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold text-danger">{logisticsRequests.filter(r => r.status === "rejected").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Logistics Requests Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" /> Pendientes de Logística
        </h2>
        {pendingLogisticsRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingLogisticsRequests.map((request) => (
              <Card key={request.id} className="bg-surface/60 border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.category}</h3>
                        <p className="text-xs text-muted">{request.id}</p>
                        <p className="text-xs text-muted mt-1">Solicitado por: {request.requestedBy}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted" />
                      <span className="text-muted">Cantidad:</span>
                      <span className="font-medium">{request.quantity} uds</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Percent className="h-4 w-4 text-muted" />
                      <span className="text-muted">Costo estimado:</span>
                      <span className="font-medium text-rose-400">${request.estimatedCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted" />
                      <span className="text-muted">Proveedor:</span>
                      <span className="font-medium">{request.supplier}</span>
                    </div>
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
                    className="w-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                    onClick={() => handleReviewLogistics(request)}
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
              <p className="font-semibold">¡No hay solicitudes de Logística pendientes!</p>
              <p className="text-sm text-muted mt-1">Todas las solicitudes han sido procesadas.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Resolved Marketing Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
          <CheckCircle className="h-5 w-5" /> Marketing - Solicitudes Resueltas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedMarketingRequests.map((request) => (
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
                    onClick={() => handleReviewMarketing(request)}
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

      {/* Resolved Logistics Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
          <CheckCircle className="h-5 w-5" /> Logística - Solicitudes Resueltas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedLogisticsRequests.map((request) => (
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
                      <h3 className="font-semibold text-sm">{request.category}</h3>
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
                    onClick={() => handleReviewLogistics(request)}
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
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  requestType === "logistics" ? "bg-rose-500/10" : "bg-teal-500/10"
                }`}>
                  <span className={`font-bold text-lg ${
                    requestType === "logistics" ? "text-rose-500" : "text-teal-500"
                  }`}>
                    {selectedRequest.requestedBy.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </span>
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

              {/* Marketing Request Details */}
              {requestType === "marketing" && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-500" />
                    Detalles de la Solicitud
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <div>
                      <p className="text-xs text-muted mb-1">Tipo</p>
                      <p className="text-sm font-semibold capitalize">{(selectedRequest as MarketingRequest).type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Descuento</p>
                      <p className="text-lg font-bold text-teal-500">
                        {(selectedRequest as MarketingRequest).discountType === "percentage"
                          ? `${(selectedRequest as MarketingRequest).discountValue}%`
                          : `$${(selectedRequest as MarketingRequest).discountValue}`}
                      </p>
                    </div>
                    {(selectedRequest as MarketingRequest).code && (
                      <div>
                        <p className="text-xs text-muted mb-1">Código</p>
                        <p className="text-sm font-mono font-semibold">{(selectedRequest as MarketingRequest).code}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted mb-1">Usos Máximos</p>
                      <p className="text-sm font-semibold">{(selectedRequest as MarketingRequest).maxUses}</p>
                    </div>
                    {(selectedRequest as MarketingRequest).courseName && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted mb-1">Curso</p>
                        <p className="text-sm font-semibold">{(selectedRequest as MarketingRequest).courseName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Logistics Request Details */}
              {requestType === "logistics" && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-rose-500" />
                    Detalles de la Solicitud
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-surface-secondary/30 rounded-lg border border-border">
                    <div>
                      <p className="text-xs text-muted mb-1">Categoría</p>
                      <p className="text-sm font-semibold">{(selectedRequest as LogisticsRequest).category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Cantidad</p>
                      <p className="text-lg font-bold text-rose-500">{(selectedRequest as LogisticsRequest).quantity} uds</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Costo Estimado</p>
                      <p className="text-sm font-semibold text-rose-400">${(selectedRequest as LogisticsRequest).estimatedCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1">Proveedor</p>
                      <p className="text-sm font-semibold">{(selectedRequest as LogisticsRequest).supplier}</p>
                    </div>
                  </div>
                </div>
              )}

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
                      {requestType === "logistics" 
                        ? "Al aprobar, se generará la orden de compra. Al rechazar, Logística deberá enviar una nueva solicitud."
                        : "Al aprobar, se generará automáticamente el cupón o descuento solicitado. Al rechazar, Marketing deberá enviar una nueva solicitud."
                      }
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
