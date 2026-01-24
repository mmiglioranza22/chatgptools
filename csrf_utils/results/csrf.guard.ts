import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { verifyCsrfToken } from "./csrf.utils";

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();

    const cookieToken = req.cookies?.csrf;
    const headerToken = req.headers["x-csrf-token"];

    if (!cookieToken || !headerToken) {
      throw new ForbiddenException("Missing CSRF token");
    }

    if (cookieToken !== headerToken) {
      throw new ForbiddenException("CSRF token mismatch");
    }

    if (!verifyCsrfToken(cookieToken)) {
      throw new ForbiddenException("Invalid CSRF token");
    }

    return true;
  }
}
