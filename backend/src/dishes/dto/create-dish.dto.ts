import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'
export class CreateDishDto {
  @IsString() restaurantId: string
  @IsString() name: string
  @IsString() category: string
  @IsInt() @Min(0) price: number
  @IsOptional() @IsBoolean() isVeg?: boolean
  @IsOptional() @IsBoolean() isAvailable?: boolean
  @IsOptional() @IsString() imgUrl?: string
  @IsOptional() @IsString() description?: string
}
