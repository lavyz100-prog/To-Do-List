import {
  Controller,
  Param,
  Patch,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  registerUser(@Body() data: RegisterUserDTO) {
    return this.auth.registerUser(data);
  }

  @Post('login')
  loginUser(@Body() data: LoginUserDTO) {
    return this.auth.loginUser(data);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Request() req) {
    return this.auth.getMe(req.user.sub);
  }

  @Patch(':id/logout')
  logout(@Param('id') id: string) {
    return this.auth.logoutUser(id);
  }
}
