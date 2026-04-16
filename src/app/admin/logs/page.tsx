"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, BrainCircuit, RefreshCw, Filter, FileText } from "lucide-react"

// Mock Logs
const ACTIVITY_LOGS = [
  { id: "LOG-001", timestamp: "2023-10-24 08:15:22", actor: "Admin (juan.p)", action: "Admin cambió IP de Cámara 1", module: "Hardware", severity: "warning" },
  { id: "LOG-002", timestamp: "2023-10-24 09:30:11", actor: "Sistema", action: "Reinicio automático del servicio de inferencia", module: "IA Core", severity: "info" },
  { id: "LOG-003", timestamp: "2023-10-24 10:45:00", actor: "Admin (juan.p)", action: "Admin desactivó cuenta de Instructor X", module: "Staff/RBAC", severity: "danger" },
  { id: "LOG-004", timestamp: "2023-10-24 11:10:45", actor: "Sistema", action: "Alerta enviada por WhatsApp (Intrusión Z-A)", module: "Notificaciones", severity: "info" },
  { id: "LOG-005", timestamp: "2023-10-24 14:22:10", actor: "Jefe Seg. (miguel.a)", action: "Descarga de reporte de incidentes", module: "Reportes", severity: "info" },
]

export default function LogsPage() {
  const [updatingModel, setUpdatingModel] = useState(false)

  const handleUpdateModel = () => {
    setUpdatingModel(true)
    setTimeout(() => {
      setUpdatingModel(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoría y Logs del Sistema</h1>
        <p className="text-muted">Registro de actividad crítica y mantenimiento del motor de IA.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* IA Model Maintenance */}
        <Card className="bg-surface/50 border-primary/20 md:col-span-1 shadow-[0_0_15px_rgba(245,158,11,0.1)] h-fit relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <CardHeader>
             <CardTitle className="flex items-center gap-2 text-primary">
              <BrainCircuit className="w-5 h-5" />
              Mantenimiento de IA
            </CardTitle>
            <CardDescription>Gestión del modelo de detección de cascos y guantes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-surface rounded-md border border-border">
              <div className="text-xs text-muted mb-1">Versión Actual Activa</div>
              <div className="font-mono font-medium text-foreground">v2.4.1 (YOLOv8-Safety)</div>
              <div className="text-xs text-success mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span> Online
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cambiar Versión</label>
              <Select>
                <option value="v2.4.1">v2.4.1 (Actual) - Estable</option>
                <option value="v2.5.0-rc">v2.5.0-rc - Beta</option>
                <option value="v2.3.9">v2.3.9 - Rollback</option>
              </Select>
              <p className="text-xs text-muted">El cambio de versión se aplica en caliente (Hot Swap) sin reiniciar el sistema principal.</p>
            </div>

            <Button 
              className="w-full gap-2 mt-2" 
              onClick={handleUpdateModel}
              disabled={updatingModel}
            >
              {updatingModel ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Aplicando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" /> Aplicar Versión
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="bg-surface/50 border-border md:col-span-2">
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-muted" />
                  Visor de Logs de Actividad
                </CardTitle>
                <CardDescription>Historial de acciones críticas del sistema.</CardDescription>
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                <Filter className="w-4 h-4" />
                Filtrar Logs
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
              <Input placeholder="Buscar en logs por actor o acción..." className="pl-9 bg-surface-secondary/50 border-transparent focus:border-primary w-full" />
            </div>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVITY_LOGS.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted">{log.timestamp}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{log.actor}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {log.severity === 'warning' && <span className="w-2 h-2 rounded-full bg-warning shrink-0" title="Advertencia"></span>}
                        {log.severity === 'danger' && <span className="w-2 h-2 rounded-full bg-danger shrink-0" title="Crítico"></span>}
                        {log.severity === 'info' && <span className="w-2 h-2 rounded-full bg-muted shrink-0" title="Informativo"></span>}
                        <span className={log.severity === 'danger' ? 'text-danger' : log.severity === 'warning' ? 'text-warning' : ''}>
                          {log.action}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-surface-secondary">
                        {log.module}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center text-sm text-muted">
              <span>Mostrando 5 de 1,240 registros</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>Anterior</Button>
                <Button variant="ghost" size="sm">Siguiente</Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}
