const DEMO_SESSION_KEY = "sunshine_demo_admin_session";

export type DemoAdminSession = {
  email: string;
  name: string;
  role: string;
  signedInAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function readDemoAdminSession(): DemoAdminSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoAdminSession>;
    if (
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.signedInAt !== "string"
    ) {
      return null;
    }
    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      signedInAt: parsed.signedInAt,
    };
  } catch {
    return null;
  }
}

export function writeDemoAdminSession(
  session: Omit<DemoAdminSession, "signedInAt">,
): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(
      DEMO_SESSION_KEY,
      JSON.stringify({
        ...session,
        signedInAt: new Date().toISOString(),
      } satisfies DemoAdminSession),
    );
  } catch {
    // ignore storage errors in demo mode
  }
}

export function clearDemoAdminSession(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    // ignore storage errors in demo mode
  }
}
