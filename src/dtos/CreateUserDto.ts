import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  //@IsStrongPassword()
  @IsString()
  password!: string;

  @IsString()
  name!: string;
}
