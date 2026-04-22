import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";

const mockCertificates = [
  { id: "CERT-001", name: "Curso Alturas", status: "valid", expires: "2026-12-01", holder: "Juan Pérez" },
  { id: "CERT-002", name: "Manejo Materiales Peligrosos", status: "valid", expires: "2026-08-15", holder: "María López" },
  { id: "CERT-003", name: "Soldadura Industrial", status: "expiring", expires: "2026-05-01", holder: "Roberto Díaz" },
  { id: "CERT-004", name: "Espacios Confinados", status: "expired", expires: "2025-11-30", holder: "Laura Gómez" },
  { id: "CERT-005", name: "Operación Grúa", status: "valid", expires: "2027-03-20", holder: "Pedro Ramírez" },
];

const statusConfig: Record<string, { badge: "success" | "warning" | "danger"; label: string; icon: React.ComponentType<any> }> = {
  valid: { badge: "success", label: "Vigente", icon: CheckCircle },
  expiring: { badge: "warning", label: "Próximo", icon: Clock },
  expired: { badge: "danger", label: "Vencido", icon: XCircle },
};

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Certificados de Seguridad</h1>
        <p className="text-sm text-muted">Gestión y seguimiento de certificados del personal.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Listado de Certificados
          </CardTitle>
          <span className="text-sm text-muted">{mockCertificates.length} registros</span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-muted">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Certificado</th>
                  <th className="pb-3 font-medium">Titular</th>
                  <th className="pb-3 font-medium">Vencimiento</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockCertificates.map((cert) => {
                  const cfg = statusConfig[cert.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={cert.id} className="border-b border-slate-800/50 text-foreground">
                      <td className="py-3 font-mono text-xs text-muted">{cert.id}</td>
                      <td className="py-3">{cert.name}</td>
                      <td className="py-3">{cert.holder}</td>
                      <td className="py-3 text-muted">{cert.expires}</td>
                      <td className="py-3">
                        <Badge variant={cfg.badge}>
                          <Icon className="mr-1 inline h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
