import { IsString, IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
