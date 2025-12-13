import posthog from "posthog-js";
import { keys } from "./keys";

export const initializeAnalyticsClient = () => {
  posthog.init(keys().NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: keys().NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-11-30",
  });
};
