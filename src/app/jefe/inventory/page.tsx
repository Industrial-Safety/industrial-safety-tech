"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HardHat, Package, AlertTriangle, ArrowDown, Search, Plus, Edit, UserPlus, X, FileText } from "lucide-react";

type EPP = {
  id: string;
  item: string;
  type: string;
  stock: number;
  min: number;
  status: "ok" | "low";
  characteristics: string;
};

const initialInventory: EPP[] = [
  { id: "EPP-001", item: "Casco Industrial 3M", type: "Protección Cabeza", stock: 120, min: 50, status: "ok", characteristics: "Resistencia al impacto, dieléctrico clase E, ajuste de matraca." },
  { id: "EPP-002", item: "Guantes de Nitrilo", type: "Protección Manos", stock: 35, min: 40, status: "low", characteristics: "Resistente a químicos, grosor 15mil, sin polvo." },
  { id: "EPP-003", item: "Lentes de Seguridad ANSI", type: "Protección Visual", stock: 200, min: 60, status: "ok", characteristics: "Lente de policarbonato, anti-empañante, protección UV 99.9%." },
  { id: "EPP-004", item: "Arnés de Altura D-Ring", type: "Protección Caídas", stock: 8, min: 15, status: "low", characteristics: "Anillo D en espalda, correas ajustables, capacidad 140kg." },
  { id: "EPP-005", item: "Botas Dieléctricas CAT", type: "Protección Pies", stock: 45, min: 20, status: "ok", characteristics: "Punta de composite, suela antideslizante resistente a aceites." },
  { id: "EPP-006", item: "Protector Auditivo Copa", type: "Protección Auditiva", stock: 90, min: 30, status: "ok", characteristics: "NRR 27dB, diadema acolchada." },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<EPP[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Modals state
  const [selectedEPP, setSelectedEPP] = useState<EPP | null>(null);
  const [modalType, setModalType] = useState<"details" | "assign" | null>(null);

  // Add Form State
  const [newEpp, setNewEpp] = useState({ item: "", type: "", stock: "", min: "", characteristics: "" });
  const [assignSearch, setAssignSearch] = useState("");

  const totalItems = inventory.length;
  const lowStock = inventory.filter((i) => i.status === "low").length;

  const filteredInventory = inventory.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEPP = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: EPP = {
      id: `EPP-00${inventory.length + 1}`,
      item: newEpp.item,
      type: newEpp.type,
      stock: Number(newEpp.stock),
      min: Number(newEpp.min),
      status: Number(newEpp.stock) <= Number(newEpp.min) ? "low" : "ok",
      characteristics: newEpp.characteristics,
    };
    setInventory([...inventory, newItem]);
    setNewEpp({ item: "", type: "", stock: "", min: "", characteristics: "" });
    setShowAddForm(false);
  };

  const openModal = (epp: EPP, type: "details" | "assign") => {
    setSelectedEPP(epp);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedEPP(null);
    setModalType(null);
    setAssignSearch("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventario de EPP</h1>
        <p className="text-sm text-muted">Gestión avanzada y asignación de equipo de protección personal.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total de Tipos de EPP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{totalItems}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Items con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <span className="text-2xl font-bold text-rose-500">{lowStock}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-surface/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Estado General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {lowStock > 0 ? (
                <>
                  <ArrowDown className="h-5 w-5 text-amber-500" />
                  <span className="text-2xl font-bold text-amber-500">Requiere Atención</span>
                </>
              ) : (
                <>
                  <HardHat className="h-5 w-5 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-500">Óptimo</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Superiores: Buscador y Botón Agregar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Buscar EPP por nombre o tipo..." 
            className="pl-9 bg-surface/30 border-slate-700 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showAddForm ? "Cancelar Registro" : "Registrar Nuevo EPP"}
        </Button>
      </div>

      {/* Formulario de Registro (Acordeón) */}
      {showAddForm && (
        <Card className="border-blue-500/30 bg-blue-500/5 animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
              <Package className="h-5 w-5" /> Registrar Ingreso de EPP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEPP} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Nombre del Producto</label>
                <Input required value={newEpp.item} onChange={e => setNewEpp({...newEpp, item: e.target.value})} placeholder="Ej. Casco Tipo II" className="border-slate-700 bg-surface/50" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Tipo/Categoría</label>
                <Input required value={newEpp.type} onChange={e => setNewEpp({...newEpp, type: e.target.value})} placeholder="Ej. Protección Cabeza" className="border-slate-700 bg-surface/50" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Stock Actual</label>
                <Input required type="number" value={newEpp.stock} onChange={e => setNewEpp({...newEpp, stock: e.target.value})} placeholder="0" className="border-slate-700 bg-surface/50" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Stock Mínimo (Alerta)</label>
                <Input required type="number" value={newEpp.min} onChange={e => setNewEpp({...newEpp, min: e.target.value})} placeholder="0" className="border-slate-700 bg-surface/50" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-slate-400">Características Técnicas</label>
                <Input required value={newEpp.characteristics} onChange={e => setNewEpp({...newEpp, characteristics: e.target.value})} placeholder="Especificaciones, normativas, etc." className="border-slate-700 bg-surface/50" />
              </div>
              <div className="md:col-span-3 flex justify-end mt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Guardar EPP</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Inventario */}
      <Card className="border-slate-800 bg-surface/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-left text-muted">
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium">Stock / Min</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No se encontraron resultados para la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/50 text-foreground hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-400">{item.id}</td>
                      <td className="p-4 font-medium text-slate-200">{item.item}</td>
                      <td className="p-4 text-slate-400">{item.type}</td>
                      <td className="p-4">
                        <span className="font-semibold">{item.stock}</span> <span className="text-xs text-slate-500">/ {item.min}</span>
                      </td>
                      <td className="p-4">
                        {item.status === "low" ? (
                          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20">Stock bajo</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Óptimo</Badge>
                        )}
                      </td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openModal(item, "details")} className="border-slate-700 bg-transparent hover:bg-slate-800 h-8 px-2 text-slate-300">
                          <Edit className="h-4 w-4 mr-1" /> Detalles
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openModal(item, "assign")} className="border-blue-900/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 h-8 px-2">
                          <UserPlus className="h-4 w-4 mr-1" /> Asignar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODALES */}
      {modalType && selectedEPP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-lg border-slate-700 bg-slate-900 shadow-2xl relative overflow-hidden">
            {/* Header decorativo */}
            <div className={`absolute top-0 left-0 w-full h-1 ${modalType === 'details' ? 'bg-amber-500' : 'bg-blue-500'}`} />
            
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            {modalType === "details" ? (
              <>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <FileText className="h-5 w-5 text-amber-500" />
                    Detalles y Edición de EPP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <span className="block text-xs text-slate-400 mb-1">SKU</span>
                      <span className="font-mono text-sm text-slate-200">{selectedEPP.id}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <span className="block text-xs text-slate-400 mb-1">Producto</span>
                      <span className="font-medium text-slate-200">{selectedEPP.item}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <span className="block text-xs text-slate-400 mb-1">Categoría</span>
                      <span className="text-slate-200">{selectedEPP.type}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex justify-between items-center">
                      <div>
                        <span className="block text-xs text-slate-400 mb-1">Stock Actual</span>
                        <span className={`font-bold text-lg ${selectedEPP.status === 'low' ? 'text-rose-400' : 'text-emerald-400'}`}>{selectedEPP.stock}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-slate-400 mb-1">Mínimo</span>
                        <span className="text-slate-400">{selectedEPP.min}</span>
                      </div>
                    </div>
                    <div className="col-span-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <span className="block text-xs text-slate-400 mb-1">Características Técnicas</span>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedEPP.characteristics}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                    <Button variant="outline" onClick={closeModal} className="border-slate-700 text-slate-300">Cerrar</Button>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">Editar Información</Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                    Asignar {selectedEPP.item}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-300 font-medium">Stock Disponible</span>
                      <div className="text-lg font-bold text-blue-400">{selectedEPP.stock} unidades</div>
                    </div>
                    <Package className="h-8 w-8 text-blue-500/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Buscar Trabajador</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input 
                        autoFocus
                        placeholder="Ej. Carlos Mendoza, DNI..." 
                        className="pl-9 bg-slate-800 border-slate-700 focus-visible:ring-blue-500"
                        value={assignSearch}
                        onChange={(e) => setAssignSearch(e.target.value)}
                      />
                    </div>
                    {assignSearch.length > 2 && (
                      <div className="mt-2 p-2 border border-slate-700 bg-slate-800 rounded-lg shadow-lg">
                        <button className="w-full text-left p-2 hover:bg-slate-700 rounded flex justify-between items-center transition-colors">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{assignSearch} (Coincidencia)</span>
                            <span className="text-xs text-slate-400">Planta Principal - Producción</span>
                          </div>
                          <Badge className="bg-slate-600 text-slate-300 hover:bg-slate-600">Seleccionar</Badge>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Cantidad a asignar</label>
                    <Input type="number" defaultValue="1" min="1" max={selectedEPP.stock} className="bg-slate-800 border-slate-700" />
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                    <Button variant="outline" onClick={closeModal} className="border-slate-700 text-slate-300">Cancelar</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={closeModal}>Confirmar Asignación</Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
