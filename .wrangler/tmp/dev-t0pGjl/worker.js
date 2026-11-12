var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// functions/api/data.js
var DATA_KEY = "data";
var HIST_PREFIX = "h:";
var json = /* @__PURE__ */ __name((body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } }), "json");
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
__name(editorFor, "editorFor");
function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}
__name(safeEqual, "safeEqual");
function validate(data) {
  if (!data || !Array.isArray(data.houses) || !Array.isArray(data.months)) return "Invalid data";
  if (data.months.length > 600) return "Too many months";
  for (const m of data.months) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(m?.month || "")) return "Invalid month";
    const n = /* @__PURE__ */ __name((v) => Number(String(v ?? "").replace(/,/g, "")), "n");
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
__name(validate, "validate");
var versionId = /* @__PURE__ */ __name(() => HIST_PREFIX + String(9999999999999 - Date.now()).padStart(13, "0") + "-" + crypto.randomUUID().slice(0, 6), "versionId");
async function save(env, data, by, note) {
  const before = await env.DATA.get(DATA_KEY);
  const at = (/* @__PURE__ */ new Date()).toISOString();
  const doc = { ...data, updatedAt: at, updatedBy: by };
  if (before) await env.DATA.put(versionId(), before, { metadata: { at, by, note: String(note || "").slice(0, 120) } });
  await env.DATA.put(DATA_KEY, JSON.stringify(doc));
  return doc;
}
__name(save, "save");
async function onRequest({ request, env }) {
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
    return json({ versions: keys.map((k) => ({ id: k.name, ...k.metadata })) });
  }
  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > 512e3) return json({ error: "Too large" }, 413);
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
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
__name(onRequest, "onRequest");

// worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return onRequest({ request, env, ctx });
    }
    return env.ASSETS.fetch(request);
  }
};

// C:/Users/LENOVO/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/LENOVO/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-hzs5GM/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// C:/Users/LENOVO/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-hzs5GM/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
