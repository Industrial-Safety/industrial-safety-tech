// Servicio para la asignación masiva de cursos a trabajadores (panel admin).

export interface AdminCourse {
  id: string;
  title: string;
  subtitle: string;
  coverImageUrl: string | null;
  level: string | null;
  precio: number | null;
}

export interface WorkerLite {
  keycloakId: string;
  name: string;
  lastName: string;
  email: string;
}

export interface AssignResult {
  workersTargeted: number;
  ordersCreated: number;
  workersSkipped: number;
}

function normalizeRole(role?: string | null): string {
  if (!role) return "";
  const r = role.trim().toUpperCase();
  return r.startsWith("ROLE_") ? r.slice(5) : r;
}

export async function getAllCourses(): Promise<AdminCourse[]> {
  const res = await fetch("/api/proxy/course");
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((c: any) => ({
    id: c.id ?? c._id,
    title: c.title ?? "Sin título",
    subtitle: c.subtitle ?? "",
    coverImageUrl: c.coverImageUrl ?? null,
    level: c.details?.level ?? null,
    precio: c.details?.precio ?? null,
  }));
}

// Trabajadores (rol TRABAJADOR) con keycloakId poblado.
export async function getWorkerTargets(): Promise<WorkerLite[]> {
  const res = await fetch("/api/proxy/users?role=TRABAJADOR");
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((u: any) => normalizeRole(u.role) === "TRABAJADOR" && u.keycloakId)
    .map((u: any) => ({
      keycloakId: u.keycloakId,
      name: u.name ?? "",
      lastName: u.lastName ?? "",
      email: u.email ?? "",
    }));
}

export async function assignCourses(
  courses: { idCurso: string; courseName: string }[],
  workers: { userId: string; userEmail: string }[]
): Promise<AssignResult> {
  const res = await fetch("/api/proxy/orders/admin/assign-courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courses, workers }),
  });
  const text = await res.text();
  if (!res.ok) {
    let detail = text;
    try {
      const json = JSON.parse(text);
      detail = json.detail ?? json.message ?? json.error ?? text;
    } catch {}
    throw new Error(`[${res.status}] ${detail}`);
  }
  return JSON.parse(text);
}
