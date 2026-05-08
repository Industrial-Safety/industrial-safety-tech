import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Phone, Building, Briefcase, Lock, Save, Camera, Loader2 } from "lucide-react";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  avatarUrl?: string;
}

interface ProfileSettingsProps {
  initialData: UserProfileData;
  onUpdateProfile?: (data: Partial<UserProfileData>) => Promise<void> | void;
  onChangePassword?: (currentPass: string, newPass: string) => Promise<void> | void;
  onAvatarChange?: (file: File) => Promise<string | null> | string | null;
}

export function ProfileSettings({ initialData, onUpdateProfile, onChangePassword, onAvatarChange }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone || "",
    department: initialData.department || "",
  });

  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(initialData.avatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    if (onAvatarChange) {
      setUploadingAvatar(true);
      try {
        const newUrl = await onAvatarChange(file);
        if (newUrl) setAvatarPreview(newUrl);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    if (onUpdateProfile) {
      await onUpdateProfile(formData);
    }
    setTimeout(() => setSavingSettings(false), 800);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert("Las contrasenas no coinciden");
      return;
    }
    setSavingPassword(true);
    if (onChangePassword) {
      await onChangePassword(passData.current, passData.new);
    }
    setTimeout(() => {
      setSavingPassword(false);
      setPassData({ current: "", new: "", confirm: "" });
    }, 800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-surface/50 border-border backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8 flex flex-col items-center">
            <div className="relative group">
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
                disabled={uploadingAvatar}
              />
              <label htmlFor="avatar-upload-input" className="cursor-pointer block">
                <Avatar
                  src={avatarPreview}
                  alt={initialData.name}
                  size="xl"
                  className="h-32 w-32 border-4 border-surface-secondary shadow-lg group-hover:border-primary transition-colors"
                  fallback={<User className="h-12 w-12 text-muted" />}
                />
                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadingAvatar ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-7 w-7 text-white mb-1" />
                      <span className="text-[10px] text-white uppercase font-medium tracking-wide">Cambiar</span>
                    </>
                  )}
                </div>
              </label>
              {!uploadingAvatar && (
                <label
                  htmlFor="avatar-upload-input"
                  className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                </label>
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold">{initialData.name}</h2>
            <p className="text-sm text-primary font-medium">{initialData.role}</p>
            <p className="text-xs text-muted mt-1 text-center max-w-[200px]">
              Se unio en Enero 2026
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                Inicio de sesion exitoso (Hoy, 09:30 AM)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Actualizacion de contrasena (Hace 2 meses)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-surface/50 border-border">
          <CardHeader>
            <CardTitle>Informacion Personal</CardTitle>
            <CardDescription>
              Actualiza tus datos de contacto y preferencias publicas.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Nombre Completo
                  </label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    readOnly={true}
                    className="bg-surface-secondary/50 select-none"
                  />
                  <p className="text-[10px] text-muted ml-6">El nombre oficial es manejado por el sistema.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Correo Institucional
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    readOnly={true}
                    className="bg-surface-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Telefono
                  </label>
                  <Input
                    placeholder="+51 999 888 777"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Departamento
                  </label>
                  <Input
                    placeholder="Ej. Seguridad y Salud..."
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border mt-4 pt-6 justify-end">
              <Button type="submit" disabled={savingSettings} className="gap-2">
                <Save className="h-4 w-4" />
                {savingSettings ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="bg-surface/50 border-border border-l-4 border-l-primary/50">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Seguridad de Cuenta
            </CardTitle>
            <CardDescription>
              Es recomendable usar una contrasena fuerte y no reutilizarla.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <label className="text-sm font-medium text-muted-foreground">
                  Contrasena Actual
                </label>
                <Input
                  type="password"
                  required
                  value={passData.current}
                  onChange={e => setPassData({...passData, current: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nueva Contrasena
                  </label>
                  <Input
                    type="password"
                    required
                    value={passData.new}
                    onChange={e => setPassData({...passData, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Confirmar Contrasena
                  </label>
                  <Input
                    type="password"
                    required
                    value={passData.confirm}
                    onChange={e => setPassData({...passData, confirm: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Requisitos de Seguridad:</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <li className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/50" /> Minimo 8 caracteres
                  </li>
                  <li className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/50" /> Al menos una mayuscula
                  </li>
                  <li className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/50" /> Al menos un numero
                  </li>
                  <li className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-primary/50" /> Un caracter especial (@, #, $)
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border mt-4 pt-6 justify-end">
              <Button type="submit" variant="secondary" disabled={savingPassword || passData.new.length < 6}>
                Actualizar Contrasena
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}