// Server Component: carga datos reales del backend
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileSettingsClient from "./profile-client";

async function getUserData(userId: string | number, accessToken: string) {
  try {
    const url = `${process.env.API_URL}/api/v1/users/${userId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function StudentProfilePage() {
  const session = await auth();

  if (!session?.accessToken) redirect("/login");

  const realId = (session as any).dbId || session.user?.id;
  if (!realId) redirect("/login");

  const userData = await getUserData(realId, session.accessToken);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-muted">Gestiona tu información personal y credenciales de acceso.</p>
      </div>

      <ProfileSettingsClient
        initialData={{
          id: userData?.id || realId,
          name: `${userData?.name ?? ""} ${userData?.lastName ?? ""}`.trim() || session.user?.name || "Usuario",
          email: userData?.email ?? session.user?.email ?? "",
          phone: userData?.cellphone ?? "",
          role: "Estudiante",
          avatarUrl: userData?.urlPhoto || session.user?.image || undefined,
          keycloakId: (session.user as any)?.id || "",
        }}
        accessToken={session.accessToken}
      />
    </div>
  );
}
