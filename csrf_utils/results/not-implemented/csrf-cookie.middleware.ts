import { Injectable, NestMiddleware } from "@nestjs/common";
import { csrf } from "./csrf.config";

@Injectable()
export class CsrfCookieMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Generates cookie if missing or expired
    csrf.generateToken(req, res);
    next();
  }
}
