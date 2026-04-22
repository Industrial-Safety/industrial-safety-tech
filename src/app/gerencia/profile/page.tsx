"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Building, Briefcase, KeyRound, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-2 mb-8">
        <User className="h-8 w-8 text-emerald-500" />
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Sidebar Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-surface border-border shadow-sm text-center">
            <CardContent className="pt-6">
              <Avatar 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces" 
                alt="Gerente General" 
                size="xl" 
                className="mx-auto mb-4 border-4 border-surface shadow-xl"
              />
              <h2 className="text-xl font-bold">Roberto Silva</h2>
              <p className="text-emerald-500 text-sm font-medium mt-1">Gerente General</p>
              
              <div className="mt-6 flex justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                  <Shield className="h-3.5 w-3.5" /> Acceso Total
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-surface border-border shadow-sm">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos de contacto y posición.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Nombres
                  </label>
                  <Input defaultValue="Roberto" className="bg-surface-secondary/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Apellidos</label>
                  <Input defaultValue="Silva" className="bg-surface-secondary/50 border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Correo Electrónico Corporativo
                </label>
                <Input defaultValue="rsilva@industrial-safety.com" type="email" className="bg-surface-secondary/50 border-border/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" /> Empresa
                  </label>
                  <Input defaultValue="Industrial Safety Corp." disabled className="bg-surface-secondary/20 border-border/20 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Cargo
                  </label>
                  <Input defaultValue="Gerente General" disabled className="bg-surface-secondary/20 border-border/20 text-muted-foreground" />
                </div>
              </div>

              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">Guardar Cambios</Button>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-danger flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Seguridad de la Cuenta
              </CardTitle>
              <CardDescription>Gestiona tu contraseña y autenticación de dos pasos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="border-border/50 mr-4">Cambiar Contraseña</Button>
              <Button variant="outline" className="border-border/50">Activar 2FA</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
