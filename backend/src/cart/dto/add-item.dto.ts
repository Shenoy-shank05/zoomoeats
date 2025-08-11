import { IsInt, IsOptional, IsString, Min } from 'class-validator'
export class AddItemDto {
  @IsString() dishId: string
  @IsInt() @Min(1) qty: number
  @IsInt() @Min(0) priceSnap: number
  @IsOptional() custom?: any
}
