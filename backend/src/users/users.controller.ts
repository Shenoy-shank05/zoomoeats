import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Post('addresses')
  async addAddress(@CurrentUser() user: any, @Body() addressData: any) {
    return this.usersService.addAddress(user.id, addressData);
  }

  @Patch('addresses/:id')
  async updateAddress(
    @CurrentUser() user: any,
    @Param('id') addressId: string,
    @Body() addressData: any,
  ) {
    return this.usersService.updateAddress(user.id, addressId, addressData);
  }

  @Delete('addresses/:id')
  async deleteAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(user.id, addressId);
  }

  @Patch('addresses/:id/default')
  async setDefaultAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.usersService.setDefaultAddress(user.id, addressId);
  }
}
