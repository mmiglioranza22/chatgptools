import * as crypto from "crypto";
import { generateCsrfToken, verifyCsrfToken } from "./csrf-utils";

describe("CSRF utils", () => {
  beforeAll(() => {
    process.env.CSRF_SECRET = "test-secret";
  });

  describe("generateCsrfToken", () => {
    it("should generate a token with a valid format", () => {
      const token = generateCsrfToken();

      const parts = token.split(".");
      expect(parts).toHaveLength(2);
      expect(parts[0]).toMatch(/^[a-f0-9]{64}$/);
      expect(parts[1]).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate unique tokens", () => {
      const t1 = generateCsrfToken();
      const t2 = generateCsrfToken();
      expect(t1).not.toEqual(t2);
    });
  });

  describe("verifyCsrfToken", () => {
    it("should validate a correctly signed token", () => {
      const token = generateCsrfToken();
      expect(verifyCsrfToken(token)).toBe(true);
    });

    it("should reject a token with a modified payload", () => {
      const token = generateCsrfToken();
      const [payload, sig] = token.split(".");
      const tampered = `deadbeef${payload.slice(8)}.${sig}`;

      expect(verifyCsrfToken(tampered)).toBe(false);
    });

    it("should reject a token with a modified signature", () => {
      const token = generateCsrfToken();
      const [payload] = token.split(".");
      const badSig = crypto.randomBytes(32).toString("hex");

      expect(verifyCsrfToken(`${payload}.${badSig}`)).toBe(false);
    });

    it("should reject malformed tokens", () => {
      expect(verifyCsrfToken("")).toBe(false);
      expect(verifyCsrfToken("abc")).toBe(false);
      expect(verifyCsrfToken("a.b.c")).toBe(false);
    });
  });
});
