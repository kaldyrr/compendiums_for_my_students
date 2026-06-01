import { randomUUID } from "node:crypto";

export const Roles = Object.freeze({
  USER: "user",
  STUDENT: "student",
  TEACHER: "teacher",
  MODERATOR: "moderator",
  ADMIN: "admin"
});

export const Plans = Object.freeze({
  FREE: "FREE",
  PRO: "PRO",
  MAX: "MAX",
  INTERNAL_STUDENT_MAX: "INTERNAL_STUDENT_MAX"
});

export const GrantSources = Object.freeze({
  FREE: "free",
  PAID: "paid",
  MANUAL: "manual",
  INVITE: "invite",
  COHORT: "cohort"
});

export function createFreeGrant() {
  return {
    id: randomUUID(),
    plan: Plans.FREE,
    source: GrantSources.FREE,
    grantedBy: "system",
    grantedAt: new Date().toISOString(),
    expiresAt: null,
    reason: "Default free plan"
  };
}

export function createUser({ phoneNumber, displayName }) {
  return {
    id: randomUUID(),
    phoneNumber,
    displayName: displayName || null,
    roles: [Roles.USER],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    grants: [createFreeGrant()]
  };
}

export function grantPlan({ user, plan, source, grantedBy, expiresAt = null, reason = "" }) {
  const nextGrant = {
    id: randomUUID(),
    plan,
    source,
    grantedBy,
    grantedAt: new Date().toISOString(),
    expiresAt,
    reason
  };

  const roles = new Set(user.roles);
  if (plan === Plans.INTERNAL_STUDENT_MAX) {
    roles.add(Roles.STUDENT);
  }

  return {
    ...user,
    roles: [...roles],
    updatedAt: new Date().toISOString(),
    grants: [...user.grants, nextGrant]
  };
}

export function getActivePlan(user) {
  const now = Date.now();
  const activeGrants = user.grants.filter(grant => {
    return !grant.expiresAt || Date.parse(grant.expiresAt) > now;
  });

  const weight = {
    [Plans.FREE]: 0,
    [Plans.PRO]: 10,
    [Plans.MAX]: 20,
    [Plans.INTERNAL_STUDENT_MAX]: 30
  };

  return activeGrants.sort((a, b) => weight[b.plan] - weight[a.plan])[0] || createFreeGrant();
}

export function createInvite({ plan, cohort, maxUses, createdBy, expiresAt = null, note = "" }) {
  return {
    id: randomUUID(),
    code: makeInviteCode(cohort),
    plan,
    cohort,
    maxUses,
    usedBy: [],
    createdBy,
    createdAt: new Date().toISOString(),
    expiresAt,
    note,
    status: "active"
  };
}

export function canUseInvite(invite) {
  if (!invite || invite.status !== "active") return false;
  if (invite.expiresAt && Date.parse(invite.expiresAt) <= Date.now()) return false;
  return invite.usedBy.length < invite.maxUses;
}

function makeInviteCode(cohort) {
  const prefix = String(cohort || "STUDENT")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18) || "STUDENT";
  return `${prefix}-${randomUUID().slice(0, 8).toUpperCase()}`;
}
