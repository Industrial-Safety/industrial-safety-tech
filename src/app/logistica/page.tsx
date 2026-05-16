"use client";

import { useState, useEffect } from "react";
import { getRequestStats } from "@/services/requestService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, AlertTriangle, TrendingUp, Package, Clock, Shield, Archive, ScanBarcode, UserCheck, ArrowRight, ShieldCheck, CheckCircle2, Check } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { getInventory, deliverEpp, searchWorkerByDni, getApprovedRequests } from "@/services/requestService";

const MOCK_CONSUMO = [
  { mes: "Ene", cascos: 120, guantes: 400, lentes: 200 },
  { mes: "Feb", cascos: 98, guantes: 350, lentes: 150 },
  { mes: "Mar", cascos: 150, guantes: 500, lentes: 280 },
  { mes: "Abr", cascos: 180, guantes: 600, lentes: 300 },
  { mes: "May", cascos: 140, guantes: 450, lentes: 250 },
  { mes: "Jun", cascos: 200, guantes: 700, lentes: 350 },
];




export default function LogisticaDashboard() {
  const [showEntregaModal, setShowEntregaModal] = useState(false);
  const [showRegistroLote, setShowRegistroLote] = useState(false);
  const [searchInventory, setSearchInventory] = useState("");

  const [entregaDni, setEntregaDni] = useState("");
  const [workerInfo, setWorkerInfo] = useState<any>(null);
  const [workerValidated, setWorkerValidated] = useState(false);
  const [validatingWorker, setValidatingWorker] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ itemId: number; cantidad: number }[]>([]);
  const [entregaLoading, setEntregaLoading] = useState(false);
  const [entregaError, setEntregaError] = useState("");
  const [inventory, setInventory] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  const [stats, setStats] = useState({
    totalSolicitudes: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0,
    totalCompras: 0
  });

  useEffect(() => {
    loadStats();
    loadInventory();
    loadApprovedRequests();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getRequestStats();
      setStats(data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

const loadInventory = async () => {
  try {
    const data = await getInventory();
    setInventory(data);
  } catch (error) {
    console.error("Error cargando inventario", error);
  }
};

const loadApprovedRequests = async () => {
  try {
    const data = await getApprovedRequests();
    setApprovedRequests(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error cargando solicitudes aprobadas", error);
  }
};

  const INVENTORY_LIMITS = {
    "Guantes de Nitrilo": 500,
    "Cascos de Seguridad": 200,
    "Lentes Protectores": 300,
    "Botas Dieléctricas": 50
  };

  const inventoryStatus = approvedRequests.map(item => {
    const max = INVENTORY_LIMITS[item.categoria] || 100;
    const porcentaje = Math.min((item.cantidad / max) * 100, 100);

    let estado = "Óptimo";
    let color = "emerald";

    if (porcentaje <= 20) {
      estado = "Crítico";
      color = "rose";
    } else if (porcentaje <= 50) {
      estado = "Bajo";
      color = "amber";
    }

    return {
      ...item,
      max,
      porcentaje,
      estado,
      color
    };
  });

  const toggleItem = (itemId: number) => {
    setSelectedItems(prev => {
      const exists = prev.find(s => s.itemId === itemId);
      if (exists) return prev.filter(s => s.itemId !== itemId);
      return [...prev, { itemId, cantidad: 1 }];
    });
  };

  const updateCantidad = (itemId: number, cantidad: number) => {
    setSelectedItems(prev =>
      prev.map(s => s.itemId === itemId ? { ...s, cantidad } : s)
    );
  };

  const handleValidarTrabajador = async () => {
    if (!/^\d{8}$/.test(entregaDni.trim())) {
      setEntregaError("Ingresa un DNI válido de 8 dígitos.");
      return;
    }
    setValidatingWorker(true);
    setEntregaError("");
    try {
      const worker = await searchWorkerByDni(entregaDni.trim());
      setWorkerInfo(worker);
      setWorkerValidated(true);
    } catch (e: any) {
      setEntregaError(e.message || "Error al buscar trabajador.");
      setWorkerValidated(false);
      setWorkerInfo(null);
    } finally {
      setValidatingWorker(false);
    }
  };

  const handleConfirmarEntrega = async () => {
    if (!workerValidated || !workerInfo) { setEntregaError("Valida el DNI primero."); return; }
    if (selectedItems.length === 0) { setEntregaError("Selecciona al menos un EPP."); return; }
    if (selectedItems.some(s => !s.cantidad || s.cantidad < 1)) { setEntregaError("Revisa las cantidades seleccionadas."); return; }

    setEntregaLoading(true);
    setEntregaError("");
    try {
      for (const sel of selectedItems) {
        await deliverEpp({
          purchaseRequestId: sel.itemId,
          workerDni: workerInfo.dni,
          workerName: `${workerInfo.name} ${workerInfo.lastName}`,
          cantidad: sel.cantidad,
        });
      }
      setShowEntregaModal(false);
      setEntregaDni(""); setWorkerInfo(null); setSelectedItems([]); setWorkerValidated(false);
      await Promise.all([loadInventory(), loadApprovedRequests(), loadStats()]);
    } catch (e: any) {
      setEntregaError(e.message || "Error al registrar entrega.");
    } finally {
      setEntregaLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-rose-950/40 to-transparent p-6 rounded-2xl border border-rose-900/30">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-rose-500" />
            Planificación y Logística
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Supervisa los niveles de stock global, predice la demanda operativa y gestiona las compras de EPP de forma centralizada.
          </p>
        </div>
        <div className="flex gap-3">
      
          <Button onClick={() => setShowEntregaModal(true)} className="bg-rose-500 hover:bg-rose-600 text-white gap-2 shadow-lg shadow-rose-500/25 border-0 rounded-full px-6">
            <ScanBarcode className="w-4 h-4" /> Entregar EPP
          </Button>
          <Link href="/logistica/solicitudes">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white gap-2 shadow-lg shadow-rose-500/25 border-0 rounded-full px-6">
              Ir a Solicitudes de Compra
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-surface/60 border-slate-800 hover:border-rose-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Ordene Rechazadas</p>
                <p className="text-4xl font-bold text-rose-500">
                  {stats.rechazadas}
                </p>                <p className="text-xs text-slate-500">Rechazadas por gerencia</p>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-2xl shadow-inner shadow-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/60 border-slate-800 hover:border-amber-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Ordenes Pendientes</p>
                <p className="text-4xl font-bold text-amber-500">
                  {stats.pendientes}
                </p>                <p className="text-xs text-slate-500">Entregas a espera de aprobación/rechazo</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-2xl shadow-inner shadow-amber-500/20">
                <Truck className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/60 border-slate-800 hover:border-emerald-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Órdenes Aprobadas</p>
                <p className="text-4xl font-bold text-emerald-500">
                  {stats.aprobadas}
                </p>                <p className="text-xs text-slate-500">Aprobadas por gerencia</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-inner shadow-emerald-500/20">
                <Package className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/60 border-slate-800 hover:border-blue-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total de Gastos</p>
                <p className="text-3xl font-bold text-blue-500">
                  S/ {stats.totalCompras.toLocaleString()}
                </p>                <p className="text-xs text-slate-500"></p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl shadow-inner shadow-blue-500/20">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Inventory Section */}
      <Card className="bg-surface/50 border-slate-800">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Archive className="w-5 h-5 text-rose-500" /> Inventario en Almacén
            </CardTitle>
            <CardDescription>Control en tiempo real de los elementos resguardados en almacén.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Buscar por código o nombre..."
              className="bg-slate-900 border-slate-700"
              value={searchInventory}
              onChange={(e) => setSearchInventory(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead>Código Ítem</TableHead>
                <TableHead>Descripción de EPP</TableHead>
                <TableHead>Ordenes</TableHead>
                <TableHead>Stock Disponible</TableHead>
                <TableHead>Estado Físico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(
                approvedRequests.reduce((acc, item) => {
                  if (!item.categoria) return acc;

                  if (!acc[item.categoria]) {
                    acc[item.categoria] = {
                      categoria: item.categoria,
                      cantidad: 0,
                      pendientes: 0,
                      aprobadas: 0,
                      rechazadas: 0
                    };
                  }

                  acc[item.categoria].cantidad += item.cantidad || 0;

                  if (item.estado === "PENDIENTE") acc[item.categoria].pendientes++;
                  if (item.estado === "APROBADO") acc[item.categoria].aprobadas++;
                  if (item.estado === "RECHAZADO") acc[item.categoria].rechazadas++;

                  return acc;
                }, {})
              )
                .filter(item =>
                  item.categoria.toLowerCase().includes(searchInventory.toLowerCase())
                )
                .map((item, index) => (
                  <TableRow key={index} className="border-slate-800">
                    <TableCell className="font-mono text-xs text-slate-400">
                      EPP-{index + 1}
                    </TableCell>

                    <TableCell className="font-medium text-slate-200">
                      {item.categoria}
                    </TableCell>

                    <TableCell className="text-slate-400">
                      {item.aprobadas} aprobadas / {item.pendientes} pendientes
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-slate-800 text-slate-200 border-slate-700">
                        {item.cantidad} unidades
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
  className={
    item.cantidad === 0
      ? "bg-rose-500/10 text-rose-400 border-none"
      : item.cantidad < 10
      ? "bg-amber-500/10 text-amber-400 border-none"
      : "bg-emerald-500/10 text-emerald-400 border-none"
  }
>
  <ShieldCheck className="w-3 h-3 mr-1 inline" />
  {item.cantidad === 0
    ? "Agotado"
    : item.cantidad < 10
    ? "Crítico"
    : "Disponible"}
</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Stock Levels */}
        <Card className="bg-surface/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Estado de Inventario EPP</CardTitle>
            <CardDescription>Visualización gráfica del stock actual frente al ideal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-200">Guantes de Nitrilo (Talla L)</span>
                <span className="text-rose-500 font-bold">10 / 500 uds (Crítico)</span>
              </div>
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full relative" style={{ width: '2%' }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/images/stripe-pattern.svg')] opacity-20"></div>
                </div>
              </div>
            </div>

            {inventoryStatus.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-200">
                    {item.categoria}
                  </span>

                  <span
                    className={`font-bold ${item.color === "rose"
                        ? "text-rose-500"
                        : item.color === "amber"
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                  >
                    {item.cantidad} / {item.max} uds ({item.estado})
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${item.color === "rose"
                        ? "bg-gradient-to-r from-rose-600 to-rose-400"
                        : item.color === "amber"
                          ? "bg-gradient-to-r from-amber-600 to-amber-400"
                          : "bg-gradient-to-r from-emerald-600 to-emerald-400"
                      }`}
                    style={{ width: `${item.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-800/50">
              <Link href="/logistica/solicitudes">
                <Button variant="outline" className="w-full border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white">
                  Crear Solicitud para Ítems Críticos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Consumption Chart */}
        <Card className="bg-surface/50 border-slate-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Proyección de Consumo</CardTitle>
            <CardDescription>Demanda histórica de EPP en unidades.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CONSUMO} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="mes" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="guantes" name="Guantes" fill="#e11d48" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="cascos" name="Cascos" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="lentes" name="Lentes" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Órdenes en Tránsito</CardTitle>
            <CardDescription>Seguimiento de compras en camino hacia almacén.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Timeline Item 1 */}
              <div className="relative pl-6 border-l-2 border-amber-500/30 pb-4">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-amber-500 border-4 border-slate-950"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-200">OC-2026-089 (3M Perú)</h4>
                  <Badge className="bg-amber-500/20 text-amber-400 border-none text-[10px]">En Camino</Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">500x Mascarillas N95, 200x Tapones Auditivos</p>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Llegada est: Mañana, 09:00 AM
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-6 border-l-2 border-emerald-500/30 pb-4">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-200">OC-2026-085 (MSA Safety)</h4>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px]">Aprobada</Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">50x Arneses de Cuerpo Entero</p>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Package className="w-3 h-3" /> Preparando envío
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-6 border-l-2 border-slate-800 pb-0">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-700 border-4 border-slate-950"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-200">SC-2026-102 (Req. Interna)</h4>
                  <Badge className="bg-slate-800 text-slate-400 border-none text-[10px]">En Revisión</Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">Renovación trimestral de guantes (Planta 2)</p>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Esperando Gerencia
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entrega EPP Modal Overlay */}
      {showEntregaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-slate-950 border-rose-500/30 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-rose-400 flex items-center gap-2">
                <UserCheck className="w-5 h-5" /> Registro de Entrega de EPP
              </CardTitle>
              <CardDescription>Asignación física de equipo al personal.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">DNI del Trabajador</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ej. 74581203"
                    value={entregaDni}
                    onChange={(e) => { setEntregaDni(e.target.value); setWorkerValidated(false); setWorkerInfo(null); }}
                    className="bg-slate-900 border-slate-700 flex-1"
                    maxLength={8}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleValidarTrabajador}
                    disabled={validatingWorker}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    {validatingWorker ? "Buscando..." : "Validar"}
                  </Button>
                </div>
                {workerValidated && workerInfo && (
                  <p className="text-xs text-emerald-400 mt-1">
                    ✓ Trabajador: {workerInfo.name} {workerInfo.lastName}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-300">
                  EPP a Entregar
                  {selectedItems.length > 0 && (
                    <span className="ml-2 text-xs text-rose-400 font-normal">
                      {selectedItems.length} seleccionado{selectedItems.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </label>
                <div className="border border-slate-700 rounded-lg overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-800/60">
                  {approvedRequests.length === 0 ? (
                    <p className="text-xs text-slate-500 p-4 text-center">No hay solicitudes aprobadas en purchase.</p>
                  ) : (
                    approvedRequests.map((item: any) => {
                      const disponible = item.cantidad ?? 0;
                      const hasStock = disponible > 0;
                      const sel = selectedItems.find(s => s.itemId === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                            hasStock ? "hover:bg-slate-800/60 cursor-pointer" : "opacity-40 cursor-not-allowed"
                          } ${sel ? "bg-rose-500/5" : ""}`}
                          onClick={() => hasStock && toggleItem(item.id)}
                        >
                          <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            sel ? "bg-rose-500 border-rose-500" : hasStock ? "border-slate-500" : "border-slate-700"
                          }`}>
                            {sel && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${hasStock ? "text-slate-200" : "text-slate-500"}`}>
                              {item.categoria}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.codigoSolicitud} · Disponible: <span className={hasStock ? "text-emerald-400" : "text-rose-400"}>{disponible}</span> uds.
                              {!hasStock && " · Sin unidades disponibles"}
                            </p>
                          </div>
                          {sel && (
                            <input
                              type="number"
                              min={1}
                              max={disponible}
                              value={sel.cantidad}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateCantidad(item.id, Math.max(1, Math.min(disponible, parseInt(e.target.value) || 1)))}
                              className="w-16 h-7 rounded border border-slate-600 bg-slate-900 px-2 text-sm text-slate-200 text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex gap-3 items-start mt-4">
                <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-400/80">Declaro que el EPP está en perfectas condiciones y el trabajador ha sido instruido sobre su uso.</p>
              </div>

              {entregaError && (
                <p className="text-xs text-rose-400">{entregaError}</p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button variant="ghost" onClick={() => { setShowEntregaModal(false); setEntregaError(""); setSelectedItems([]); setEntregaDni(""); setWorkerInfo(null); setWorkerValidated(false); }} className="text-slate-300" disabled={entregaLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmarEntrega} className="bg-rose-500 hover:bg-rose-600 text-white" disabled={entregaLoading}>
                  {entregaLoading ? "Registrando..." : "Confirmar Entrega"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ingreso Lote Modal Overlay */}
      {showRegistroLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-slate-950 border-rose-500/30 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-rose-400 flex items-center gap-2">
                <Package className="w-5 h-5" /> Ingresar Nuevo Lote
              </CardTitle>
              <CardDescription>Registro de inventario recibido desde proveedores.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">N° Orden de Compra</label>
                  <Input placeholder="OC-2026-045" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Código de Lote</label>
                  <Input placeholder="L-2026-XYZ" className="bg-slate-900 border-slate-700" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Categoría EPP</label>
                <select className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 appearance-none focus:ring-2 focus:ring-rose-500">
                  <option>Cascos de Seguridad</option>
                  <option>Guantes</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Cantidad Recibida</label>
                  <Input type="number" placeholder="Ej. 100" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Fecha Vencimiento (Si aplica)</label>
                  <Input type="date" className="bg-slate-900 border-slate-700 text-slate-300" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button variant="ghost" onClick={() => setShowRegistroLote(false)} className="text-slate-300">Cancelar</Button>
                <Button onClick={() => setShowRegistroLote(false)} className="bg-rose-500 hover:bg-rose-600 text-white gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Registrar Lote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
