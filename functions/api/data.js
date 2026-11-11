// Single API for the water bill app (Cloudflare Pages Function + KV binding "DATA").
//
//   GET  /api/data                      public: current data
//   GET  /api/data?check=1              editors: verify key -> { name }
//   PUT  /api/data                      editors: save whole document { data, note }
//   GET  /api/data?history=1            editors: last 50 versions
//   POST /api/data?restore=<versionId>  editors: restore a version
//
// Editors send their key in the "x-edit-key" header.
// EDIT_KEYS secret format: "Sajeevan:key1, Kumar:key2"  (keys >= 12 chars, no commas)

const DATA_KEY = "data";
const HIST_PREFIX = "h:";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

function editorFor(request, env) {
  const given = request.headers.get("x-edit-key") || "";
  let match = null;
  for (const part of String(env.EDIT_KEYS || "").split(",")) {
    const i = part.indexOf(":");
    const name = part.slice(0, i).trim(), key = part.slice(i + 1).trim();
    if (name && key.length >= 12 && safeEqual(key, given)) match = name;
  }
  return match;
}

function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function validate(data) {
  if (!data || !Array.isArray(data.houses) || !Array.isArray(data.months)) return "Invalid data";
  if (data.months.length > 600) return "Too many months";
  for (const m of data.months) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(m?.month || "")) return "Invalid month";
    const n = v => Number(String(v ?? "").replace(/,/g, ""));
    if (!(n(m.billUnits) > 0) || !(n(m.billAmount) > 0)) return `Invalid bill for ${m.month}`;
    for (const h of m.houses || data.houses) {
      const r = m.readings?.[h] || {};
      if (!/^\d{1,4}$/.test(String(r.prev ?? "")) || !/^\d{1,4}$/.test(String(r.curr ?? ""))) return `Invalid reading for ${h} in ${m.month}`;
    }
    if (m.maint != null) {
      if (typeof m.maint !== "object" || Array.isArray(m.maint)) return `Invalid maint for ${m.month}`;
      const fee = Number(m.maint.feePerHouse ?? 0);
      if (!Number.isFinite(fee) || fee < 0) return `Invalid feePerHouse for ${m.month}`;
      if (m.maint.openingBalance != null && !Number.isFinite(Number(m.maint.openingBalance))) return `Invalid openingBalance for ${m.month}`;
      if (!Array.isArray(m.maint.expenses ?? [])) return `Invalid expenses for ${m.month}`;
      for (const e of m.maint.expenses || []) {
        if (!e.id || !e.date || !e.desc || !e.group || !(Number(e.amount) >= 0)) return `Invalid expense entry in ${m.month}`;
      }
    }
    if (m.other != null) {
      if (!Array.isArray(m.other.transactions ?? [])) return `Invalid other for ${m.month}`;
      for (const t of m.other.transactions || []) {
        if (!t.id || !t.date || !t.desc || !["income", "expense"].includes(t.type) || !(Number(t.amount) >= 0))
          return `Invalid other transaction in ${m.month}`;
      }
    }
  }
  return null;
}

// Newest-first ordering for KV list (keys sort ascending).
const versionId = () => HIST_PREFIX + String(9_999_999_999_999 - Date.now()).padStart(13, "0") + "-" + crypto.randomUUID().slice(0, 6);

async function save(env, data, by, note) {
  const before = await env.DATA.get(DATA_KEY);
  const at = new Date().toISOString();
  const doc = { ...data, updatedAt: at, updatedBy: by };
  if (before) await env.DATA.put(versionId(), before, { metadata: { at, by, note: String(note || "").slice(0, 120) } });
  await env.DATA.put(DATA_KEY, JSON.stringify(doc));
  return doc;
}

export async function onRequest({ request, env }) {
  if (!env.DATA) return json({ error: "KV binding DATA is missing" }, 500);
  const url = new URL(request.url);

  if (request.method === "GET" && !url.searchParams.has("check") && !url.searchParams.has("history")) {
    const raw = await env.DATA.get(DATA_KEY);
    return json(raw ? JSON.parse(raw) : { houses: [], months: [] });
  }

  const editor = editorFor(request, env);
  if (!editor) return json({ error: "Invalid or expired edit key" }, 401);

  if (request.method === "GET" && url.searchParams.has("check")) return json({ name: editor });

  if (request.method === "GET" && url.searchParams.has("history")) {
    const { keys } = await env.DATA.list({ prefix: HIST_PREFIX, limit: 50 });
    return json({ versions: keys.map(k => ({ id: k.name, ...k.metadata })) });
  }

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > 512_000) return json({ error: "Too large" }, 413);
    let body; try { body = JSON.parse(text); } catch { return json({ error: "Invalid JSON" }, 400); }
    const err = validate(body.data);
    if (err) return json({ error: err }, 400);
    return json(await save(env, body.data, editor, body.note));
  }

  if (request.method === "POST" && url.searchParams.has("restore")) {
    const id = url.searchParams.get("restore");
    if (!id.startsWith(HIST_PREFIX)) return json({ error: "Invalid version" }, 400);
    const raw = await env.DATA.get(id);
    if (!raw) return json({ error: "Version not found" }, 404);
    const { updatedAt, updatedBy, ...data } = JSON.parse(raw);
    return json(await save(env, data, editor, `Restored an earlier version (last saved by ${updatedBy || "?"})`));
  }

  return json({ error: "Not found" }, 404);
}
