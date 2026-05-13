"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Building, Briefcase, KeyRound, Shield, Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfileAvatar } from "@/hooks/use-profile-avatar";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fullName = session?.user?.name || "Gerente General";
  const email = session?.user?.email || "";
  const fallbackAvatar = session?.user?.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces";

  const { avatarUrl: storedAvatar, updateAvatar } = useProfileAvatar(email || undefined);
  const avatarUrl = storedAvatar || fallbackAvatar;

  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateAvatar(ev.target.result as string);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <div className="relative mx-auto w-fit group">
                <Avatar
                  src={avatarUrl}
                  alt={fullName}
                  size="xl"
                  className="mx-auto mb-4 border-4 border-surface shadow-xl"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 mb-4 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
              </div>
              <h2 className="text-xl font-bold">{fullName}</h2>
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
                  <Input defaultValue={firstName} className="bg-surface-secondary/50 border-border/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Apellidos</label>
                  <Input defaultValue={lastName} className="bg-surface-secondary/50 border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Correo Electrónico Corporativo
                </label>
                <Input defaultValue={email} type="email" className="bg-surface-secondary/50 border-border/50" />
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
