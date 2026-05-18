export type AppealStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Incident {
    id: string;
    cameraKey: string;
    violationTypes: string[];
    evidenceUrl: string;
    confidence: number;
    status: "PENDING" | "APPROVED" | "REJECTED" | "APPEALED";
    detectedAt: string;
    createdAt: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
    reviewNotes: string | null;
    workerId: string | null;
    pointsDeducted: number | null;
    appealStatus: AppealStatus | null;
    appealReason: string | null;
    appealedAt: string | null;
    appealResolvedAt: string | null;
    appealResolutionNotes: string | null;
}

export interface WorkerOption {
    id: string;
    keycloakId: string;
    name: string;
    lastName: string;
    email: string;
    dni: string;
    role: string;
    urlPhoto: string;
}

export async function getIncidents(): Promise<Incident[]> {
    const res = await fetch("/api/proxy/incidents?size=50&sort=detectedAt,desc");
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
}

// Normaliza "ROLE_TRABAJADOR" / "trabajador" / "TRABAJADOR" -> "TRABAJADOR"
function normalizeRole(role?: string | null): string {
    if (!role) return "";
    const r = role.trim().toUpperCase();
    return r.startsWith("ROLE_") ? r.slice(5) : r;
}

// Lista SOLO trabajadores (rol TRABAJADOR) para el combo box del modal de revisión.
// Filtro defensivo en cliente por si el backend devuelve otros roles.
export async function getWorkers(): Promise<WorkerOption[]> {
    const res = await fetch("/api/proxy/users?role=TRABAJADOR");
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((u: WorkerOption) => normalizeRole(u.role) === "TRABAJADOR");
}

export async function reviewIncident(
    id: string,
    status: "APPROVED" | "REJECTED",
    reviewNotes: string,
    reviewerId: string,
    workerId?: string
): Promise<Incident> {
    const res = await fetch(`/api/proxy/incidents/${id}/review`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": reviewerId,
        },
        body: JSON.stringify({ status, reviewNotes, workerId }),
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
    return text ? JSON.parse(text) : ({} as Incident);
}

export interface MyScore {
    workerId: string;
    score: number;
    updatedAt: string | null;
}

// El trabajador consulta sus propias infracciones (header X-User-Id = keycloakId)
export async function getMyIncidents(workerId: string): Promise<Incident[]> {
    const res = await fetch("/api/proxy/incidents/mine?size=100&sort=detectedAt,desc", {
        headers: { "X-User-Id": workerId },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
}

// El trabajador consulta su puntaje de cumplimiento actual
export async function getMyScore(workerId: string): Promise<MyScore | null> {
    const res = await fetch("/api/proxy/safety-score/me", {
        headers: { "X-User-Id": workerId },
    });
    if (!res.ok) return null;
    return res.json();
}

async function parseOrThrow(res: Response): Promise<Incident> {
    const text = await res.text();
    if (!res.ok) {
        let detail = text;
        try {
            const json = JSON.parse(text);
            detail = json.detail ?? json.message ?? json.error ?? text;
        } catch {}
        throw new Error(`[${res.status}] ${detail}`);
    }
    return text ? JSON.parse(text) : ({} as Incident);
}

// El trabajador apela una infracción confirmada propia
export async function submitAppeal(
    incidentId: string,
    workerId: string,
    reason: string
): Promise<Incident> {
    const res = await fetch(`/api/proxy/incidents/${incidentId}/appeal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": workerId },
        body: JSON.stringify({ reason }),
    });
    return parseOrThrow(res);
}

// El jefe lista las apelaciones de los incidentes que él aprobó
export async function getAppeals(
    reviewerId: string,
    onlyPending = false
): Promise<Incident[]> {
    const res = await fetch(
        `/api/proxy/incidents/appeals?onlyPending=${onlyPending}&size=100&sort=appealedAt,desc`,
        { headers: { "X-User-Id": reviewerId } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
}

// El jefe que aprobó la infracción resuelve la apelación
export async function resolveAppeal(
    incidentId: string,
    reviewerId: string,
    approved: boolean,
    resolutionNotes: string
): Promise<Incident> {
    const res = await fetch(`/api/proxy/incidents/${incidentId}/appeal/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-User-Id": reviewerId },
        body: JSON.stringify({ approved, resolutionNotes }),
    });
    return parseOrThrow(res);
}
