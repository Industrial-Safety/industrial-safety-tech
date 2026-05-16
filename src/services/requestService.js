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

export const receiveInWarehouse = async ({ codigo, descripcion, stock, estado = "DISPONIBLE" }) => {
  const res = await fetch("/api/proxy/purchase/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo, descripcion, stock, estado }),
  });
  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try {
      const json = JSON.parse(text);
      detail = json.detail ?? json.message ?? json.error ?? text;
    } catch {}
    throw new Error(`[${res.status}] ${detail}`);
  }
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

export const deliverEpp = async ({ inventoryItemId, workerDni, workerName, cantidad }) => {
  const payload = { inventoryItemId, workerDni, workerName, cantidad };
  console.log("[deliverEpp] payload →", JSON.stringify(payload));
  const res = await fetch("/api/proxy/purchase/epp/deliver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log(`[deliverEpp] status=${res.status} body=`, text);
  if (!res.ok) {
    let detail = text;
    try {
      const json = JSON.parse(text);
      detail = json.detail ?? json.message ?? json.error ?? text;
    } catch {}
    throw new Error(`[${res.status}] ${detail}`);
  }
  return JSON.parse(text);
};
