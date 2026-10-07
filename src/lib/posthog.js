import posthog from "posthog-js";

const POSTHOG_KEY =
  import.meta.env.VITE_POSTHOG_KEY ||
  "phc_z4wzK7SUk9hpF4u5BJcsmmo6uGVQsm2KHgpwmXXrpKXk";
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

const REPLAY_PATHS = ["/claimupload", "/chatbotpage"];

let initialized = false;

export function initPosthog() {
  if (initialized || typeof window === "undefined" || !POSTHOG_KEY) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
    },
  });
  initialized = true;
}

export function trackPageview(pathname) {
  if (!initialized) return;
  posthog.capture("$pageview", {
    $current_url: window.location.href,
  });
  if (REPLAY_PATHS.includes(pathname)) {
    posthog.startSessionRecording();
  } else {
    posthog.stopSessionRecording();
  }
}

export function trackEvent(name, properties) {
  if (!initialized) return;
  posthog.capture(name, properties);
}
