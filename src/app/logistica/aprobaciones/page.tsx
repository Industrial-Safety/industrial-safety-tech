"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ClipboardList, Clock, CheckCircle, XCircle, Eye, X, Search,
  Package, DollarSign, PackagePlus,
} from "lucide-react";
import { getRequests, receiveInWarehouse } from "@/services/requestService";

interface PurchaseRequest {
  id: number;
  codigoSolicitud: string;
  fecha: string;
  categoria: string;
  cantidad: number;
  proveedor: string;
  costoEstimado: number;
  justificacion: string;
  estado: string;
}

type Filtro = "TODOS" | "PENDIENTE" | "APROBADO" | "RECHAZADO";

export default function AprobacionesPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [search, setSearch] = useState("");
  const [viewRequest, setViewRequest] = useState<PurchaseRequest | null>(null);
  const [receivingId, setReceivingId] = useState<number | null>(null);
  const [receivedIds, setReceivedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getRequests()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r) => {
    const matchFiltro = filtro === "TODOS" || r.estado?.toUpperCase() === filtro;
    const matchSearch =
      r.codigoSolicitud?.toLowerCase().includes(search.toLowerCase()) ||
      r.categoria?.toLowerCase().includes(search.toLowerCase()) ||
      r.proveedor?.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const handleReceiveInWarehouse = async (req: PurchaseRequest) => {
    setReceivingId(req.id);
    try {
      await receiveInWarehouse({
        codigo: req.codigoSolicitud,
        descripcion: req.categoria,
        stock: req.cantidad,
        estado: "DISPONIBLE",
      });
      setReceivedIds((prev) => new Set(prev).add(req.id));
    } catch (e) {
      alert("Error al registrar en almacén: " + (e as Error).message);
    } finally {
      setReceivingId(null);
    }
  };

  const count = (estado: string) =>
    requests.filter((r) => r.estado?.toUpperCase() === estado).length;

  const statusBadge = (estado: string) => {
    const e = estado?.toUpperCase();
    if (e === "APROBADO")
      return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" />Aprobada</Badge>;
    if (e === "RECHAZADO")
      return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
    return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
  };

  const FILTROS: { key: Filtro; label: string; color: string }[] = [
    { key: "TODOS",     label: `Todos (${requests.length})`,       color: "bg-slate-700 text-slate-200" },
    { key: "PENDIENTE", label: `Pendientes (${count("PENDIENTE")})`, color: "bg-amber-500/20 text-amber-400" },
    { key: "APROBADO",  label: `Aprobadas (${count("APROBADO")})`,  color: "bg-emerald-500/20 text-emerald-400" },
    { key: "RECHAZADO", label: `Rechazadas (${count("RECHAZADO")})`, color: "bg-rose-500/20 text-rose-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/40 to-transparent p-6 rounded-2xl border border-rose-900/30">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-rose-500" />
          Estado de Solicitudes
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-xl">
          Consulta el estado actual de todas las solicitudes de compra enviadas a Gerencia.
        </p>
      </div>

      {/* Filtros + Buscador */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            {FILTROS.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFiltro(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filtro === key ? color + " ring-2 ring-offset-1 ring-offset-slate-900 ring-current" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar solicitud..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border-slate-700 pl-9 text-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Historial de Solicitudes</CardTitle>
          <CardDescription>
            {loading ? "Cargando..." : `${filtered.length} solicitud${filtered.length !== 1 ? "es" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center text-slate-400 py-12">Cargando solicitudes...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No hay solicitudes para este filtro</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      req.estado?.toUpperCase() === "APROBADO" ? "bg-emerald-500/10" :
                      req.estado?.toUpperCase() === "RECHAZADO" ? "bg-rose-500/10" :
                      "bg-amber-500/10"
                    }`}>
                      <Package className={`h-5 w-5 ${
                        req.estado?.toUpperCase() === "APROBADO" ? "text-emerald-400" :
                        req.estado?.toUpperCase() === "RECHAZADO" ? "text-rose-400" :
                        "text-amber-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">{req.categoria}</p>
                      <p className="text-xs text-slate-400">{req.codigoSolicitud} · {req.fecha}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-8 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Cantidad</p>
                      <p className="font-semibold text-slate-200">{req.cantidad} uds.</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Costo</p>
                      <p className="font-semibold text-rose-400">S/ {req.costoEstimado?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Proveedor</p>
                      <p className="font-semibold text-slate-200">{req.proveedor || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {statusBadge(req.estado)}
                    {req.estado?.toUpperCase() === "APROBADO" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={receivingId === req.id || receivedIds.has(req.id)}
                        title={receivedIds.has(req.id) ? "Ya registrado en almacén" : "Recibir en almacén"}
                        className={receivedIds.has(req.id)
                          ? "text-emerald-400 hover:text-emerald-300 hover:bg-slate-700"
                          : "text-rose-400 hover:text-rose-300 hover:bg-slate-700"}
                        onClick={() => handleReceiveInWarehouse(req)}
                      >
                        {receivedIds.has(req.id)
                          ? <CheckCircle className="h-4 w-4" />
                          : <PackagePlus className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                      onClick={() => setViewRequest(req)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Ver Detalle (solo lectura) */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 shadow-2xl rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white">{viewRequest.categoria}</h3>
                <p className="text-xs text-slate-400">{viewRequest.codigoSolicitud}</p>
              </div>
              <button onClick={() => setViewRequest(null)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><Package className="h-3 w-3" /> Cantidad</p>
                    <p className="font-bold text-slate-200 mt-1">{viewRequest.cantidad} uds.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Costo</p>
                    <p className="font-bold text-rose-400 mt-1">S/ {viewRequest.costoEstimado?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Fecha</p>
                    <p className="font-bold text-slate-200 mt-1">{viewRequest.fecha}</p>
                  </div>
                </div>
                {statusBadge(viewRequest.estado)}
              </div>

              {viewRequest.proveedor && (
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                  <p className="text-xs text-slate-400 mb-1">Proveedor</p>
                  <p className="text-sm text-slate-200">{viewRequest.proveedor}</p>
                </div>
              )}

              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <p className="text-xs text-slate-400 mb-1">Justificación</p>
                <p className="text-sm text-slate-300 leading-relaxed">{viewRequest.justificacion}</p>
              </div>

              {/* Banner de estado */}
              <div className={`rounded-lg p-4 border text-sm flex items-center gap-3 ${
                viewRequest.estado?.toUpperCase() === "APROBADO"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : viewRequest.estado?.toUpperCase() === "RECHAZADO"
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              }`}>
                {viewRequest.estado?.toUpperCase() === "APROBADO" && <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />}
                {viewRequest.estado?.toUpperCase() === "RECHAZADO" && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                {viewRequest.estado?.toUpperCase() === "PENDIENTE" && <Clock className="h-5 w-5 text-amber-400 shrink-0" />}
                <p className={
                  viewRequest.estado?.toUpperCase() === "APROBADO" ? "text-emerald-300" :
                  viewRequest.estado?.toUpperCase() === "RECHAZADO" ? "text-rose-300" :
                  "text-amber-300"
                }>
                  {viewRequest.estado?.toUpperCase() === "APROBADO" && "Gerencia aprobó esta solicitud de compra."}
                  {viewRequest.estado?.toUpperCase() === "RECHAZADO" && "Gerencia rechazó esta solicitud de compra."}
                  {viewRequest.estado?.toUpperCase() === "PENDIENTE" && "Esperando revisión de Gerencia General."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between items-center">
              <div>
                {viewRequest.estado?.toUpperCase() === "APROBADO" && (
                  <Button
                    disabled={receivingId === viewRequest.id || receivedIds.has(viewRequest.id)}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white disabled:opacity-60"
                    onClick={() => handleReceiveInWarehouse(viewRequest)}
                  >
                    <PackagePlus className="h-4 w-4 mr-2" />
                    {receivedIds.has(viewRequest.id)
                      ? "Registrado en Almacén"
                      : receivingId === viewRequest.id
                      ? "Registrando..."
                      : "Recibir en Almacén"}
                  </Button>
                )}
              </div>
              <Button variant="ghost" className="text-slate-400" onClick={() => setViewRequest(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
