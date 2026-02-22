import { IsString, MinLength } from 'class-validator';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';

export class RegisterUserDTO extends CreateUserDTO {
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
