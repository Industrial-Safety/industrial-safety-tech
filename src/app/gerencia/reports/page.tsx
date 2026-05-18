"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileBarChart, FileX } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <FileBarChart className="h-8 w-8 text-emerald-500" /> Reportes Oficiales
        </h1>
        <p className="text-muted">Centro de descarga de informes ejecutivos y resultados de auditorías.</p>
      </div>

      <Card className="bg-surface border-border">
        <CardContent className="py-20">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-surface-secondary flex items-center justify-center">
              <FileX className="h-8 w-8 text-muted" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Sin reportes disponibles</p>
              <p className="text-sm text-muted max-w-md">
                La generación de reportes ejecutivos aún no está disponible en el backend.
                Los datos de incidentes y compras pueden consultarse desde las secciones de Auditoría y Análisis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
