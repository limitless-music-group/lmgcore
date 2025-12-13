import { keys as analytics } from "@packages/analytics/keys";
import { keys as database } from "@packages/database/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [database(), analytics()],
  server: {},
  client: {},
  runtimeEnv: {},
});
