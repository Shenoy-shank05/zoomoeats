import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddItemDto {
  @IsString()
  dishId: string;

  @IsNumber()
  @Min(1)
  qty: number;

  @IsNumber()
  @Min(0)
  priceSnap: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
