import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, Request } from "express";
import { generateCsrfToken } from "./csrf.utils";

@Injectable()
export class CsrfCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (!req.cookies?.csrf) {
      const csrf = generateCsrfToken();

      res.cookie("csrf", csrf, {
        httpOnly: false, // must be readable by JS
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
    next();
  }
}
