"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Share2, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data
const CERTIFICATES = [
  {
    id: "CERT-2026-001",
    course: "Primeros Auxilios Básicos",
    date: "15 Feb 2026",
    expires: "15 Feb 2028",
    status: "valid", // valid, expiring, expired
    instructor: "Dra. Elena Silva",
  },
  {
    id: "CERT-2025-089",
    course: "Manejo de Materiales Peligrosos (HAZMAT)",
    date: "10 Nov 2025",
    expires: "10 Nov 2026",
    status: "valid",
    instructor: "Ing. Carlos Mendoza",
  },
  {
    id: "CERT-2024-042",
    course: "Trabajo Seguro en Alturas",
    date: "05 May 2024",
    expires: "05 May 2025",
    status: "expiring",
    instructor: "Ing. Roberto Martínez",
  }
];

export default function CertificatesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mis Certificados</h1>
        <p className="text-muted">Historial de capacitaciones aprobadas y credenciales oficiales.</p>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Historial Académico</CardTitle>
              <CardDescription>
                Descarga tus certificados en formato PDF para presentarlos a Recursos Humanos.
              </CardDescription>
            </div>
            <Button variant="outline" className="shrink-0">
              <ExternalLink className="mr-2 h-4 w-4" /> Validar Certificado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-surface-secondary/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="min-w-[250px]">Curso de Certificación</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CERTIFICATES.length === 0 && (
                     <TableRow className="border-border">
                        <TableCell colSpan={5} className="h-24 text-center text-muted">
                          Aún no tienes certificados adquiridos.
                        </TableCell>
                     </TableRow>
                  )}
                  {CERTIFICATES.map((cert) => (
                    <TableRow key={cert.id} className="border-border border-b last:border-0 hover:bg-surface-secondary/20">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{cert.course}</p>
                            <p className="text-xs text-muted font-normal mt-0.5">ID: {cert.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted">{cert.date}</TableCell>
                      <TableCell className="text-muted">{cert.expires}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${cert.status === 'valid' ? 'border-success text-success' : ''}
                            ${cert.status === 'expiring' ? 'border-warning text-warning' : ''}
                            ${cert.status === 'expired' ? 'border-danger text-danger' : ''}
                          `}
                        >
                          {cert.status === 'valid' && 'Vigente'}
                          {cert.status === 'expiring' && 'Por Vencer'}
                          {cert.status === 'expired' && 'Vencido'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 shadow-sm border border-border hover:bg-surface-secondary hover:text-primary" title="Descargar PDF">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 border border-border hover:bg-[#0a66c2]/10 hover:text-[#0a66c2] hover:border-[#0a66c2]/30 transition-colors" title="Compartir en LinkedIn">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">LinkedIn</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
        </CardContent>
      </Card>
      
    </div>
  );
}
