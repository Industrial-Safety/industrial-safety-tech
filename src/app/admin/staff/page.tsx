"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShieldBan, KeyRound, MoreVertical } from "lucide-react"

// Mock Data
const CLIENTS = [
  { id: 1, name: "Carlos Mendoza", email: "carlos.m@empresa.com", date: "2023-10-12", status: "Activo" },
  { id: 2, name: "Ana Torres", email: "ana.t@construccion.pe", date: "2023-10-14", status: "Bloqueado" },
  { id: 3, name: "Luis Fernandez", email: "luis.fe@mineria.sa", date: "2023-10-15", status: "Activo" },
  { id: 4, name: "Maria Quispe", email: "m.quispe@logistica.com", date: "2023-10-18", status: "Activo" },
]

export default function StaffAndAccessPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'clients'>('staff')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff y Control de Acceso</h1>
          <p className="text-muted">Gestiona roles corporativos y supervisa clientes registrados.</p>
        </div>
        
        <div className="flex bg-surface-secondary rounded-lg p-1 border border-border">
          <button 
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'staff' ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Registro de Staff
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'clients' ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Auditoría de Clientes
          </button>
        </div>
      </div>

      {activeTab === 'staff' ? (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-surface/50 border-border md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Crear Nuevo Staff</CardTitle>
              <CardDescription>Añade personal interno con acceso administrativo al sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre Completo</label>
                <Input placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Corporativo</label>
                <Input type="email" placeholder="juan.perez@empresa.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rol Asignado</label>
                <Select>
                  <option value="">Selecciona un rol...</option>
                  <option value="jefe_seguridad">Jefe de Seguridad</option>
                  <option value="instructor">Instructor de Cursos</option>
                  <option value="gerencia">Gerencia General</option>
                  <option value="admin">Administrador del Sistema</option>
                </Select>
              </div>
              <Button className="w-full mt-2 gap-2">
                <Plus className="w-4 h-4" />
                Registrar Usuario
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-surface/50 border-border md:col-span-2">
             <CardHeader>
              <CardTitle>Staff Actual</CardTitle>
              <CardDescription>Personal con acceso a los módulos internos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted">
                <p>Las tablas extendidas de staff se mostrarán aquí.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-surface/50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div>
              <CardTitle>Auditoría de Clientes</CardTitle>
              <CardDescription>Supervisa y gestiona los accesos de clientes auto-registrados.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
              <Input placeholder="Buscar cliente..." className="pl-9 bg-surface-secondary/50 border-transparent focus:border-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CLIENTS.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="text-muted">{client.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={client.status === 'Activo' ? 'text-success border-success/30 bg-success/10' : 'text-danger border-danger/30 bg-danger/10'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Resetear Contraseña">
                          <KeyRound className="h-4 w-4 text-muted hover:text-primary transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon" title={client.status === 'Activo' ? 'Bloquear Usuario' : 'Desbloquear Usuario'}>
                          <ShieldBan className={`h-4 w-4 transition-colors ${client.status === 'Activo' ? 'text-muted hover:text-danger' : 'text-danger hover:text-success'}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
