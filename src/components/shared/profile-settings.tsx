import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Phone, Building, Briefcase, Lock, Save } from "lucide-react";

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
}

export function ProfileSettings({ initialData, onUpdateProfile, onChangePassword }: ProfileSettingsProps) {
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    if (onUpdateProfile) {
      await onUpdateProfile(formData);
    }
    setTimeout(() => setSavingSettings(false), 800); // simulated network delay
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert("Las contraseñas no coinciden");
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
      {/* Vista de Perfil - Columna Izquierda */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-surface/50 border-border backdrop-blur-sm shadow-xl">
          <CardContent className="pt-8 flex flex-col items-center">
            <div className="relative group">
              <Avatar 
                src={initialData.avatarUrl} 
                alt={initialData.name} 
                size="xl" 
                className="h-32 w-32 border-4 border-surface-secondary shadow-lg group-hover:border-primary transition-colors"
                fallback={<User className="h-12 w-12 text-muted" />}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-xs text-white uppercase font-medium tracking-wide">Cambiar</span>
              </div>
            </div>
            
            <h2 className="mt-4 text-xl font-bold">{initialData.name}</h2>
            <p className="text-sm text-primary font-medium">{initialData.role}</p>
            <p className="text-xs text-muted mt-1 text-center max-w-[200px]">
              Se unió en Enero 2026
            </p>
          </CardContent>
        </Card>

        {/* Resumen extra dependiendo del rol si hiciera falta */}
        <Card className="bg-surface/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                Inicio de sesión exitoso (Hoy, 09:30 AM)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Actualización de contraseña (Hace 2 meses)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Formularios - Columnas Derecha */}
      <div className="lg:col-span-2 space-y-6">
        {/* Información Personal */}
        <Card className="bg-surface/50 border-border">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tus datos de contacto y preferencias públicas.
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
                    readOnly={true} // Por política general, recursos humanos gestiona el nombre oficial
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
                    <Phone className="h-4 w-4" /> Teléfono
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

        {/* Seguridad */}
        <Card className="bg-surface/50 border-border border-l-4 border-l-primary/50">
          <CardHeader>
            <CardTitle className="text-warning flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Seguridad de Cuenta
            </CardTitle>
            <CardDescription>
              Es recomendable usar una contraseña fuerte y no reutilizarla.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-md">
                <label className="text-sm font-medium text-muted-foreground">
                  Contraseña Actual
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
                    Nueva Contraseña
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
                    Confirmar Contraseña
                  </label>
                  <Input 
                    type="password" 
                    required
                    value={passData.confirm}
                    onChange={e => setPassData({...passData, confirm: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border mt-4 pt-6 justify-end">
              <Button type="submit" variant="secondary" disabled={savingPassword || passData.new.length < 6}>
                Actualizar Contraseña
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}
