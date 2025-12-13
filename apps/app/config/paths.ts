const withRedirect = (path: string, redirectTo?: string | null | undefined) =>
  redirectTo ? `${path}?redirectTo=${encodeURIComponent(redirectTo)}` : path;

export const paths = {
  // tenant-scoped application
  app: {
    dashboard: {
      getHref: (slug: string) => "/dashboard",
    },
    users: {
      getHref: (slug: string) => `/${slug}/users`,
    },
    profile: {
      getHref: (slug: string) => `/${slug}/profile`,
    },
    // tenant-scoped authentication
    login: {
      getHref: (slug: string, redirectTo?: string | null | undefined) =>
        withRedirect(`/${slug}/auth/login`, redirectTo),
    },
    register: {
      getHref: (slug: string, redirectTo?: string | null | undefined) =>
        withRedirect(`/${slug}/auth/register`, redirectTo),
    },
    signedOut: {
      getHref: (slug: string, redirectTo?: string | null | undefined) =>
        withRedirect(`/${slug}/auth/signed-out`, redirectTo),
    },
  },
} as const;
