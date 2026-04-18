"use client";

import { ProfileSettings, UserProfileData } from "@/components/shared/profile-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Award, ShieldCheck, Download } from "lucide-react";

// --- MOCK DATA --- 
const INITIAL_STUDENT_DATA: UserProfileData = {
  id: "USR-001",
  name: "Alex Rivera",
  email: "alex.rivera@empresa-cliente.com",
  phone: "+51 987 654 321",
  role: "Operario Especializado",
  department: "Planta de Producción Norte",
  avatarUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces"
};

const MEDALS = [
  { id: 1, title: "30 Días Invictos", description: "Cero infracciones detectadas por IA en un mes.", icon: ShieldCheck, color: "text-success", bg: "bg-success/10", border: "border-success/30" },
  { id: 2, title: "Experto EPP", description: "Evaluación de EPP perfecta por 3 periodos.", icon: Award, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  { id: 3, title: "Brigadista ORO", description: "Examen de emergencias aprobado con 100%.", icon: Award, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
];

export default function StudentProfilePage() {
  
  const handleUpdateProfile = async (data: Partial<UserProfileData>) => {
    console.log("Actualizando perfil del estudiante con:", data);
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    console.log("Actualizando contraseña desde:", currentPass, "hacia:", newPass);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mi Perfil</h1>
        <p className="text-muted">Gestiona tu información personal, contraseña y credenciales de seguridad.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Settings Panel */}
        <div className="xl:col-span-2">
          <ProfileSettings 
            initialData={INITIAL_STUDENT_DATA} 
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleUpdatePassword}
          />
        </div>

        {/* Enterprise Context Panel */}
        <div className="space-y-8">
          
          {/* Digital Passport QR */}
          <Card className="bg-surface/50 border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" /> Pasaporte Digital
              </CardTitle>
              <CardDescription>Escanea para validar certificaciones vigentes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner mb-4 animate-in zoom-in duration-500">
                {/* Fake QR Image generated with UI blocks */}
                <div className="grid grid-cols-5 gap-1 w-40 h-40">
                   {[...Array(25)].map((_, i) => (
                     <div key={i} className={`rounded-sm ${(i%2===0 || i%3===0 || i%7===0) ? 'bg-black' : 'bg-transparent'}`}></div>
                   ))}
                   {/* QR Eyes */}
                   <div className="absolute top-4 left-4 w-10 h-10 border-4 border-black box-border"></div>
                   <div className="absolute top-4 right-4 w-10 h-10 border-4 border-black box-border"></div>
                   <div className="absolute bottom-4 left-4 w-10 h-10 border-4 border-black box-border"></div>
                </div>
              </div>
              <p className="font-mono text-sm tracking-widest text-primary mb-4">{INITIAL_STUDENT_DATA.id}</p>
              <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/10 gap-2">
                <Download className="h-4 w-4" /> Descargar QR
              </Button>
            </CardContent>
          </Card>

          {/* Gamification / Badges */}
          <Card className="bg-surface/50 border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" /> Sistema de Medallas
              </CardTitle>
              <CardDescription>Reconocimientos por cumplimiento laboral.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MEDALS.map((medal) => (
                  <div key={medal.id} className={`flex gap-4 p-3 rounded-xl border ${medal.border} ${medal.bg} bg-opacity-30 items-center hover:scale-[1.02] transition-transform cursor-default`}>
                    <div className={`p-2 bg-background/50 rounded-full shrink-0 shadow-sm ${medal.color}`}>
                      <medal.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{medal.title}</p>
                      <p className="text-xs text-muted leading-tight mt-0.5">{medal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
