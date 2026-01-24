import { CsrfGuard } from "./csrf.guard";
import { verifyCsrfToken } from "./csrf-utils";
import { ForbiddenException } from "@nestjs/common";

jest.mock("./csrf.util");

describe("CsrfGuard", () => {
  let guard: CsrfGuard;

  beforeEach(() => {
    guard = new CsrfGuard();
  });

  function mockExecutionContext(req: any) {
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as any;
  }

  it("should allow request with valid matching tokens", () => {
    (verifyCsrfToken as jest.Mock).mockReturnValue(true);

    const req = {
      cookies: { csrf: "token.signature" },
      headers: { "x-csrf-token": "token.signature" },
    };

    const ctx = mockExecutionContext(req);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it("should reject if cookie token is missing", () => {
    const req = {
      cookies: {},
      headers: { "x-csrf-token": "token.signature" },
    };

    const ctx = mockExecutionContext(req);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should reject if header token is missing", () => {
    const req = {
      cookies: { csrf: "token.signature" },
      headers: {},
    };

    const ctx = mockExecutionContext(req);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should reject if tokens do not match", () => {
    const req = {
      cookies: { csrf: "token.signature" },
      headers: { "x-csrf-token": "other.token" },
    };

    const ctx = mockExecutionContext(req);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it("should reject if signature verification fails", () => {
    (verifyCsrfToken as jest.Mock).mockReturnValue(false);

    const req = {
      cookies: { csrf: "token.signature" },
      headers: { "x-csrf-token": "token.signature" },
    };

    const ctx = mockExecutionContext(req);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
