import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
/**
 * Marks a controller/handler as requiring one of the given roles.
 * Used with RolesGuard. RBAC per PRODUCT_BIBLE.md §14 Security.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
