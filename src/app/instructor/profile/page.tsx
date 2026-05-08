"use client";

import { useEffect, useState } from "react";
import { ProfileSettings, UserProfileData } from "@/components/shared/profile-settings";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function InstructorProfilePage() {
  const { data: session } = useSession();
  
  // Inicializamos con lo que ya tenemos en la sesión para que no salga vacío
  const [profileData, setProfileData] = useState<UserProfileData>({
    id: session?.dbId?.toString() || "",
    name: session?.user?.name || "Cargando...",
    email: session?.user?.email || "",
    phone: "Cargando...",
    role: "Instructor",
    department: "Cargando...",
    avatarUrl: session?.user?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.dbId) return;
      try {
        const res = await fetch(`/api/proxy/users/${session.dbId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            id: data.id,
            name: `${data.name} ${data.lastName}`,
            email: data.email,
            phone: data.cellphone || "Sin teléfono",
            role: data.role === "ROLE_INSTRUCTOR" ? "Instructor" : data.role,
            department: data.department || "Área Técnica",
            avatarUrl: data.urlPhoto || session?.user?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"
          });
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.dbId, session?.user?.name, session?.user?.email, session?.user?.image]);

  const handleUpdateProfile = async (updatedFields: Partial<UserProfileData>) => {
    if (!session?.dbId) return;
    try {
      // Mapeamos de vuelta al formato que espera el Backend (UserRequest/UserUpdateRequest)
      const payload = {
        name: updatedFields.name?.split(" ")[0],
        lastName: updatedFields.name?.split(" ").slice(1).join(" "),
        cellphone: updatedFields.phone,
        // ... otros campos
      };

      const res = await fetch(`/api/proxy/users/admin/${session.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Perfil actualizado correctamente");
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
    }
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string) => {
    if (!(session as any)?.keycloakId) return;
    
    try {
      const res = await fetch("/api/proxy/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: (session as any).keycloakId,
          currentPassword: currentPass,
          newPassword: newPass
        })
      });

      if (res.ok) {
        alert("¡Éxito! Tu contraseña ha sido actualizada. Por seguridad, debes volver a iniciar sesión.");
        
        // Ejecutamos el cierre de sesión federado (Keycloak + NextAuth)
        const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
        const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
        const postLogoutRedirectUri = encodeURIComponent(window.location.origin + "/login");
        
        window.location.href = `${issuer}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${postLogoutRedirectUri}`;
      } else {
        const error = await res.json();
        // Si es un 400, casi siempre es porque no cumple la política de Keycloak
        const message = res.status === 400 
          ? "La contraseña es muy débil. Debe tener al menos 8 caracteres, una mayúscula y un símbolo."
          : (error.message || "Error al actualizar");
        alert(`Aviso de Seguridad: ${message}`);
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    if (!session?.dbId) return null;
    try {
      const presignRes = await fetch(
        `/api/storage/upload-url?fileName=${encodeURIComponent("users/profile-photos/" + Date.now() + "-" + file.name)}&contentType=${encodeURIComponent(file.type)}`
      );
      if (!presignRes.ok) {
        alert("Error obteniendo URL de subida");
        return null;
      }
      const { uploadUrl, fileUrl } = await presignRes.json();

      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!s3Res.ok) {
        alert("Error subiendo imagen a S3");
        return null;
      }

      const nameParts = profileData.name.trim().split(" ");
      const userPayload = {
        name: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: profileData.email,
        cellphone: profileData.phone,
        role: "ROLE_INSTRUCTOR",
        password: "oauth_user_secret",
        urlPhoto: fileUrl,
      };

      const updateRes = await fetch(`/api/proxy/users/${session.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (updateRes.ok) {
        setProfileData(prev => ({ ...prev, avatarUrl: fileUrl }));
        try { localStorage.setItem("custom_avatar", fileUrl); } catch (_) {}
        try {
          window.dispatchEvent(new CustomEvent("avatar-updated", { detail: { url: fileUrl } }));
        } catch (_) {}
        alert("Foto de perfil actualizada correctamente");
        return fileUrl;
      } else {
        alert("Error guardando la foto en el servidor");
        return null;
      }
    } catch (err) {
      console.error("Error subiendo avatar:", err);
      alert("Error critico al subir la imagen");
      return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-muted">Gestiona tu información pública como Instructor y tus credenciales.</p>
      </div>

      {profileData && (
        <ProfileSettings 
          initialData={profileData} 
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleUpdatePassword}
          onAvatarChange={handleAvatarUpload}
        />
      )}
    </div>
  );
}
