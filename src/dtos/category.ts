import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { TypeCategory } from "../commons/type.enum";

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsNotEmpty()
  @IsEnum(TypeCategory, { message: "category must be a valid category" })
  type!: TypeCategory;

  @IsOptional()
  @IsBoolean()
  is_public!: boolean;
}
