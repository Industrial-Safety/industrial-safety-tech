const BASE = "/api/proxy/purchase/requests";

export const getRequests = async () => {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getRequestById = async (id) => {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const createRequest = async (data) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const updateRequest = async (id, data) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getRequestStats = async () => {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getInventory = async () => {
  const res = await fetch("/api/proxy/purchase/inventory");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getApprovedRequests = async () => {
  const res = await fetch("/api/proxy/purchase/requests/inventory");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getEppDeliveriesByDni = async (workerDni) => {
  const res = await fetch(`/api/proxy/purchase/epp/deliveries?workerDni=${encodeURIComponent(workerDni)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const searchWorkerByDni = async (dni) => {
  const res = await fetch(`/api/proxy/purchase/epp/worker?dni=${encodeURIComponent(dni)}`);
  if (res.status === 404) throw new Error("Trabajador no encontrado. Verifica el DNI.");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const deliverEpp = async ({ purchaseRequestId, workerDni, workerName, cantidad }) => {
  const res = await fetch("/api/proxy/purchase/epp/deliver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ purchaseRequestId, workerDni, workerName, cantidad }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json();
};
