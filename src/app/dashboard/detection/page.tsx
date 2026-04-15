import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Eye, AlertTriangle, CheckCircle } from "lucide-react";

const mockDetections = [
  { id: 1, camera: "Cámara N-03", time: "09:42:15", detection: "Sin casco", status: "violation" as const, confidence: 97 },
  { id: 2, camera: "Cámara E-07", time: "09:15:33", detection: "Sin guantes", status: "violation" as const, confidence: 89 },
  { id: 3, camera: "Cámara S-01", time: "08:58:02", detection: "Sin lentes", status: "violation" as const, confidence: 94 },
  { id: 4, camera: "Cámara N-02", time: "08:30:44", detection: "EPP completo", status: "compliant" as const, confidence: 99 },
  { id: 5, camera: "Cámara W-05", time: "08:12:18", detection: "EPP completo", status: "compliant" as const, confidence: 98 },
];

export default function DetectionPage() {
  const violations = mockDetections.filter((d) => d.status === "violation").length;
  const compliant = mockDetections.filter((d) => d.status === "compliant").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Detección de EPP por IA</h1>
        <p className="text-sm text-muted">Monitoreo en tiempo real con visión artificial.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Cámaras Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">24</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Detecciones (hoy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{mockDetections.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Infracciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <span className="text-2xl font-bold text-danger">{violations}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-success">{compliant}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera feed placeholder */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Feed en Vivo — Cámara N-03</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-center justify-center rounded-lg bg-surface-secondary text-sm text-muted">
              Stream de cámara — integración próxima
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Feed en Vivo — Cámara E-07</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-center justify-center rounded-lg bg-surface-secondary text-sm text-muted">
              Stream de cámara — integración próxima
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Log de Detecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-muted">
                  <th className="pb-3 font-medium">Hora</th>
                  <th className="pb-3 font-medium">Cámara</th>
                  <th className="pb-3 font-medium">Detección</th>
                  <th className="pb-3 font-medium">Confianza</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockDetections.map((d) => (
                  <tr key={d.id} className="border-b border-slate-800/50 text-foreground">
                    <td className="py-3 font-mono text-xs text-muted">{d.time}</td>
                    <td className="py-3">{d.camera}</td>
                    <td className="py-3">{d.detection}</td>
                    <td className="py-3">{d.confidence}%</td>
                    <td className="py-3">
                      {d.status === "violation" ? (
                        <Badge variant="danger">Infracción</Badge>
                      ) : (
                        <Badge variant="success">Cumple</Badge>
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
