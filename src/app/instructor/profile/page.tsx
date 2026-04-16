"use client";

import { ProfileSettings, UserProfileData } from "@/components/shared/profile-settings";

// --- MOCK DATA --- 
const INITIAL_INSTRUCTOR_DATA: UserProfileData = {
  id: "INS-901",
  name: "Ing. Roberto Martínez",
  email: "rmartinez@industrial-safety.com",
  phone: "+51 912 345 678",
  role: "Instructor",
  department: "Área de Formación HSE",
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"
};

export default function InstructorProfilePage() {
  
  const handleUpdateProfile = async (data: Partial<UserProfileData>) => {
    console.log("Actualizando perfil del instructor con:", data);
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    console.log("Actualizando contraseña del instructor");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-muted">Gestiona tu información pública como Instructor y tus credenciales.</p>
      </div>

      <ProfileSettings 
        initialData={INITIAL_INSTRUCTOR_DATA} 
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleUpdatePassword}
      />

    </div>
  );
}
