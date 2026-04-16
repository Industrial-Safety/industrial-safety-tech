"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Video, Search, Wifi, WifiOff, Trash2, Edit2, Loader2 } from "lucide-react"

// Mock Data
const INITIAL_CAMERAS = [
  { id: "CAM-001", model: "Hikvision DS-2CD2083G2-IU", ip: "192.168.1.101", stream_url: "rtsp://admin:12345@192.168.1.101:554/Streaming/Channels/101", status: "Online" },
  { id: "CAM-002", model: "Dahua IPC-HFW2431S-S-S2", ip: "192.168.1.102", stream_url: "rtsp://admin:12345@192.168.1.102:554/cam/realmonitor?channel=1&subtype=0", status: "Online" },
  { id: "CAM-003", model: "Axis P1375", ip: "192.168.1.103", stream_url: "rtsp://root:pass@192.168.1.103/axis-media/media.amp", status: "Offline" },
  { id: "CAM-004", model: "Bosch NDE-3502-AL", ip: "192.168.1.104", stream_url: "rtsp://192.168.1.104/?h26x=4", status: "Online" },
]

export default function HardwareConfigPage() {
  const [cameras, setCameras] = useState(INITIAL_CAMERAS)
  const [testingId, setTestingId] = useState<string | null>(null)

  const handleTestConnection = (id: string) => {
    setTestingId(id)
    // Simulate network delay
    setTimeout(() => {
      setCameras(prev => prev.map(cam => 
        cam.id === id ? { ...cam, status: Math.random() > 0.2 ? 'Online' : 'Offline' } : cam
      ))
      setTestingId(null)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro y Configuración de Hardware</h1>
          <p className="text-muted">Inventario de dispositivos y validación de streams RTSP/RTMP.</p>
        </div>
        
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Añadir Cámara
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Simple Analytics for Hardware */}
        <Card className="bg-surface/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Total Registradas</CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cameras.length}</div>
            </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Cámaras Activas</CardTitle>
              <Wifi className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cameras.filter(c => c.status === 'Online').length}</div>
            </CardContent>
        </Card>
        <Card className="bg-surface/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted">Cámaras Offline</CardTitle>
              <WifiOff className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{cameras.filter(c => c.status === 'Offline').length}</div>
            </CardContent>
        </Card>
      </div>

      <Card className="bg-surface/50 border-border">
        <CardHeader className="flex flex-row flex-col items-start gap-4 md:flex-row md:items-center justify-between pb-6">
          <div>
            <CardTitle>Inventario de Dispositivos</CardTitle>
            <CardDescription>Lista completa de hardware vinculado al análisis de IA.</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
            <Input placeholder="Buscar por IP o ID..." className="pl-9 bg-surface-secondary/50 border-transparent focus:border-primary w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Cámara</TableHead>
                <TableHead>Marca / Modelo</TableHead>
                <TableHead>Dirección IP</TableHead>
                <TableHead className="w-[300px]">URL de Stream (RTSP/RTMP)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell className="font-medium">{camera.id}</TableCell>
                  <TableCell>{camera.model}</TableCell>
                  <TableCell className="text-muted">{camera.ip}</TableCell>
                  <TableCell className="font-mono text-xs text-muted max-w-[200px] truncate" title={camera.stream_url}>
                    {camera.stream_url}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={camera.status === 'Online' ? 'text-success border-success/30 bg-success/10' : 'text-danger border-danger/30 bg-danger/10'}>
                      {camera.status === 'Online' ? <Wifi className="w-3 h-3 mr-1 inline-block" /> : <WifiOff className="w-3 h-3 mr-1 inline-block" />}
                      {camera.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                        variant="outline" 
                        size="sm" 
                        title="Testear Conexión"
                        onClick={() => handleTestConnection(camera.id)}
                        disabled={testingId === camera.id}
                        className="text-xs"
                      >
                        {testingId === camera.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar Info">
                        <Edit2 className="h-4 w-4 text-muted hover:text-foreground transition-colors" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Eliminar Cámara">
                        <Trash2 className="h-4 w-4 text-muted hover:text-danger transition-colors" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
