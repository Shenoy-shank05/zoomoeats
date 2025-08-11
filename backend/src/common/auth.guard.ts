import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest()
    const h = req.headers.authorization || ''
    const t = h.startsWith('Bearer ') ? h.slice(7) : null
    if (!t) throw new UnauthorizedException()
    try { req.user = this.jwt.verify(t) } catch { throw new UnauthorizedException() }
    return true
  }
}
