"use client";

import { useEffect, useState } from "react";
import { ProfileSettings, UserProfileData } from "@/components/shared/profile-settings";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    if (!session?.dbId) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/proxy/users/${session.dbId}`);
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            id: data.id,
            name: `${data.name} ${data.lastName}`.trim(),
            email: data.email,
            phone: data.cellphone || "",
            role: data.role === "ROLE_INSTRUCTOR" ? "Instructor" : data.role,
            department: data.department || "",
            avatarUrl: data.urlPhoto || session?.user?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"
          });
        } else {
          console.error("Error cargando perfil, status:", res.status);
          // Fallback: usar datos de la sesión
          setProfileData({
            id: session.dbId?.toString() || "",
            name: session.user?.name || "",
            email: session.user?.email || "",
            phone: "",
            role: "Instructor",
            department: "",
            avatarUrl: session.user?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces"
          });
        }
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [session?.dbId]);

  const handleUpdateProfile = async (updatedFields: Partial<UserProfileData>) => {
    if (!session?.dbId) return;
    try {
      const nameParts = (updatedFields.name ?? profileData.name).trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || firstName;
      const payload = {
        name: firstName,
        lastName,
        cellphone: updatedFields.phone ?? profileData.phone ?? "",
        role: "ROLE_INSTRUCTOR",
        urlPhoto: profileData.avatarUrl ?? "",
      };

      const res = await fetch(`/api/proxy/users/admin/${session.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setProfileData(prev => ({
          ...prev,
          name: `${updated.name ?? ""} ${updated.lastName ?? ""}`.trim(),
          phone: updated.cellphone ?? prev.phone,
        }));
        toast.success("Perfil actualizado correctamente");
      } else {
        toast.error("Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      toast.error("Error de conexión");
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
        toast.success("Contraseña actualizada. Cerrando sesión por seguridad...");
        setTimeout(() => {
          const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
          const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
          const postLogoutRedirectUri = encodeURIComponent(window.location.origin + "/login");
          window.location.href = `${issuer}/protocol/openid-connect/logout?client_id=${clientId}&post_logout_redirect_uri=${postLogoutRedirectUri}`;
        }, 1500);
      } else {
        const error = await res.json();
        const message = res.status === 400
          ? "La contraseña no cumple los requisitos (mínimo 8 caracteres, una mayúscula y un símbolo)."
          : (error.message || "Error al actualizar la contraseña");
        toast.error(message);
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      toast.error("Error de conexión al cambiar contraseña");
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    if (!session?.dbId) return null;
    try {
      const presignRes = await fetch(
        `/api/storage/upload-url?fileName=${encodeURIComponent("users/profile-photos/" + Date.now() + "-" + file.name)}&contentType=${encodeURIComponent(file.type)}`
      );
      if (!presignRes.ok) {
        toast.error("Error al obtener URL de subida");
        return null;
      }
      const { uploadUrl, fileUrl } = await presignRes.json();

      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!s3Res.ok) {
        toast.error("Error al subir la imagen");
        return null;
      }

      const nameParts = profileData.name.trim().split(" ");
      const userPayload = {
        name: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        cellphone: profileData.phone,
        role: "ROLE_INSTRUCTOR",
        urlPhoto: fileUrl,
      };

      const updateRes = await fetch(`/api/proxy/users/admin/${session.dbId}`, {
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
        toast.success("Foto de perfil actualizada");
        return fileUrl;
      } else {
        toast.error("Error guardando la foto en el servidor");
        return null;
      }
    } catch (err) {
      console.error("Error subiendo avatar:", err);
      toast.error("Error crítico al subir la imagen");
      return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-muted">Gestiona tu información pública como Instructor y tus credenciales.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <ProfileSettings
          key={profileData.id}
          initialData={profileData}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleUpdatePassword}
          onAvatarChange={handleAvatarUpload}
        />
      )}
    </div>
  );
}
