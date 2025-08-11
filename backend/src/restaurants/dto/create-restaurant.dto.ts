import { IsInt, IsOptional, IsString, Min } from 'class-validator'
export class CreateRestaurantDto {
  @IsString() name: string
  @IsOptional() @IsString() area?: string
  @IsOptional() @IsString() cuisine?: string
  @IsOptional() @IsInt() @Min(0) deliveryFee?: number
  @IsOptional() @IsInt() @Min(0) minOrder?: number
  @IsOptional() @IsString() imgUrl?: string
}
