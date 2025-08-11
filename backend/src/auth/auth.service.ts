import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(email: string, password: string, name?: string, phone?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } })
    if (exists) throw new BadRequestException('email-exists')
    const hash = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({ data: { email, password: hash, name, phone } })
    const token = await this.sign(user.id, user.role)
    return { token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('invalid-credentials')
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) throw new UnauthorizedException('invalid-credentials')
    const token = await this.sign(user.id, user.role)
    return { token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } }
  }

  async sign(id: string, role: string) {
    return this.jwt.signAsync({ sub: id, role })
  }
}
