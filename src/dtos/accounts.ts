import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AccountDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name!: string;
}
