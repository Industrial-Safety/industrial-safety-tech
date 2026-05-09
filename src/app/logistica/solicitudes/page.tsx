"use client";

import { useState, useEffect } from "react";
import {
  getRequests,
  createRequest,
  updateRequest
} from "@/services/requestService";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  Check,
  X
} from "lucide-react";

export default function SolicitudesPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [solicitudes, setSolicitudes] = useState([]);

  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const [formData, setFormData] = useState({
    categoria: "",
    cantidad: "",
    proveedor: "",
    costoEstimado: "",
    justificacion: ""
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {

      const data = await getRequests();

      console.log("Solicitudes:", data);

      setSolicitudes(data);

    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleCreateRequest = async () => {

    try {

      const nuevaSolicitud = {
        codigoSolicitud: `SC-${Date.now()}`,
        fecha: new Date().toISOString().split("T")[0],
        categoria: formData.categoria,
        cantidad: Number(formData.cantidad),
        proveedor: formData.proveedor,
        costoEstimado: Number(formData.costoEstimado),
        justificacion: formData.justificacion,
        estado: "PENDIENTE"
      };

      await createRequest(nuevaSolicitud);

      await loadRequests();

      setFormData({
        categoria: "",
        cantidad: "",
        proveedor: "",
        costoEstimado: "",
        justificacion: ""
      });

      setShowRequestForm(false);

    } catch (error) {
      console.error("Error creando solicitud:", error);
    }
  };

  const handleUpdateStatus = async (id, nuevoEstado) => {
  try {

    const solicitud = solicitudes.find((s) => s.id === id);

    const updatedRequest = {
      ...solicitud,
      estado: nuevoEstado
    };

    await updateRequest(id, updatedRequest);

    await loadRequests();

    setSelectedSolicitud(updatedRequest);

  } catch (error) {
    console.error("Error actualizando estado:", error);
  }
};

  const getStatusBadge = (estado) => {

    switch (estado?.toUpperCase()) {

      case "APROBADO":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Aprobado
          </Badge>
        );

      case "RECHAZADO":
        return (
          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );

      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  const filteredSolicitudes = solicitudes.filter(
    (s) =>
      s.codigoSolicitud?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.proveedor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-rose-500" />
          Solicitudes de Compra
        </h1>

        <Button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-rose-500 hover:bg-rose-600"
        >
          {showRequestForm ? "Cancelar" : "Nueva Solicitud"}
        </Button>

      </div>

      {showRequestForm && (

        <Card className="bg-slate-900 border-slate-800">

          <CardHeader>

            <CardTitle>Nueva Solicitud</CardTitle>

            <CardDescription>
              Completa los datos para registrar una compra
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">

            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 text-white border border-slate-700"
            >
              <option value="">Selecciona categoría</option>
              <option>Guantes de Nitrilo</option>
              <option>Cascos de Seguridad</option>
              <option>Botas Dieléctricas</option>
              <option>Lentes Protectores</option>
            </select>

            <Input
              name="cantidad"
              type="number"
              placeholder="Cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white"
            />

            <Input
              name="proveedor"
              placeholder="Proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white"
            />

            <Input
              name="costoEstimado"
              type="number"
              placeholder="Costo estimado"
              value={formData.costoEstimado}
              onChange={handleChange}
              className="bg-slate-800 border-slate-700 text-white"
            />

            <textarea
              name="justificacion"
              placeholder="Justificación"
              value={formData.justificacion}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white min-h-[120px]"
            />

            <Button
              onClick={handleCreateRequest}
              className="bg-emerald-600 hover:bg-emerald-700 w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>

          </CardContent>

        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">

        <CardHeader>

          <CardTitle>Historial</CardTitle>

          <CardDescription>
            Solicitudes registradas
          </CardDescription>

          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />

        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredSolicitudes.map((solicitud) => (

                <TableRow key={solicitud.codigoSolicitud}>

                  <TableCell>{solicitud.codigoSolicitud}</TableCell>

                  <TableCell>{solicitud.categoria}</TableCell>

                  <TableCell>{solicitud.proveedor}</TableCell>

                  <TableCell>{solicitud.cantidad}</TableCell>

                  <TableCell>
                    ${solicitud.costoEstimado}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(solicitud.estado)}
                  </TableCell>

                  <TableCell>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 hover:bg-slate-800"
                      onClick={() => {
                        console.log("Solicitud seleccionada:", solicitud);
                        setSelectedSolicitud(solicitud);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detalles
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

          {filteredSolicitudes.length === 0 && (

            <p className="text-center text-slate-400 py-6">
              No hay solicitudes registradas
            </p>

          )}

        </CardContent>

      </Card>

      {selectedSolicitud && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

          <Card className="w-full max-w-3xl bg-slate-950 border border-slate-800 shadow-2xl">

            <CardHeader className="border-b border-slate-800 flex flex-row items-start justify-between">

              <div>

                <CardTitle className="text-3xl text-white flex items-center gap-3">

                  <FileText className="w-7 h-7 text-rose-500" />

                  Detalle de Solicitud

                </CardTitle>

                <CardDescription className="mt-2 text-slate-400">

                  Código: {selectedSolicitud?.codigoSolicitud || "N/A"}

                </CardDescription>

              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSolicitud(null)}
                className="hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </Button>

            </CardHeader>

            <CardContent className="space-y-8 p-8">

              <div className="grid grid-cols-2 gap-8">

                <div>

                  <p className="text-slate-500 text-sm mb-2">
                    Categoría Solicitada
                  </p>

                  <p className="text-2xl font-semibold text-white">
                    {selectedSolicitud?.categoria || "Sin categoría"}
                  </p>

                </div>

                <div>

                  <p className="text-slate-500 text-sm mb-2">
                    Estado
                  </p>

                  {getStatusBadge(selectedSolicitud?.estado)}

                </div>

                <div>

                  <p className="text-slate-500 text-sm mb-2">
                    Cantidad
                  </p>

                  <p className="text-xl text-white">
                    {selectedSolicitud?.cantidad || 0} unidades
                  </p>

                </div>

                <div>

                  <p className="text-slate-500 text-sm mb-2">
                    Costo Estimado
                  </p>

                  <p className="text-2xl font-bold text-rose-400">
                    ${selectedSolicitud?.costoEstimado || 0}
                  </p>

                </div>

              </div>

              <div>

                <p className="text-slate-500 text-sm mb-2">
                  Proveedor
                </p>

                <div className="bg-black rounded-xl border border-slate-800 p-5 text-white text-lg">
                  {selectedSolicitud?.proveedor || "Sin proveedor"}
                </div>

              </div>

              <div>

                <p className="text-slate-500 text-sm mb-2">
                  Justificación
                </p>

                <div className="bg-black rounded-xl border border-slate-800 p-6 text-slate-300 italic leading-relaxed">
                  {selectedSolicitud?.justificacion || "Sin justificación"}
                </div>

              </div>

            </CardContent>

            <div className="border-t border-slate-800 p-6 flex justify-end gap-4">

              <Button
                onClick={() =>
                  handleUpdateStatus(selectedSolicitud.id, "RECHAZADO")
                }
                className="bg-rose-600 hover:bg-rose-700"
              >
                <X className="w-4 h-4 mr-2" />
                Rechazar
              </Button>

              <Button
                onClick={() =>
                  handleUpdateStatus(selectedSolicitud.id, "APROBADO")
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprobar
              </Button>

            </div>

          </Card>

        </div>

      )}

    </div>
  );
}
