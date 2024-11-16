import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  cost!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  note!: string;

  @IsNotEmpty()
  @IsString()
  category!: number;
}
