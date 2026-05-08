"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Save, User, Mail, Phone, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileSettingsProps {
  initialData: {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarUrl?: string;
    keycloakId?: string;
  };
  accessToken: string;
}

export default function ProfileSettingsClient({ initialData, accessToken }: ProfileSettingsProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name,
    phone: initialData.phone,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Preparar el body para el backend (mapeamos name a name/lastName si es necesario)
      const parts = formData.name.trim().split(" ");
      const name = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      const body: Record<string, string> = {
        name,
        lastName,
        email: initialData.email,
        cellphone: formData.phone,
        role: "ROLE_ALUMNO",
        password: "oauth_user_secret", // Dummy password para validación
        urlPhoto: initialData.avatarUrl || "",
      };

      // 2. Si hay imagen nueva, subir a S3 vía Proxy
      if (avatarFile) {
        const presignRes = await fetch(
          `/api/storage/upload-url?fileName=${encodeURIComponent("users/profile-photos/" + avatarFile.name)}&contentType=${encodeURIComponent(avatarFile.type)}`
        );

        if (presignRes.ok) {
          const { uploadUrl, fileUrl } = await presignRes.json();

          const s3Res = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": avatarFile.type },
            body: avatarFile,
          });

          if (s3Res.ok) {
            body.urlPhoto = fileUrl;
          }
        }
      }

      // 3. Enviar actualización al backend vía Proxy
      const res = await fetch(`/api/users/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (body.urlPhoto) {
          localStorage.setItem("custom_avatar", body.urlPhoto);
        }
        toast.success("Perfil actualizado correctamente");
        router.refresh();
      } else {
        toast.error("Error al guardar cambios en el servidor");
      }
    } catch (error) {
      toast.error("Error crítico al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Columna Izquierda: Avatar y Resumen */}
      <Card className="md:col-span-1 border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
        <CardContent className="relative pt-0 -mt-16 text-center">
          <div className="relative inline-block group">
            <Avatar
              src={avatarPreview}
              alt={initialData.name}
              size="xl"
              className="border-4 border-background ring-2 ring-primary/20 shadow-xl"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform group-hover:bg-primary/90"
            >
              <Camera size={18} />
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          
          <div className="mt-4">
            <h2 className="text-xl font-bold text-foreground">{initialData.name}</h2>
            <p className="text-sm font-medium text-primary mt-1">{initialData.role}</p>
          </div>

          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Inicio de sesión exitoso</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              <CheckCircle2 size={16} className="text-primary" />
              <span>Perfil sincronizado con Keycloak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Columna Derecha: Formulario */}
      <div className="md:col-span-2 space-y-8">
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="border-b border-primary/5 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <User size={20} className="text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>Actualiza tu nombre, teléfono y foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold opacity-70">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-11 bg-secondary/20 focus:bg-background transition-colors border-primary/10"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold opacity-70">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    value={initialData.email}
                    disabled
                    className="pl-10 h-11 bg-muted/30 cursor-not-allowed opacity-70"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  El correo no es modificable en esta versión.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold opacity-70">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-11 bg-secondary/20 focus:bg-background transition-colors border-primary/10"
                    placeholder="+51 999 888 777"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all"
              >
                {isSaving ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 shadow-lg overflow-hidden group">
          <CardHeader className="border-b border-primary/5 pb-4 bg-muted/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Seguridad de Cuenta
            </CardTitle>
            <CardDescription>Es recomendable usar una contraseña fuerte y no reutilizarla.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 opacity-60">
             <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-semibold">Contraseña Actual</Label>
                  <Input type="password" disabled className="bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold">Nueva Contraseña</Label>
                    <Input type="password" disabled className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-semibold">Confirmar Contraseña</Label>
                    <Input type="password" disabled className="bg-muted/50" />
                  </div>
                </div>
             </div>
             <div className="flex justify-end pt-2">
                <Button variant="outline" disabled className="text-xs h-9">Actualizar Contraseña</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
