import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
