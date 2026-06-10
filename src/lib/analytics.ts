export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const posthog = require("posthog-js");
    posthog.capture(name, properties);
  } catch {}
}
