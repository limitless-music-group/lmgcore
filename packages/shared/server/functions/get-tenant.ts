import { useSearchParams } from "next/navigation";

// Every server component, API route, or loader can now read the tenant:
// Or, better — push it into a TenantContext at the root layout so you can use it everywhere.
export async function getTenant() {
    const searchParams = useSearchParams();
    return searchParams.get('tenant');
}