import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  GrantSources,
  Plans,
  canUseInvite,
  createInvite,
  createUser,
  getActivePlan,
  grantPlan
} from "./domain.mjs";
import { JsonStore } from "./storage.mjs";
import { TelegramGatewayClient } from "./integrations/telegram-gateway.mjs";
import { PlategaClient } from "./integrations/platega.mjs";

const port = Number(process.env.PORT || 3000);
const publicBaseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const adminToken = process.env.ADMIN_BOOTSTRAP_TOKEN || "dev-admin";
const prototypeDir = resolve("prototypes/js-builder");
const store = new JsonStore(process.env.DATA_FILE);

const telegram = new TelegramGatewayClient({
  token: process.env.TELEGRAM_GATEWAY_TOKEN,
  callbackUrl: process.env.TELEGRAM_GATEWAY_CALLBACK_URL
});

const platega = new PlategaClient({
  baseUrl: process.env.PLATEGA_BASE_URL,
  merchantId: process.env.PLATEGA_MERCHANT_ID,
  secret: process.env.PLATEGA_SECRET,
  returnUrl: process.env.PLATEGA_RETURN_URL || `${publicBaseUrl}/billing/success`,
  failedUrl: process.env.PLATEGA_FAILED_URL || `${publicBaseUrl}/billing/fail`
});

const server = createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    await servePrototype(req, res);
  } catch (error) {
    sendJson(res, error.status || 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`course platform dev server: ${publicBaseUrl}`);
});

