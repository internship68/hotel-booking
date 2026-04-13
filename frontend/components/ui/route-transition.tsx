"use client";

/**
 * Keep route wrapper stable to avoid remount/flicker between pages.
 * Transition effects are handled inside specific pages/components.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
