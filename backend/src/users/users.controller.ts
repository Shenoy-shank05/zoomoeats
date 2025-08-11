import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from '../common/auth.guard'
import { CurrentUser } from '../common/current-user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: any) { return this.users.me(user.sub) }

  @Patch('me')
  update(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.users.update(user.sub, dto)
  }
}
