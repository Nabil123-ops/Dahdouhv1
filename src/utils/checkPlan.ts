// TYPES FOR ALLOWED PLANS
export type Plan = "free" | "advanced" | "creator";

interface UserType {
  plan: Plan;
  expires: Date | null;
}

/**
 * Check if a user has access to a required plan level
 */
export function hasAccess(user: UserType | null, requiredPlan: Plan): boolean {
  if (!user) return false;

  // ⛔ Expired plan? Auto-deny
  if (user.expires && new Date(user.expires) < new Date()) {
    return false;
  }

  // PLAN LEVELS (ranked)
  const levels: Record<Plan, number> = {
    free: 1,
    advanced: 2,
    creator: 3,
  };

  return levels[user.plan] >= levels[requiredPlan];
}