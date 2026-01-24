// csrf.util.ts
import * as crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET!;

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const signature = sign(token);
  return `${token}.${signature}`;
}

export function verifyCsrfToken(value: string): boolean {
  const [token, signature] = value.split(".");
  if (!token || !signature) return false;

  const expected = sign(token);
  return timingSafeEqual(signature, expected);
}

function sign(token: string): string {
  return crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}
