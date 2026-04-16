"use client";

import { ProfileSettings, UserProfileData } from "@/components/shared/profile-settings";

// --- MOCK DATA --- 
// En producción, esto vendría de un endpoint o contexto de sesión
const INITIAL_STUDENT_DATA: UserProfileData = {
  id: "USR-001",
  name: "Alex Rivera",
  email: "alex.rivera@empresa-cliente.com",
  phone: "+51 987 654 321",
  role: "Estudiante",
  department: "Planta de Producción Norte",
  avatarUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&h=150&fit=crop&crop=faces"
};

export default function StudentProfilePage() {
  
  const handleUpdateProfile = async (data: Partial<UserProfileData>) => {
    // Simular llamada al backend
    console.log("Actualizando perfil del estudiante con:", data);
    // await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) });
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    // Simular llamada al backend
    console.log("Actualizando contraseña desde:", currentPass, "hacia:", newPass);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-muted">Gestiona tu información personal y credenciales de acceso.</p>
      </div>

      <ProfileSettings 
        initialData={INITIAL_STUDENT_DATA} 
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleUpdatePassword}
      />

    </div>
  );
}
