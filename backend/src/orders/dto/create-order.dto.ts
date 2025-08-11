import { IsArray, IsInt, IsObject, IsString, Min } from 'class-validator'
export class CreateOrderDto {
  @IsString() restaurantId: string
  @IsArray() items: { dishId: string; name: string; price: number; qty: number; custom?: any }[]
  @IsInt() @Min(0) deliveryFee: number
  @IsInt() @Min(0) tax: number
  @IsInt() @Min(0) total: number
  @IsObject() addressSnap: any
}
