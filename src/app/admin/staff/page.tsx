"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShieldBan, KeyRound, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock Data
const CLIENTS = [
  { id: 1, name: "Carlos Mendoza", email: "carlos.m@empresa.com", date: "2023-10-12", status: "Activo" },
  { id: 2, name: "Ana Torres", email: "ana.t@construccion.pe", date: "2023-10-14", status: "Bloqueado" },
  { id: 3, name: "Luis Fernandez", email: "luis.fe@mineria.sa", date: "2023-10-15", status: "Activo" },
  { id: 4, name: "Maria Quispe", email: "m.quispe@logistica.com", date: "2023-10-18", status: "Activo" },
]

export default function StaffAndAccessPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'clients'>('staff')
  const [selectedArea, setSelectedArea] = useState('')

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
        <div className="space-y-6">
          <Card className="bg-surface/50 border-border">
            <CardHeader>
              <CardTitle>Registrar Nuevo Usuario / Staff</CardTitle>
              <CardDescription>Añade personal interno y asigna sus áreas correspondientes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">DNI</label>
                  <Input placeholder="Ej. 74839201" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nombres</label>
                  <Input placeholder="Ej. Juan" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Apellidos</label>
                  <Input placeholder="Ej. Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Área a la que pertenece</label>
                  <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  >
                    <option value="">Seleccione área...</option>
                    <option value="Administración">Administración</option>
                    <option value="Gerencia">Gerencia</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Logística y Almacén">Logística y Almacén</option>
                    <option value="Empleado de Planta">Empleado de Planta</option>
                  </select>
                </div>
                {selectedArea === 'Empleado de Planta' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-foreground">Sub-Área</label>
                    <select className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                      <option value="">Seleccione sub-área...</option>
                      <option value="Mina">Mina</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Operaciones">Operaciones</option>
                      <option value="Seguridad">Seguridad</option>
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
                  <Input type="email" placeholder="juan.perez@empresa.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Teléfono</label>
                  <Input type="tel" placeholder="+51 987 654 321" />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Usuario
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-surface/50 border-border">
             <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
              <div>
                <CardTitle>Directorio de Staff</CardTitle>
                <CardDescription>Personal con acceso a los módulos internos de la plataforma.</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                <Input placeholder="Filtrar por nombre o área..." className="pl-9 bg-surface-secondary/50 border-transparent focus:border-primary w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DNI</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Área / Sub-área</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">74581203</TableCell>
                    <TableCell>Carlos Mendoza</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-surface-secondary text-slate-300">Logística y Almacén</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">carlos.m@empresa.com</div>
                      <div className="text-xs text-muted">+51 999 888 777</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-success border-success/30 bg-success/10">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" title="Más acciones">
                            <MoreVertical className="h-4 w-4 text-muted hover:text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">41258963</TableCell>
                    <TableCell>Luis Fernandez</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="bg-surface-secondary text-slate-300">Empleado de Planta</Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Mina</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">luis.f@empresa.com</div>
                      <div className="text-xs text-muted">+51 987 654 321</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-success border-success/30 bg-success/10">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" title="Más acciones">
                            <MoreVertical className="h-4 w-4 text-muted hover:text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-danger">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
