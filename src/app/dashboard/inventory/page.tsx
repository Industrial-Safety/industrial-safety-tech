import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, Package, AlertTriangle, ArrowDown } from "lucide-react";

const mockInventory = [
  { id: "EPP-001", item: "Casco Industrial 3M", stock: 120, min: 50, status: "ok" as const },
  { id: "EPP-002", item: "Guantes de Nitrilo (par)", stock: 35, min: 40, status: "low" as const },
  { id: "EPP-003", item: "Lentes de Seguridad", stock: 200, min: 60, status: "ok" as const },
  { id: "EPP-004", item: "Arnés de Altura", stock: 8, min: 15, status: "low" as const },
  { id: "EPP-005", item: "Botas Dieléctricas", stock: 45, min: 20, status: "ok" as const },
  { id: "EPP-006", item: "Protector Auditivo", stock: 90, min: 30, status: "ok" as const },
];

export default function InventoryPage() {
  const totalItems = mockInventory.length;
  const lowStock = mockInventory.filter((i) => i.status === "low").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventario de EPP</h1>
        <p className="text-sm text-muted">Control de stock de equipo de protección personal.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total de Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{totalItems}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <span className="text-2xl font-bold text-danger">{lowStock}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Reposición Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-warning" />
              <span className="text-2xl font-bold text-warning">{lowStock} órdenes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <HardHat className="h-5 w-5 text-primary" />
            Catálogo de EPP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-muted">
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Mínimo</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockInventory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800/50 text-foreground">
                    <td className="py-3 font-mono text-xs text-muted">{item.id}</td>
                    <td className="py-3">{item.item}</td>
                    <td className="py-3 font-semibold">{item.stock}</td>
                    <td className="py-3 text-muted">{item.min}</td>
                    <td className="py-3">
                      {item.status === "low" ? (
                        <Badge variant="danger">Stock bajo</Badge>
                      ) : (
                        <Badge variant="success">Normal</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
