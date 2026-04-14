import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

export interface SessionPayload extends JWTPayload {
  role: string;
  expires: Date | string;
}

const secretKey = process.env.JWT_SECRET || "default_super_secret_for_local_env_shoptattoo";
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn("JWT Verification failed:", error.message);
    }
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
