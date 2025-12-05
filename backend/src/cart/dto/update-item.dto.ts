import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  // final quantity for this cart item
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
