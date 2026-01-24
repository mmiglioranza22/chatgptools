import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { csrf } from "./csrf.config";

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();

    try {
      csrf.validateRequest(req, res);
      return true;
    } catch {
      throw new ForbiddenException("Invalid CSRF token");
    }
  }
}
