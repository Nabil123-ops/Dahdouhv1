export function hasAccess(user: any, requiredPlan: "free" | "advanced" | "creator") {
  if (!user) return false;

  // expired?
  if (user.expires && new Date(user.expires) < new Date()) {
    return false;
  }

  const levels = { free: 1, advanced: 2, creator: 3 };

  return levels[user.plan] >= levels[requiredPlan];
}