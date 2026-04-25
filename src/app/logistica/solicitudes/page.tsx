"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Clock, CheckCircle2, XCircle, ChevronRight, Download, Filter, Send } from "lucide-react";
import Link from "next/link";

const MOCK_SOLICITUDES = [
  {
    id: "SC-2026-145",
    fecha: "2026-04-24",
    categoria: "Guantes de Nitrilo",
    cantidad: 500,
    costoEstimado: 1250.00,
    estado: "Pendiente",
    proveedor: "3M Perú S.A."
  },
  {
    id: "SC-2026-144",
    fecha: "2026-04-22",
    categoria: "Cascos de Seguridad",
    cantidad: 150,
    costoEstimado: 3400.00,
    estado: "Aprobado",
    proveedor: "MSA Safety"
  },
  {
    id: "SC-2026-141",
    fecha: "2026-04-18",
    categoria: "Botas Dieléctricas",
    cantidad: 80,
    costoEstimado: 4800.00,
    estado: "Rechazado",
    proveedor: "Sodimac Constructor"
  },
  {
    id: "SC-2026-139",
    fecha: "2026-04-15",
    categoria: "Lentes Protectores",
    cantidad: 300,
    costoEstimado: 900.00,
    estado: "Aprobado",
    proveedor: "Seguridad Industrial S.A.C."
  }
];

export default function SolicitudesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Aprobado":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 px-2 py-1"><CheckCircle2 className="w-3 h-3" /> Aprobado</Badge>;
      case "Rechazado":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1 px-2 py-1"><XCircle className="w-3 h-3" /> Rechazado</Badge>;
      case "Pendiente":
      default:
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 px-2 py-1"><Clock className="w-3 h-3" /> Pendiente a Gerencia</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 to-transparent p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8 text-rose-500" />
            Historial de Solicitudes
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Haz seguimiento del estado de las solicitudes de compra enviadas a Gerencia. Descarga los reportes o crea una nueva.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
          <Button 
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-rose-500 hover:bg-rose-600 text-white gap-2 shadow-lg shadow-rose-500/25 border-0 rounded-full px-6"
          >
            {showRequestForm ? "Volver a Solicitudes" : "Nueva Solicitud"}
          </Button>
        </div>
      </div>

      {!showRequestForm ? (
        <Card className="bg-surface/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800/50 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl text-slate-200">Registro de Solicitudes de EPP</CardTitle>
            <CardDescription>Todas las peticiones realizadas en el sistema.</CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Buscar por ID, Categoría o Proveedor..." 
                className="pl-10 bg-slate-900/50 border-slate-700 focus:ring-rose-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-800 shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900/30">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="py-4 text-slate-400 font-medium">ID Solicitud</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium">Fecha</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium">Categoría EPP</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium">Proveedor Sugerido</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium text-right">Costo Estimado</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium text-center">Estado</TableHead>
                <TableHead className="py-4 text-slate-400 font-medium text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SOLICITUDES.filter(s => 
                s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((solicitud) => (
                <TableRow key={solicitud.id} className="border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <TableCell className="py-4 font-mono text-sm text-slate-300">{solicitud.id}</TableCell>
                  <TableCell className="py-4 text-slate-400 text-sm">{new Date(solicitud.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4">
                    <div>
                      <p className="text-slate-200 font-medium">{solicitud.categoria}</p>
                      <p className="text-xs text-slate-500">{solicitud.cantidad} unidades</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-slate-300 text-sm">{solicitud.proveedor}</TableCell>
                  <TableCell className="py-4 text-right text-slate-200 font-mono">
                    ${solicitud.costoEstimado.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {getStatusBadge(solicitud.estado)}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      onClick={() => setSelectedSolicitud(solicitud)}
                    >
                      Ver Detalles <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {MOCK_SOLICITUDES.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                    No se encontraron solicitudes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      ) : (
        /* Purchase Request Form - Premium Layout */
        <Card className="bg-surface/80 border-slate-800 shadow-2xl max-w-4xl mx-auto animate-in zoom-in-95 backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/50 pb-6 bg-slate-900/50 rounded-t-xl">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-rose-500" /> Formulario de Solicitud de Compra
            </CardTitle>
            <CardDescription className="text-base">
              Completa los detalles técnicos y financieros para generar la solicitud. Las solicitudes de alto valor requerirán aprobación de Gerencia General.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-8">
            
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 text-xs">1</span> 
                 Detalles del Equipo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-5 rounded-xl border border-slate-800/50">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">Categoría de EPP</label>
                  <select className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none transition-shadow">
                    <option value="">Seleccionar categoría...</option>
                    <option value="guantes">Guantes de Nitrilo</option>
                    <option value="cascos">Cascos de Seguridad</option>
                    <option value="lentes">Lentes Protectores</option>
                    <option value="botas">Botas Dieléctricas</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">Cantidad (Unidades)</label>
                  <Input type="number" placeholder="Ej. 500" className="h-11 bg-slate-950 border-slate-700 focus:ring-rose-500 rounded-lg px-4" />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 text-xs">2</span> 
                 Información del Proveedor (Sugerido)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-5 rounded-xl border border-slate-800/50">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">Nombre del Proveedor</label>
                  <Input placeholder="Ej. 3M Perú S.A." className="h-11 bg-slate-950 border-slate-700 focus:ring-rose-500 rounded-lg px-4" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">Costo Estimado (Total USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input type="number" placeholder="0.00" className="h-11 bg-slate-950 border-slate-700 focus:ring-rose-500 rounded-lg pl-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 text-xs">3</span> 
                 Justificación y Notas Adicionales
              </h3>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/50">
                <textarea 
                  className="flex w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[120px] resize-y transition-shadow"
                  placeholder="Explica la urgencia técnica. Ej: 'Stock actual en nivel crítico (10 unidades). El consumo proyectado para la parada de planta de este mes requiere al menos 400 unidades para cubrir todas las áreas...'"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800/50 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 w-full sm:w-auto">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-sm text-amber-400 font-medium">SLA de Aprobación: 24-48 hrs hábiles</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => setShowRequestForm(false)} className="w-full sm:w-auto rounded-full hover:bg-slate-800">
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white gap-2 rounded-full px-8 shadow-lg shadow-rose-500/25 border-0">
                  <Send className="w-4 h-4" /> Enviar Solicitud a Gerencia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Modal Overlay */}
      {selectedSolicitud && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" /> Detalle de Solicitud {selectedSolicitud.id}
                  </CardTitle>
                  <CardDescription>
                    Creada el {new Date(selectedSolicitud.fecha).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedSolicitud(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Categoría Solicitada</p>
                  <p className="text-base text-slate-200">{selectedSolicitud.categoria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Estado de Aprobación</p>
                  {getStatusBadge(selectedSolicitud.estado)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Cantidad</p>
                  <p className="text-base text-slate-200">{selectedSolicitud.cantidad} unidades</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Costo Total Estimado</p>
                  <p className="text-base text-rose-400 font-mono">${selectedSolicitud.costoEstimado.toFixed(2)} USD</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1">Proveedor Sugerido</p>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                    {selectedSolicitud.proveedor}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1">Justificación Técnica</p>
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 text-sm italic">
                    "El stock actual se encuentra por debajo del mínimo de seguridad establecido. Se requiere reposición urgente para asegurar el abastecimiento del personal de planta durante el próximo trimestre. Las certificaciones de calidad de este proveedor ya han sido validadas por SST."
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50 rounded-b-xl">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setSelectedSolicitud(null)}>
                Cerrar
              </Button>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white gap-2 border-0">
                <Download className="w-4 h-4" /> Exportar PDF
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
