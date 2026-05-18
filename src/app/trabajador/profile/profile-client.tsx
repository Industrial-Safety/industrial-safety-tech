"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Save, User, Mail, Phone, Shield, CheckCircle2, HardHat, Link, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { useProfileAvatar } from "@/hooks/use-profile-avatar";

interface TrabajadorProfileClientProps {
  initialData: {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarUrl?: string;
    dni?: string;
  };
  accessToken: string;
}

export default function TrabajadorProfileClient({ initialData, accessToken }: TrabajadorProfileClientProps) {
  const router = useRouter();
  const { updateAvatar } = useProfileAvatar(initialData.email);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: initialData.name, phone: initialData.phone, avatarUrl: initialData.avatarUrl ?? "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatarUrl);
  const qrRef = useRef<HTMLDivElement>(null);

  const qrData = JSON.stringify({
    nombre: initialData.name,
    dni: initialData.dni || "",
    rol: "Trabajador",
    email: initialData.email,
  });

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${initialData.name.replace(/\s+/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
      const parts = formData.name.trim().split(" ");
      const name = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || name;

      const body: Record<string, string> = {
        name,
        lastName,
        email: initialData.email,
        cellphone: formData.phone,
        role: "ROLE_TRABAJADOR",
        password: "oauth_user_secret",
        urlPhoto: formData.avatarUrl || initialData.avatarUrl || "",
      };

      if (avatarFile) {
        const presignRes = await fetch(
          `/api/proxy/storage/upload-url?fileName=${encodeURIComponent("users/profile-photos/" + avatarFile.name)}&contentType=${encodeURIComponent(avatarFile.type)}`
        );
        if (presignRes.ok) {
          const { uploadUrl, fileUrl } = await presignRes.json();
          const s3Res = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": avatarFile.type },
            body: avatarFile,
          });
          if (s3Res.ok) body.urlPhoto = fileUrl;
        }
      }

      const res = await fetch(`/api/proxy/users/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (body.urlPhoto) updateAvatar(body.urlPhoto);
        toast.success("Perfil actualizado correctamente");
        router.refresh();
      } else {
        toast.error("Error al guardar cambios");
      }
    } catch {
      toast.error("Error crítico al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Avatar + resumen */}
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
              className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={18} />
              <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-foreground">{initialData.name}</h2>
            <p className="text-sm font-medium text-primary mt-1">Trabajador</p>
            {initialData.dni && (
              <p className="text-xs text-muted mt-1">DNI: {initialData.dni}</p>
            )}
          </div>
          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Inicio de sesión exitoso</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              <HardHat size={16} className="text-primary" />
              <span>Personal operativo activo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario + QR */}
      <div className="md:col-span-2 space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="flex-1 border-primary/10 shadow-lg">
            <CardHeader className="border-b border-primary/5 pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User size={20} className="text-primary" /> Información Personal
              </CardTitle>
              <CardDescription>Actualiza tu nombre, teléfono y foto de perfil.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-11 bg-secondary/20 focus:bg-background transition-colors border-primary/10"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input value={initialData.email} disabled className="pl-10 h-11 bg-muted/30 cursor-not-allowed opacity-70" />
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">El correo no es modificable.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-11 bg-secondary/20 focus:bg-background transition-colors border-primary/10"
                    placeholder="+51 999 888 777"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">URL de Foto</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={formData.avatarUrl}
                    onChange={(e) => { setFormData({ ...formData, avatarUrl: e.target.value }); setAvatarPreview(e.target.value || undefined); }}
                    className="pl-10 h-11 bg-secondary/20 focus:bg-background transition-colors border-primary/10"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-11 px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {isSaving ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* QR Card */}
          <Card className="border-primary/10 shadow-lg lg:w-56 shrink-0 flex flex-col">
            <CardHeader className="border-b border-primary/5 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <QrCode size={18} className="text-primary" /> Código QR
              </CardTitle>
              <CardDescription className="text-xs">Identificación del trabajador</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center gap-4 flex-1 justify-between">
              <div ref={qrRef} className="p-3 bg-white rounded-xl shadow-inner">
                <QRCode value={qrData} size={150} />
              </div>
              <div className="w-full space-y-1 text-center">
                <p className="text-xs font-semibold truncate">{initialData.name}</p>
                {initialData.dni && <p className="text-[10px] text-muted">DNI: {initialData.dni}</p>}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/20 text-primary hover:bg-primary/10 gap-2"
                onClick={handleDownloadQR}
              >
                <Download size={14} /> Descargar QR
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/10 shadow-lg overflow-hidden">
          <CardHeader className="border-b border-primary/5 pb-4 bg-muted/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield size={20} className="text-primary" /> Seguridad de Cuenta
            </CardTitle>
            <CardDescription>Gestionada a través de Keycloak.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 opacity-50">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-semibold">Contraseña</Label>
                <Input type="password" disabled className="bg-muted/50" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" disabled className="text-xs h-9">Gestionar en Keycloak</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
