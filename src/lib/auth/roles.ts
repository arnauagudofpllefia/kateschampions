import type { UserRole } from "@/lib/db/types";

const roleWeight: Record<UserRole, number> = {
  user: 1,
  editor: 2,
  admin: 3,
};

export function hasRequiredRole(currentRole: UserRole, requiredRole: UserRole): boolean {
  return roleWeight[currentRole] >= roleWeight[requiredRole];
}
