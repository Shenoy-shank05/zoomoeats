import { IsOptional, IsString } from 'class-validator'
export class ListRestaurantsDto {
  @IsOptional() @IsString() q?: string
  @IsOptional() @IsString() area?: string
  @IsOptional() @IsString() cuisine?: string
}
