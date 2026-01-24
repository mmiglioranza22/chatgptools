import { CsrfGuard } from "./csrf.guard";
import { ForbiddenException } from "@nestjs/common";
import { csrf } from "./csrf.config";

jest.mock("./csrf.config", () => ({
  csrf: {
    validateRequest: jest.fn(),
  },
}));

describe("CsrfGuard", () => {
  let guard: CsrfGuard;

  beforeEach(() => {
    guard = new CsrfGuard();
    jest.clearAllMocks();
  });

  function mockContext(req = {}, res = {}) {
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any;
  }

  it("should allow request when validateRequest succeeds", () => {
    (csrf.validateRequest as jest.Mock).mockImplementation(() => {});

    const ctx = mockContext();
    expect(guard.canActivate(ctx)).toBe(true);
    expect(csrf.validateRequest).toHaveBeenCalled();
  });

  it("should throw ForbiddenException when validateRequest throws", () => {
    (csrf.validateRequest as jest.Mock).mockImplementation(() => {
      throw new Error("CSRF invalid");
    });

    const ctx = mockContext();

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    expect(csrf.validateRequest).toHaveBeenCalled();
  });
});