async function handleApi(req, res) {
  const url = new URL(req.url, publicBaseUrl);

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      telegramGatewayConfigured: Boolean(process.env.TELEGRAM_GATEWAY_TOKEN),
      plategaConfigured: platega.isConfigured()
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/telegram/request") {
    const body = await readJson(req);
    const phoneNumber = normalizePhone(body.phoneNumber);
    const payload = randomUUID();
    const status = await telegram.sendVerificationMessage({ phoneNumber, payload });

    await store.update(data => {
      data.authRequests.push({
        id: randomUUID(),
        requestId: status.request_id,
        phoneNumber,
        payload,
        status: "sent",
        createdAt: new Date().toISOString(),
        raw: status
      });
    });

    sendJson(res, 200, { requestId: status.request_id, devCode: process.env.TELEGRAM_GATEWAY_TOKEN ? undefined : "000000" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/telegram/verify") {
    const body = await readJson(req);
    const status = await telegram.checkVerificationStatus({ requestId: body.requestId, code: body.code });
    const verificationStatus = status.verification_status?.status;

    if (verificationStatus !== "code_valid") {
      sendJson(res, 401, { error: "Invalid verification code", verificationStatus });
      return;
    }

    const result = await store.update(data => {
      const authRequest = data.authRequests.find(item => item.requestId === body.requestId);
      if (!authRequest) throw new Error("Unknown auth request");

      let user = data.users.find(item => item.phoneNumber === authRequest.phoneNumber);
      if (!user) {
        user = createUser({ phoneNumber: authRequest.phoneNumber, displayName: body.displayName });
        data.users.push(user);
      }

      const session = {
        id: randomUUID(),
        token: randomUUID(),
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      data.sessions.push(session);
      authRequest.status = "verified";
      authRequest.verifiedAt = new Date().toISOString();
      return { user, session };
    });

    sendJson(res, 200, {
      token: result.session.token,
      user: publicUser(result.user)
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/invites/redeem") {
    const body = await readJson(req);
    const result = await store.update(data => {
      const user = data.users.find(item => item.id === body.userId);
      const invite = data.invites.find(item => item.code === body.code);
      if (!user) throw new Error("User not found");
      if (!canUseInvite(invite)) throw new Error("Invite cannot be used");

      const updated = grantPlan({
        user,
        plan: invite.plan,
        source: GrantSources.INVITE,
        grantedBy: invite.createdBy,
        reason: `Invite ${invite.code} / ${invite.cohort}`
      });
      replaceById(data.users, updated);
      invite.usedBy.push({ userId: user.id, usedAt: new Date().toISOString() });
      audit(data, "invite.redeem", "system", { userId: user.id, inviteCode: invite.code });
      return updated;
    });
    sendJson(res, 200, { user: publicUser(result) });
    return;
  }

  if (url.pathname.startsWith("/api/admin/")) {
    requireAdmin(req);
  }

  if (req.method === "GET" && url.pathname === "/api/admin/users") {
    const data = await store.read();
    sendJson(res, 200, { users: data.users.map(publicUser) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/invites") {
    const body = await readJson(req);
    const invite = createInvite({
      plan: body.plan || Plans.INTERNAL_STUDENT_MAX,
      cohort: body.cohort,
      maxUses: Number(body.maxUses || 30),
      expiresAt: body.expiresAt || null,
      note: body.note || "",
      createdBy: "admin"
    });
    await store.update(data => {
      data.invites.push(invite);
      audit(data, "invite.create", "admin", { inviteCode: invite.code, cohort: invite.cohort });
    });
    sendJson(res, 201, { invite });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/users/grant") {
    const body = await readJson(req);
    const updated = await store.update(data => {
      const user = data.users.find(item => item.id === body.userId);
      if (!user) throw new Error("User not found");
      const next = grantPlan({
        user,
        plan: body.plan || Plans.INTERNAL_STUDENT_MAX,
        source: GrantSources.MANUAL,
        grantedBy: "admin",
        expiresAt: body.expiresAt || null,
        reason: body.reason || "Manual admin grant"
      });
      replaceById(data.users, next);
      audit(data, "user.grant", "admin", { userId: user.id, plan: body.plan });
      return next;
    });
    sendJson(res, 200, { user: publicUser(updated) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/users/block") {
    const body = await readJson(req);
    const updated = await store.update(data => {
      const user = data.users.find(item => item.id === body.userId);
      if (!user) throw new Error("User not found");
      user.status = "blocked";
      user.updatedAt = new Date().toISOString();
      audit(data, "user.block", "admin", { userId: user.id, reason: body.reason || "" });
      return user;
    });
    sendJson(res, 200, { user: publicUser(updated) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/billing/platega/create") {
    const body = await readJson(req);
    const plan = body.plan === Plans.MAX ? Plans.MAX : Plans.PRO;
    const amount = plan === Plans.MAX ? 9900 : 2900;
    const payload = JSON.stringify({ userId: body.userId, plan });
    const payment = await platega.createPaymentLink({
      amount,
      currency: "RUB",
      description: `Interactive Course ${plan}`,
      payload
    });

    await store.update(data => {
      data.payments.push({
        id: randomUUID(),
        provider: "platega",
        userId: body.userId,
        plan,
        amount,
        currency: "RUB",
        status: payment.status,
        transactionId: payment.transactionId,
        paymentUrl: payment.url,
        payload,
        createdAt: new Date().toISOString(),
        raw: payment
      });
    });

    sendJson(res, 200, { paymentUrl: payment.url, transactionId: payment.transactionId });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/billing/platega/webhook") {
    if (!platega.validateWebhookHeaders(req.headers)) {
      sendJson(res, 401, { error: "Invalid Platega callback headers" });
      return;
    }

    const body = await readJson(req);
    await store.update(data => {
      const payment = data.payments.find(item => item.transactionId === body.id);
      if (payment) {
        payment.status = body.status;
        payment.updatedAt = new Date().toISOString();
        payment.webhook = body;
        if (body.status === "CONFIRMED") {
          const user = data.users.find(item => item.id === payment.userId);
          if (user) {
            replaceById(data.users, grantPlan({
              user,
              plan: payment.plan,
              source: GrantSources.PAID,
              grantedBy: "platega",
              reason: `Payment ${payment.transactionId}`
            }));
          }
        }
      }
      audit(data, "payment.webhook", "platega", { transactionId: body.id, status: body.status });
    });
    sendJson(res, 200, {});
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

async function servePrototype(req, res) {
  const url = new URL(req.url, publicBaseUrl);
  const relativePath = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const filePath = resolve(join(prototypeDir, relativePath));
  if (!filePath.startsWith(prototypeDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  const content = await readFile(filePath);
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  res.end(content);
}

function requireAdmin(req) {
  if (req.headers["x-admin-token"] !== adminToken) {
    throw new HttpError(401, "Admin token required");
  }
}

function normalizePhone(phoneNumber) {
  const value = String(phoneNumber || "").trim();
  if (!/^\+[1-9]\d{7,14}$/.test(value)) {
    throw new HttpError(400, "Phone number must be in E.164 format");
  }
  return value;
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function publicUser(user) {
  return {
    id: user.id,
    phoneNumber: maskPhone(user.phoneNumber),
    displayName: user.displayName,
    roles: user.roles,
    status: user.status,
    activePlan: getActivePlan(user),
    createdAt: user.createdAt
  };
}

function maskPhone(phoneNumber) {
  return phoneNumber.replace(/^(\+\d{2})\d+(\d{2})$/, "$1******$2");
}

function replaceById(items, next) {
  const index = items.findIndex(item => item.id === next.id);
  if (index >= 0) items[index] = next;
}

function audit(data, action, actor, details) {
  data.auditLog.push({
    id: randomUUID(),
    action,
    actor,
    details,
    createdAt: new Date().toISOString()
  });
}

function contentType(filePath) {
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
  };
  return types[extname(filePath)] || "application/octet-stream";
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
