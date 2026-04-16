function requirePublicEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${name} is required`);
  }
  return trimmed;
}

/** Matches `images.remotePatterns` in next.config (picsum). */
const DEFAULT_SUITE_IMAGE_FALLBACK =
  "https://picsum.photos/seed/majestic-suite/1200/800";

export function getApiBaseUrl(): string {
  const raw = requirePublicEnv(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
  );
  return raw.replace(/\/$/, "");
}

/**
 * Optional at deploy: if unset, uses a safe default (allowed by Next image config).
 * Override when you have a branded placeholder CDN.
 */
export function getSuiteImageFallbackUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SUITE_IMAGE_FALLBACK_URL?.trim();
  return raw || DEFAULT_SUITE_IMAGE_FALLBACK;
}

function parseBooleanEnv(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function isDemoModeEnabled(): boolean {
  return parseBooleanEnv(process.env.NEXT_PUBLIC_DEMO_MODE);
}

export function getDemoAdminEmail(): string {
  return (
    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL?.trim().toLowerCase() ||
    "demo@sunshine.local"
  );
}

export function getDemoAdminPassword(): string {
  return process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD?.trim() || "demo1234";
}

export function getDemoAdminName(): string {
  return process.env.NEXT_PUBLIC_DEMO_ADMIN_NAME?.trim() || "Demo Admin";
}
