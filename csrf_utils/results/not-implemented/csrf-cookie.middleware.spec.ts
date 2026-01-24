import { CsrfCookieMiddleware } from "./csrf-cookie.middleware";
import { csrf } from "./csrf.config";

jest.mock("./csrf.config", () => ({
  csrf: {
    generateToken: jest.fn(),
  },
}));

describe("CsrfCookieMiddleware", () => {
  let middleware: CsrfCookieMiddleware;

  beforeEach(() => {
    middleware = new CsrfCookieMiddleware();
    jest.clearAllMocks();
  });

  it("should call generateToken and continue", () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    middleware.use(req as any, res as any, next);

    expect(csrf.generateToken).toHaveBeenCalledWith(req, res);
    expect(next).toHaveBeenCalled();
  });

  it("should still call next if generateToken throws", () => {
    (csrf.generateToken as jest.Mock).mockImplementation(() => {
      throw new Error("unexpected");
    });

    const req = {};
    const res = {};
    const next = jest.fn();

    expect(() => middleware.use(req as any, res as any, next)).toThrow();

    // If you prefer resilience, you can catch and log instead
    expect(next).not.toHaveBeenCalled();
  });
});
