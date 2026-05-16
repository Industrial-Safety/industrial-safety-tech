const JAVA_URL = "http://localhost:8085/api/v1/incidents";

export interface Incident {
    id: string;
    cameraKey: string;
    violationTypes: string[];
    evidenceUrl: string;
    confidence: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    detectedAt: string;
    createdAt: string;
    reviewedBy: string | null;
    reviewedAt: string | null;
    reviewNotes: string | null;
}

export async function getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${JAVA_URL}?size=50&sort=detectedAt,desc`);
    const data = await res.json();
    return data.content;
}

export async function reviewIncident(
    id: string,
    status: "APPROVED" | "REJECTED",
    reviewNotes: string
): Promise<Incident> {
    const res = await fetch(`${JAVA_URL}/${id}/review`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": "jefe-seguridad-01", // temporal hasta Keycloak
        },
        body: JSON.stringify({ status, reviewNotes }),
    });
    return res.json();
}