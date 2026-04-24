"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Award,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  ExternalLink,
  Copy,
  Mail,
  MessageCircle,
  Link as LinkIcon,
  Globe
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Certificate {
  id: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
  hours: number;
  status: "active" | "expired" | "expiring-soon";
  credentialId: string;
  instructor: string;
  score: number;
}

const certificates: Certificate[] = [
  {
    id: "1",
    courseName: "Uso Correcto de EPP",
    issueDate: "2025-03-15",
    expiryDate: "2027-03-15",
    hours: 20,
    status: "active",
    credentialId: "EPP-2025-001234",
    instructor: "Ing. Carlos Mendoza",
    score: 95
  },
  {
    id: "2",
    courseName: "Seguridad en Alturas",
    issueDate: "2025-01-20",
    expiryDate: "2027-01-20",
    hours: 40,
    status: "active",
    credentialId: "ALT-2025-005678",
    instructor: "Lic. Ana Torres",
    score: 92
  },
  {
    id: "3",
    courseName: "Primeros Auxilios Básicos",
    issueDate: "2024-06-10",
    expiryDate: "2025-06-10",
    hours: 16,
    status: "expiring-soon",
    credentialId: "PA-2024-009012",
    instructor: "Dr. Roberto Silva",
    score: 88
  },
  {
    id: "4",
    courseName: "Manejo de Extintores",
    issueDate: "2024-02-05",
    expiryDate: "2025-02-05",
    hours: 8,
    status: "expired",
    credentialId: "EXT-2024-003456",
    instructor: "Ing. Carlos Mendoza",
    score: 90
  }
];

export default function StudentCertificatesPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: Certificate["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/30">Vigente</Badge>;
      case "expiring-soon":
        return <Badge className="bg-warning/10 text-warning border-warning/30">Por Vencer</Badge>;
      case "expired":
        return <Badge className="bg-danger/10 text-danger border-danger/30">Vencido</Badge>;
    }
  };

  const handleShare = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://prevenciontech.com/verify/${selectedCertificate?.credentialId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (cert: Certificate) => {
    // Simulación de descarga de PDF
    alert(`Descargando certificado: ${cert.courseName}.pdf`);
  };

  const activeCertificates = certificates.filter(c => c.status === "active" || c.status === "expiring-soon");
  const expiredCertificates = certificates.filter(c => c.status === "expired");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Mis Certificados</h1>
          <p className="text-muted">Gestiona, comparte y descarga tus certificaciones de seguridad industrial.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>{activeCertificates.length} certificados activos</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Certificados</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted">Certificados Vigentes</p>
                <p className="text-2xl font-bold">{activeCertificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted">Por Vencer</p>
                <p className="text-2xl font-bold">{certificates.filter(c => c.status === "expiring-soon").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-surface/40 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted/10 rounded-lg">
                <FileText className="h-5 w-5 text-muted" />
              </div>
              <div>
                <p className="text-xs text-muted">Horas Certificadas</p>
                <p className="text-2xl font-bold">{certificates.reduce((acc, c) => acc + c.hours, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificados Activos */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" /> Certificados Vigentes
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeCertificates.map((cert) => (
            <Card key={cert.id} className="bg-surface/60 border-border overflow-hidden hover:border-primary/50 transition-colors group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Certificate Preview */}
                  <div className="sm:w-2/5 bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex flex-col items-center justify-center relative">
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(cert.status)}
                    </div>
                    <Award className="h-16 w-16 text-primary/50 mb-3" />
                    <p className="text-xs text-muted text-center">Certificado de Completion</p>
                  </div>
                  
                  {/* Certificate Info */}
                  <div className="sm:w-3/5 p-5">
                    <h3 className="font-bold text-lg mb-2">{cert.courseName}</h3>
                    
                    <div className="space-y-2 text-sm text-muted mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expedido: {new Date(cert.issueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Vence: {new Date(cert.expiryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted">
                        <span className="font-semibold text-foreground">{cert.hours} horas</span> • Nota: <span className="font-semibold text-foreground">{cert.score}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(cert)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleShare(cert)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certificados Vencidos */}
      {expiredCertificates.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted">
            <Award className="h-5 w-5" /> Certificados Vencidos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {expiredCertificates.map((cert) => (
              <Card key={cert.id} className="bg-surface/30 border-border opacity-75">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{cert.courseName}</h3>
                      <p className="text-sm text-muted">Venció el {new Date(cert.expiryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {getStatusBadge(cert.status)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(cert)}>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      {shareModalOpen && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Compartir Certificado</h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Certificate Preview */}
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">{selectedCertificate.courseName}</p>
                <p className="text-xs text-muted mt-1">ID: {selectedCertificate.credentialId}</p>
              </div>

              {/* Share Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold">Enlace público de verificación</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://prevenciontech.com/verify/${selectedCertificate.credentialId}`}
                    className="flex-1 px-3 py-2 text-xs bg-surface-secondary border border-border rounded-md text-muted"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyLink}>
                    {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-xs text-success">¡Enlace copiado!</p>}
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold">Compartir en redes</label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                    <LinkIcon className="h-5 w-5 text-[#0A66C2]" />
                    <span className="text-[10px]">LinkedIn</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                    <Globe className="h-5 w-5 text-[#1DA1F2]" />
                    <span className="text-[10px]">Twitter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-[10px]">Email</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                    <MessageCircle className="h-5 w-5 text-success" />
                    <span className="text-[10px]">WhatsApp</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShareModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                handleCopyLink();
                setShareModalOpen(false);
              }}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Copiar Enlace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
