"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, ScanBarcode, UserCheck, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AlmacenDashboard() {
  const [showEntregaModal, setShowEntregaModal] = useState(false);
  const [showRegistroLote, setShowRegistroLote] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Almacén e Inventario</h1>
          <p className="text-slate-400 mt-1">Recepción de lotes, control de stock y entrega directa a operarios.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowRegistroLote(true)} variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 gap-2">
            <Package className="w-4 h-4" /> Ingresar Lote
          </Button>
          <Button onClick={() => setShowEntregaModal(true)} className="bg-teal-500 hover:bg-teal-600 text-white gap-2 shadow-lg shadow-teal-500/20 border-0">
            <ScanBarcode className="w-4 h-4" /> Entregar EPP a Trabajador
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="bg-surface/50 border-slate-800">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
          <div>
            <CardTitle>Inventario Disponible (Stock Físico)</CardTitle>
            <CardDescription>Control en tiempo real de los elementos resguardados en almacén.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Input placeholder="Buscar por código o nombre..." className="bg-slate-900 border-slate-700" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead>Código Ítem</TableHead>
                <TableHead>Descripción de EPP</TableHead>
                <TableHead>Lote / Vencimiento</TableHead>
                <TableHead>Stock Disponible</TableHead>
                <TableHead>Estado Físico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-slate-800">
                <TableCell className="font-mono text-xs text-slate-400">EPP-CAS-01</TableCell>
                <TableCell className="font-medium text-slate-200">Casco de Seguridad Tipo 1</TableCell>
                <TableCell className="text-slate-400">L-2026-A <br/><span className="text-xs">No expira</span></TableCell>
                <TableCell><Badge className="bg-slate-800 text-slate-200 border-slate-700">25 unidades</Badge></TableCell>
                <TableCell><Badge className="bg-emerald-500/10 text-emerald-400 border-none"><ShieldCheck className="w-3 h-3 mr-1 inline" /> Óptimo</Badge></TableCell>
              </TableRow>
              <TableRow className="border-slate-800">
                <TableCell className="font-mono text-xs text-slate-400">EPP-GUA-05</TableCell>
                <TableCell className="font-medium text-slate-200">Guantes de Nitrilo (L)</TableCell>
                <TableCell className="text-slate-400">L-2025-C <br/><span className="text-xs">Vence: 10/2027</span></TableCell>
                <TableCell><Badge className="bg-rose-500/20 text-rose-400 border-none">10 unidades</Badge></TableCell>
                <TableCell><Badge className="bg-emerald-500/10 text-emerald-400 border-none"><ShieldCheck className="w-3 h-3 mr-1 inline" /> Óptimo</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Entrega EPP Modal Overlay */}
      {showEntregaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-slate-950 border-teal-500/30 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-teal-400 flex items-center gap-2">
                <UserCheck className="w-5 h-5" /> Registro de Entrega de EPP
              </CardTitle>
              <CardDescription>Asignación física de equipo al personal con firma digital.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">DNI del Trabajador</label>
                <div className="flex gap-2">
                  <Input placeholder="Ej. 74581203" className="bg-slate-900 border-slate-700 flex-1" />
                  <Button variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-white">Validar</Button>
                </div>
                <p className="text-xs text-emerald-400 mt-1">✓ Trabajador Validado: Luis Fernandez (Planta - Mina)</p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-300">Equipo a Entregar</label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-teal-500 appearance-none">
                  <option value="">Escanear código o seleccionar...</option>
                  <option value="casco">EPP-CAS-01 - Casco de Seguridad</option>
                  <option value="guantes">EPP-GUA-05 - Guantes Nitrilo</option>
                </select>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 flex gap-3 items-start mt-4">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-teal-400">Verificación de Estado</p>
                  <p className="text-xs text-teal-400/80 mt-1">Declaro que el EPP está en perfectas condiciones y el trabajador ha sido instruido sobre su uso.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <Button variant="ghost" onClick={() => setShowEntregaModal(false)} className="text-slate-300">Cancelar</Button>
                <Button onClick={() => setShowEntregaModal(false)} className="bg-teal-500 hover:bg-teal-600 text-white">
                  Confirmar Entrega <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ingreso Lote Modal Overlay */}
      {showRegistroLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-slate-950 border-teal-500/30 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-teal-400 flex items-center gap-2">
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
                <select className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 appearance-none focus:ring-2 focus:ring-teal-500">
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
                <Button onClick={() => setShowRegistroLote(false)} className="bg-teal-500 hover:bg-teal-600 text-white gap-2">
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
