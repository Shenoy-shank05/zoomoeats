import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class AddItemDto {
  @IsString()
  dishId: string;

  // final quantity for this dish in cart (not delta)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
