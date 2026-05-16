"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Clock, CheckCircle, XCircle, Plus, Eye,
  Package, Building2, DollarSign, ClipboardList, X, AlertCircle,
} from "lucide-react";
import { getRequests, createRequest, getRequestStats } from "@/services/requestService";

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

interface Stats {
  totalSolicitudes: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  totalCompras: number;
}

const CATEGORIAS = [
  "Guantes de Nitrilo",
  "Cascos de Seguridad",
  "Lentes Protectores",
  "Botas Dieléctricas",
  "Mascarillas N95",
  "Tapones Auditivos",
  "Arneses de Seguridad",
];

export default function SolicitudesPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSolicitudes: 0, pendientes: 0, aprobadas: 0, rechazadas: 0, totalCompras: 0 });
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState<PurchaseRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    categoria: "",
    cantidad: "",
    proveedor: "",
    costoEstimado: "",
    justificacion: "",
  });

  const load = async () => {
    try {
      const [reqs, st] = await Promise.all([getRequests(), getRequestStats()]);
      setRequests(Array.isArray(reqs) ? reqs : []);
      setStats(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createRequest({
        codigoSolicitud: `SC-${Date.now()}`,
        fecha: new Date().toISOString().split("T")[0],
        categoria: form.categoria,
        cantidad: Number(form.cantidad),
        proveedor: form.proveedor,
        costoEstimado: Number(form.costoEstimado),
        justificacion: form.justificacion,
        estado: "PENDIENTE",
      });
      setCreateModalOpen(false);
      setForm({ categoria: "", cantidad: "", proveedor: "", costoEstimado: "", justificacion: "" });
      await load();
    } catch {
      alert("No se pudo enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const pending  = requests.filter((r) => r.estado?.toUpperCase() === "PENDIENTE");
  const resolved = requests.filter((r) => r.estado?.toUpperCase() !== "PENDIENTE");

  const statusBadge = (estado: string) => {
    const e = estado?.toUpperCase();
    if (e === "APROBADO")
      return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" />Aprobada</Badge>;
    if (e === "RECHAZADO")
      return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
    return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-rose-500" />
            Solicitudes de Compra
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Envía solicitudes de adquisición de EPP a Gerencia para su aprobación.
          </p>
        </div>
        <Button
          className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 rounded-full px-6"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Nueva Solicitud
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.totalSolicitudes, color: "text-rose-500", icon: FileText },
          { label: "Pendientes", value: stats.pendientes, color: "text-amber-400", icon: Clock },
          { label: "Aprobadas", value: stats.aprobadas, color: "text-emerald-400", icon: CheckCircle },
          { label: "Rechazadas", value: stats.rechazadas, color: "text-rose-400", icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card key={label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{loading ? "—" : value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pendientes */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          <Clock className="h-5 w-5 text-amber-400" /> Pendientes de Aprobación
        </h2>
        {pending.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-semibold text-slate-300">No hay solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((req) => (
              <Card key={req.id} className="bg-slate-900 border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{req.categoria}</h3>
                        <p className="text-xs text-slate-400">{req.codigoSolicitud} · {req.fecha}</p>
                      </div>
                    </div>
                    {statusBadge(req.estado)}
                  </div>
                  <div className="flex items-center gap-6 text-sm mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Cantidad</p>
                      <p className="font-bold text-slate-200">{req.cantidad} uds.</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Costo estimado</p>
                      <p className="font-bold text-rose-400">S/ {req.costoEstimado?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Proveedor</p>
                      <p className="font-bold text-slate-200">{req.proveedor || "—"}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-700 hover:bg-slate-800 text-slate-300"
                    onClick={() => setViewRequest(req)}
                  >
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Resueltas */}
      {resolved.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-400">
            <CheckCircle className="h-5 w-5" /> Solicitudes Resueltas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resolved.map((req) => (
              <Card key={req.id} className="bg-slate-900/60 border-slate-800 opacity-80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${req.estado?.toUpperCase() === "APROBADO" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                        {req.estado?.toUpperCase() === "APROBADO"
                          ? <CheckCircle className="h-5 w-5 text-emerald-400" />
                          : <XCircle className="h-5 w-5 text-rose-400" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-200">{req.categoria}</h3>
                        <p className="text-xs text-slate-400">{req.cantidad} uds. · S/ {req.costoEstimado?.toFixed(2)}</p>
                      </div>
                    </div>
                    {statusBadge(req.estado)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{req.codigoSolicitud}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400" onClick={() => setViewRequest(req)}>
                      <Eye className="h-3 w-3 mr-1" /> Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Modal Crear */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 shadow-2xl rounded-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Nueva Solicitud de Compra</h3>
                  <p className="text-xs text-slate-400">Será revisada por Gerencia General</p>
                </div>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Categoría EPP</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                  required
                >
                  <option value="">Selecciona una categoría...</option>
                  {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><Package className="h-3 w-3" /> Cantidad</label>
                  <input
                    type="number" min="1"
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    placeholder="0"
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Costo Estimado (S/)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.costoEstimado}
                    onChange={(e) => setForm({ ...form, costoEstimado: e.target.value })}
                    placeholder="0.00"
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><Building2 className="h-3 w-3" /> Proveedor</label>
                <input
                  value={form.proveedor}
                  onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
                  placeholder="Ej. 3M Perú"
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1"><ClipboardList className="h-3 w-3" /> Justificación</label>
                <textarea
                  value={form.justificacion}
                  onChange={(e) => setForm({ ...form, justificacion: e.target.value })}
                  placeholder="Describe la necesidad de compra..."
                  className="flex w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                <p className="text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  La solicitud será enviada a Gerencia General. Recibirás una notificación cuando sea revisada.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <Button type="button" variant="ghost" className="text-slate-400" onClick={() => setCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting} className="bg-rose-500 hover:bg-rose-600 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  {submitting ? "Enviando..." : "Enviar a Gerencia"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Detalle */}
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
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Cantidad</p>
                    <p className="font-bold text-slate-200">{viewRequest.cantidad} uds.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Costo estimado</p>
                    <p className="font-bold text-rose-400">S/ {viewRequest.costoEstimado?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Fecha</p>
                    <p className="font-bold text-slate-200">{viewRequest.fecha}</p>
                  </div>
                </div>
                <div>{statusBadge(viewRequest.estado)}</div>
              </div>
              {viewRequest.proveedor && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Proveedor</p>
                  <p className="text-sm text-slate-200">{viewRequest.proveedor}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 mb-1">Justificación</p>
                <p className="text-sm text-slate-300">{viewRequest.justificacion}</p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <Button variant="ghost" className="text-slate-400" onClick={() => setViewRequest(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
