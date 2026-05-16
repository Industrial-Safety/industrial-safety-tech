"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HardHat, Package, Calendar, Hash } from "lucide-react";
import { getEppDeliveriesByDni } from "@/services/requestService";

interface EppDelivery {
  id: number;
  inventoryItemId: number;
  inventoryItemDescripcion: string;
  workerDni: string;
  workerName: string;
  cantidadEntregada: number;
  fechaEntrega: string;
}

export default function EquipmentPage() {
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState<EppDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const dni = (session as any)?.dni || (session as any)?.user?.dni;
    if (!dni) {
      // si no está en sesión, intentar desde userData via proxy
      fetchWithFallback();
      return;
    }
    loadDeliveries(dni);
  }, [session]);

  const fetchWithFallback = async () => {
    try {
      const dbId = (session as any)?.dbId || session?.user?.id;
      if (!dbId) { setLoading(false); return; }
      const res = await fetch(`/api/proxy/users/${dbId}`);
      if (!res.ok) throw new Error();
      const userData = await res.json();
      if (userData?.dni) await loadDeliveries(userData.dni);
    } catch {
      setError("No se pudo obtener el DNI del trabajador.");
    } finally {
      setLoading(false);
    }
  };

  const loadDeliveries = async (dni: string) => {
    try {
      const data = await getEppDeliveriesByDni(dni);
      setDeliveries(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar las entregas de EPP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary" /> Mi EPP Asignado
          </h1>
          <p className="text-muted">Historial de equipos de protección personal entregados a tu nombre.</p>
        </div>
        <Badge variant="outline" className="self-start sm:self-auto border-primary/30 text-primary">
          {loading ? "Cargando..." : `${deliveries.length} entrega${deliveries.length !== 1 ? "s" : ""} registrada${deliveries.length !== 1 ? "s" : ""}`}
        </Badge>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Historial de Entregas
          </CardTitle>
          <CardDescription>Registro oficial de todos los EPP recibidos.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center text-muted py-12">Cargando entregas...</p>
          ) : error ? (
            <p className="text-center text-danger py-12">{error}</p>
          ) : deliveries.length === 0 ? (
            <div className="text-center py-16">
              <HardHat className="h-14 w-14 text-muted mx-auto mb-4 opacity-30" />
              <p className="font-semibold text-foreground">Sin entregas registradas</p>
              <p className="text-sm text-muted mt-1">Cuando Logística te asigne EPP aparecerá aquí.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="pl-6">
                    <div className="flex items-center gap-1"><Hash className="h-3 w-3" /> ID</div>
                  </TableHead>
                  <TableHead>EPP / Categoría</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1"><Package className="h-3 w-3" /> Cantidad</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Fecha de Entrega</div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((d) => (
                  <TableRow key={d.id} className="border-border/50 hover:bg-surface-secondary/30 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs text-muted">
                      #{d.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <HardHat className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{d.inventoryItemDescripcion}</p>
                          <p className="text-xs text-muted">DNI: {d.workerDni}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {d.cantidadEntregada} uds.
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      {d.fechaEntrega}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                        Entregado
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
