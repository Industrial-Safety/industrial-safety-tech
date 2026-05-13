"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Briefcase, MapPin, Key, Camera, ShieldCheck, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfileAvatar } from "@/hooks/use-profile-avatar";

export default function JefeProfilePage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fullName = session?.user?.name || "Jefe de Seguridad";
  const email = session?.user?.email || "";
  const fallbackAvatar = session?.user?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces";

  const { avatarUrl: storedAvatar, updateAvatar } = useProfileAvatar(email || undefined);
  const avatarUrl = storedAvatar || fallbackAvatar;

  const [formData, setFormData] = useState({
    nombre: fullName,
    email: email,
    telefono: "",
    cargo: "Jefe de Prevención y Riesgos",
    departamento: "SSOMA",
    ubicacion: "Planta Principal - Lima",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) updateAvatar(ev.target.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-amber-500" />
          Mi Perfil
        </h1>
        <p className="text-sm text-muted">Gestiona tu información personal y configuración de seguridad.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna Izquierda: Avatar y Resumen */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-surface/30 overflow-hidden text-center">
            <div className="h-24 bg-gradient-to-r from-amber-600 to-amber-400 w-full"></div>
            <CardContent className="pt-0 relative px-6 pb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <div className="relative mx-auto -mt-12 h-24 w-24 group">
                <Avatar
                  src={avatarUrl}
                  alt={fullName}
                  size="xl"
                  className="h-24 w-24 rounded-full border-4 border-slate-950 shadow-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {uploading ? (
                    <Loader2 className="h-7 w-7 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-6 w-6 text-white" />
                      <span className="text-[10px] text-white uppercase font-medium tracking-wide mt-1">Cambiar</span>
                    </>
                  )}
                </button>
                {!uploading && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-amber-500 rounded-full border-2 border-slate-950 text-white hover:bg-amber-400 transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <h2 className="mt-4 text-xl font-bold text-white">{fullName}</h2>
              <p className="text-sm text-slate-400">{formData.cargo}</p>

              <div className="mt-4 flex justify-center gap-2">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Admin</Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Activo</Badge>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span>{formData.ubicacion}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-surface/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Nivel de Acceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  Solicitudes EPP
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  Monitoreo Cámaras IA
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  Edición de Usuarios (Staff)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Formulario de Edición */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-surface/30">
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
                    <Input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="bg-slate-900 border-slate-700 text-muted-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Teléfono</label>
                    <Input
                      placeholder="+51 987 654 321"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Cargo</label>
                    <Input
                      value={formData.cargo}
                      onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Departamento</label>
                    <Input
                      value={formData.departamento}
                      onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Sede / Ubicación
                    </label>
                    <Input
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      className="bg-slate-900 border-slate-700"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-surface/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-slate-400" />
                Seguridad de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Contraseña Actual</label>
                <Input type="password" placeholder="••••••••" className="bg-slate-900 border-slate-700 max-w-md" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nueva Contraseña</label>
                  <Input type="password" placeholder="••••••••" className="bg-slate-900 border-slate-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Confirmar Contraseña</label>
                  <Input type="password" placeholder="••••••••" className="bg-slate-900 border-slate-700" />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white">
                  Actualizar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
