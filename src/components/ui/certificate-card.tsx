"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Calendar, Award, User } from "lucide-react";

export interface Certificate {
  id: number;
  studentName: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  score: number;
  issuedAt: string;
  certificateUrl: string;
}

interface CertificateCardProps {
  cert: Certificate;
  onDownload: (cert: Certificate) => void;
  onShare: (cert: Certificate) => void;
  formatDate: (iso: string) => string;
}

export function CertificateCard({ cert, onDownload, onShare, formatDate }: CertificateCardProps) {
  return (
    <div className="rounded-2xl border border-amber-900/30 overflow-hidden shadow-lg shadow-amber-900/10 hover:shadow-amber-700/20 hover:border-amber-700/50 transition-all group">

      {/* Diploma top section */}
      <div className="relative bg-gradient-to-br from-[#1a1200] via-[#2a1d00] to-[#1a1200] px-8 pt-7 pb-6 overflow-hidden">

        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-amber-700/50 rounded-tl-sm" />
        <div className="absolute top-3 right-3 w-10 h-10 border-r-2 border-t-2 border-amber-700/50 rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 w-10 h-10 border-l-2 border-b-2 border-amber-700/50 rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-amber-700/50 rounded-br-sm" />

        {/* Watermark circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <Award className="w-64 h-64 text-amber-300" />
        </div>

        {/* Header label */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-700/60" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-amber-600 uppercase shrink-0">
            Certificado de Finalización
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-700/60" />
        </div>

        {/* Student name — el elemento más importante */}
        <div className="text-center mb-4">
          <p className="text-[11px] text-amber-700/80 tracking-widest uppercase mb-1">Se certifica que</p>
          <h3 className="text-2xl font-bold text-amber-300 leading-tight tracking-wide drop-shadow-[0_0_12px_rgba(251,191,36,0.25)]">
            {cert.studentName || "—"}
          </h3>
        </div>

        {/* Course name */}
        <div className="text-center mb-5">
          <p className="text-[10px] text-amber-700/70 tracking-widest uppercase mb-1">ha completado exitosamente</p>
          <p className="text-sm font-semibold text-amber-100/90 leading-snug max-w-xs mx-auto">
            {cert.courseName}
          </p>
        </div>

        {/* Score badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
            <span className="text-emerald-400">✓</span>
            Puntaje: {cert.score}%
          </div>
        </div>
      </div>

      {/* Meta footer */}
      <div className="bg-[#0d0d0d] border-t border-amber-900/20 px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-amber-900/80">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-amber-800/60" />
          <span className="text-amber-700/70">{cert.instructorName}</span>
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <Calendar className="h-3.5 w-3.5 text-amber-800/60" />
          <span className="text-amber-700/70">{formatDate(cert.issuedAt)}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="bg-surface/60 border-t border-border flex">
        <button
          onClick={() => onDownload(cert)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-muted hover:text-amber-400 hover:bg-amber-950/20 transition-colors border-r border-border"
        >
          <Download className="h-4 w-4" /> Descargar PDF
        </button>
        <button
          onClick={() => onShare(cert)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium text-muted hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Share2 className="h-4 w-4" /> Compartir
        </button>
      </div>
    </div>
  );
}
