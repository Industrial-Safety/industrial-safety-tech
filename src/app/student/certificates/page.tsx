"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  Copy,
  Mail,
  MessageCircle,
  Link as LinkIcon,
  Globe,
  Loader2,
} from "lucide-react";

interface Certificate {
  id: number;
  courseId: string;
  courseName: string;
  instructorName: string;
  score: number;
  issuedAt: string;
  certificateUrl: string;
}

export default function StudentCertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModal, setShareModal] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session?.keycloakId) return;
    fetch(`/api/proxy/certificates/student/${session.keycloakId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setCertificates)
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, [session?.keycloakId]);

  const handleDownload = (cert: Certificate) => {
    window.open(cert.certificateUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

  const shareViaLinkedIn = (url: string) =>
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");

  const shareViaWhatsApp = (cert: Certificate) =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`Obtuve mi certificado en "${cert.courseName}" 🎓 Descárgalo aquí: ${cert.certificateUrl}`)}`, "_blank");

  const shareViaEmail = (cert: Certificate) =>
    window.open(`mailto:?subject=${encodeURIComponent(`Certificado: ${cert.courseName}`)}&body=${encodeURIComponent(`Hola, comparto mi certificado del curso "${cert.courseName}".\n\nDescárgalo aquí: ${cert.certificateUrl}`)}`, "_blank");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mis Certificados</h1>
          <p className="text-muted">Descarga y comparte tus certificaciones de seguridad industrial.</p>
        </div>
        {!loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>{certificates.length} certificado{certificates.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted">Total Certificados</p>
              <p className="text-2xl font-bold">{loading ? "—" : certificates.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted">Puntaje Promedio</p>
              <p className="text-2xl font-bold">
                {loading || certificates.length === 0
                  ? "—"
                  : Math.round(certificates.reduce((s, c) => s + c.score, 0) / certificates.length) + "%"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Award className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted">Mejor Puntaje</p>
              <p className="text-2xl font-bold">
                {loading || certificates.length === 0
                  ? "—"
                  : Math.max(...certificates.map(c => c.score)) + "%"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      ) : certificates.length === 0 ? (
        <Card className="bg-surface/40 border-border p-12 text-center">
          <Award className="h-16 w-16 text-muted mx-auto mb-4 opacity-30" />
          <p className="text-muted text-lg font-medium">Aún no tienes certificados</p>
          <p className="text-muted text-sm mt-1">Completa un examen con nota aprobatoria para obtener tu primer certificado.</p>
        </Card>
      ) : (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" /> Certificados Obtenidos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map(cert => (
              <Card key={cert.id} className="bg-surface/60 border-border overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight">{cert.courseName}</h3>
                        <p className="text-xs text-muted mt-0.5">{cert.instructorName}</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/30 shrink-0">
                      {cert.score}%
                    </Badge>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-muted mb-4">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Expedido el {formatDate(cert.issuedAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => handleDownload(cert)}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Descargar PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => { setShareModal(cert); setCopied(false); }}
                    >
                      <Share2 className="h-4 w-4 mr-1.5" />
                      Compartir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Compartir Certificado</h3>
              </div>
              <button onClick={() => setShareModal(null)} className="text-muted hover:text-foreground transition-colors">✕</button>
            </div>

            <div className="p-5 space-y-4">
              {/* Preview */}
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">{shareModal.courseName}</p>
                <p className="text-xs text-muted mt-1">Puntaje: {shareModal.score}% · {formatDate(shareModal.issuedAt)}</p>
              </div>

              {/* Copy link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold">Enlace de descarga (válido 7 días)</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareModal.certificateUrl}
                    className="flex-1 px-3 py-2 text-xs bg-surface-secondary border border-border rounded-md text-muted truncate"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleCopy(shareModal.certificateUrl)}>
                    {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-xs text-success">¡Enlace copiado!</p>}
              </div>

              {/* Share options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold">Compartir en</label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => shareViaLinkedIn(shareModal.certificateUrl)}>
                    <LinkIcon className="h-5 w-5 text-[#0A66C2]" />
                    <span className="text-[10px]">LinkedIn</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Obtuve mi certificado en "${shareModal.courseName}" 🎓`)}&url=${encodeURIComponent(shareModal.certificateUrl)}`, "_blank")}>
                    <Globe className="h-5 w-5 text-[#1DA1F2]" />
                    <span className="text-[10px]">Twitter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => shareViaEmail(shareModal)}>
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-[10px]">Email</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3"
                    onClick={() => shareViaWhatsApp(shareModal)}>
                    <MessageCircle className="h-5 w-5 text-success" />
                    <span className="text-[10px]">WhatsApp</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShareModal(null)}>Cerrar</Button>
              <Button onClick={() => handleDownload(shareModal)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
