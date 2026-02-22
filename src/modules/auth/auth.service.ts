import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Register User
  async registerUser(register: RegisterUserDTO) {
    if (register.password !== register.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const exist = await this.userService.findByEmail(register.email);
    if (exist) {
      throw new ConflictException('Email is already taken.');
    }

    const hashedPassword = await bcrypt.hash(register.password, 10);

    const user = await this.userService.create({
      ...register,
      password: hashedPassword,
    });

    return {
      status: 201,
      message: 'User registered successfully.',
      data: user,
    };
  }

  // Get Me
  async getMe(id: string) {
    return await this.userService.get(id);
  }

  // Login User
  async loginUser(login: LoginUserDTO) {
    const user = await this.userService.findByEmail(login.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(login.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.userService.updateLastLogin(user.id, new Date());
    const { password, ...result } = user;
    const token: string = this.jwtService.sign({
      sub: result.id,
      email: result.email,
      type: result.type,
    });
    return {
      status: 200,
      message: 'Login successful.',
      data: result,
      token: token,
    };
  }

  // Logout User
  async logoutUser(id: string) {
    return this.userService.updateLastLogin(id, new Date());
  }
}
