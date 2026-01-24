import { CsrfCookieMiddleware } from "./csrf-cookie.middleware";
import { generateCsrfToken } from "./csrf-utils";

jest.mock("./csrf.util");

describe("CsrfCookieMiddleware", () => {
  let middleware: CsrfCookieMiddleware;

  beforeEach(() => {
    middleware = new CsrfCookieMiddleware();
    (generateCsrfToken as jest.Mock).mockReturnValue("token.signature");
  });

  it("should set csrf cookie if not present", () => {
    const req: any = { cookies: {} };
    const res: any = {
      cookie: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "csrf",
      "token.signature",
      expect.objectContaining({
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        path: "/",
      }),
    );

    expect(next).toHaveBeenCalled();
  });

  it("should not overwrite existing csrf cookie", () => {
    const req: any = {
      cookies: { csrf: "existing.token" },
    };
    const res: any = {
      cookie: jest.fn(),
    };
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.cookie).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
