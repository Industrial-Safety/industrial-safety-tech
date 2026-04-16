"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { KeyRound, Mail, Save, Server, Shield, MessageCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración de Integraciones</h1>
          <p className="text-muted">Gestiona claves de API, almacenamiento y servicios de notificación.</p>
        </div>
        
        <Button className="gap-2 shrink-0">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Keys */}
        <Card className="bg-surface/50 border-border md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              API Keys y Secretos
            </CardTitle>
            <CardDescription>Credenciales maestras para los servicios subyacentes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                 Spring AI Token
              </label>
              <Input type="password" defaultValue="************************" className="font-mono text-sm" />
              <p className="text-xs text-muted">Usado para inferencia de modelos en el backend.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-success" /> WhatsApp Business API
              </label>
              <Input type="password" defaultValue="EAAGm0P*****************" className="font-mono text-sm" />
              <p className="text-xs text-muted">Token para envío de alertas automáticas a Jefes de Seguridad.</p>
            </div>
          </CardContent>
        </Card>

        {/* AWS S3 */}
        <Card className="bg-surface/50 border-border md:col-span-1">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Almacenamiento (AWS S3)
            </CardTitle>
            <CardDescription>Configura los buckets para guardar los certificados e incidentes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">AWS Access Key ID</label>
              <Input type="text" defaultValue="AKIAIOSFODNN7EXAMPLE" className="font-mono text-sm text-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">AWS Secret Access Key</label>
              <Input type="password" defaultValue="************************" className="font-mono text-sm text-muted" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Región</label>
              <Input type="text" defaultValue="us-east-1" className="font-mono text-sm text-muted" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications SMTP */}
        <Card className="bg-surface/50 border-border md:col-span-2">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Configuración de Correos (SMTP)
            </CardTitle>
            <CardDescription>Servidor saliente para notificaciones del sistema corporativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Host SMTP</label>
                  <Input type="text" defaultValue="smtp.sendgrid.net" className="font-mono text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Puerto</label>
                    <Input type="number" defaultValue={587} className="font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Seguridad</label>
                    <select className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>Ninguna</option>
                    </select>
                  </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email de Remitente (From)</label>
                    <Input type="email" defaultValue="alertas@industrialsafety.pe" className="text-sm" />
                  </div>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Usuario SMTP</label>
                  <Input type="text" defaultValue="apikey" className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contraseña SMTP</label>
                  <Input type="password" defaultValue="************************" className="font-mono text-sm" />
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-foreground">Envío a través de Microservicio</label>
                    <p className="text-xs text-muted">Usar la cola RabbitMQ para envíos en lugar de disparo directo.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                 <div className="pt-4">
                    <Button variant="outline" className="w-full gap-2">
                      <Shield className="w-4 h-4" />
                      Probar Configuración
                    </Button>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
