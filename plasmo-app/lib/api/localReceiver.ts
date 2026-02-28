import type { MaterialItem } from "~lib/materials/types"

const BASE = "http://127.0.0.1:8765"

export async function healthcheck() {
  const r = await fetch(`${BASE}/health`)
  const j = await r.json()
  if (!j || typeof j.ok !== "boolean") {
    throw new Error("invalid health response")
  }
  return j as { ok: boolean }
}

export async function saveClip(record: MaterialItem) {
  const r = await fetch(`${BASE}/clip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  })
  return r.json()
}

export async function enqueueCommand(action: string, payload: Record<string, any> = {}) {
  const r = await fetch(`${BASE}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload })
  })
  return r.json()
}

export async function listMaterials(status = "all", limit = 20, q = "") {
  const u = new URL(`${BASE}/materials`)
  u.searchParams.set("status", status)
  u.searchParams.set("limit", String(limit))
  if (q) u.searchParams.set("q", q)
  const r = await fetch(u.toString())
  return r.json()
}
