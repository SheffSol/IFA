const crypto = require("node:crypto");

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

const topicLabels = {
  ru: {
    route_project: "Маршрутный проект",
    industry_partnership: "Отраслевое партнёрство",
    international_cooperation: "Международное сотрудничество",
    other: "Другое",
  },
  en: {
    route_project: "Route project",
    industry_partnership: "Industry partnership",
    international_cooperation: "International cooperation",
    other: "Other",
  },
};

const rateStore = globalThis.__ifaApplicationRateStore || new Map();
globalThis.__ifaApplicationRateStore = rateStore;

function json(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function clean(value, maxLength) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function safeSheetValue(value) {
  const text = clean(value, 5000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return request.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateStore.get(ip) || []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  recent.push(now);
  rateStore.set(ip, recent);

  if (rateStore.size > 1000) {
    for (const [key, timestamps] of rateStore.entries()) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_WINDOW_MS)) rateStore.delete(key);
    }
  }
  return recent.length > RATE_LIMIT;
}

function parseBody(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) return request.body;
  if (Buffer.isBuffer(request.body)) return JSON.parse(request.body.toString("utf8"));
  if (typeof request.body === "string") return JSON.parse(request.body);
  return {};
}

function validate(body) {
  const language = body.language === "en" ? "en" : "ru";
  const topicKey = clean(body.topicKey, 40);
  const application = {
    name: clean(body.name, 120),
    organization: clean(body.organization, 180),
    email: clean(body.email, 180).toLowerCase(),
    phone: clean(body.phone, 40),
    topic: topicLabels[language][topicKey] || clean(body.topic, 120),
    message: clean(body.message, 3000),
    language,
    page: clean(body.page, 200),
    source: clean(body.source, 500),
    utmSource: clean(body.utmSource, 120),
    utmMedium: clean(body.utmMedium, 120),
    utmCampaign: clean(body.utmCampaign, 160),
    submissionId: clean(body.submissionId, 100),
  };

  if (clean(body.website, 200)) return { error: "Spam check failed" };
  if (body.consent !== true) return { error: "Consent is required" };
  if (application.name.length < 2) return { error: "Name is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) return { error: "Valid email is required" };
  const phoneDigits = application.phone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) return { error: "Valid phone number is required" };
  if (!application.topic) return { error: "Cooperation area is required" };
  if (application.message.length < 10) return { error: "Application details are required" };
  return { application };
}

function createApplicationId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `IFA-${date}-${suffix}`;
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) throw new Error("Google service account is not configured");

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(JSON.stringify({
    iss: email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${claims}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsignedToken), privateKey).toString("base64url");
  const assertion = `${unsignedToken}.${signature}`;

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.access_token) throw new Error(`Google token request failed: ${response.status}`);
  return result.access_token;
}

async function appendApplication(application, applicationId) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Заявки";
  if (!spreadsheetId) throw new Error("Google spreadsheet is not configured");

  const accessToken = await getAccessToken();
  const escapedSheetName = sheetName.replace(/'/g, "''");
  const range = `'${escapedSheetName}'!A:P`;
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const row = [
    applicationId,
    new Date().toISOString(),
    application.name,
    application.organization,
    application.email,
    application.phone,
    application.topic,
    application.message,
    application.language.toUpperCase(),
    application.page,
    application.source,
    application.utmSource,
    application.utmMedium,
    application.utmCampaign,
    "Новая",
    application.submissionId,
  ].map(safeSheetValue);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ majorDimension: "ROWS", values: [row] }),
  });
  if (!response.ok) {
    const details = await response.text();
    console.error("Google Sheets append failed", response.status, details.slice(0, 800));
    throw new Error(`Google Sheets append failed: ${response.status}`);
  }
}

module.exports = async function partnershipHandler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { ok: false, error: "Method not allowed" });
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > 24_000) return json(response, 413, { ok: false, error: "Request is too large" });

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return json(response, 403, { ok: false, error: "Origin is not allowed" });
    } catch {
      return json(response, 403, { ok: false, error: "Origin is not allowed" });
    }
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) return json(response, 429, { ok: false, error: "Too many requests" });

  let body;
  try {
    body = parseBody(request);
  } catch {
    return json(response, 400, { ok: false, error: "Invalid JSON" });
  }

  const validation = validate(body);
  if (validation.error) return json(response, 400, { ok: false, error: validation.error });

  const applicationId = createApplicationId();
  try {
    await appendApplication(validation.application, applicationId);
    return json(response, 201, { ok: true, id: applicationId });
  } catch (error) {
    console.error("IFA application could not be stored", error.message);
    return json(response, 503, { ok: false, error: "Application service is temporarily unavailable" });
  }
};
