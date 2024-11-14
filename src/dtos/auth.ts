import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password!: number;
}
