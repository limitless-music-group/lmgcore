// Prisma Tenant Scoping (highly recommended)
// Inside a shared package like packages/database:
// Every query becomes auto-scoped.
// No accidental cross-tenant leaks.

import { database } from "index";

export function getTenantPrisma(tenant: string){
    return database.$extends({
        query: {
            user: {
                async findMany({ args, query }) {
                    args.where = { ...args.where, tenantId: tenant };
                    return query(args);
                }
            }
        }
    });
}