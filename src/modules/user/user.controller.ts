import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /user
  @Post()
  @HttpCode(HttpStatus.CREATED)
  newUser(@Body() createUser: CreateUserDTO) {
    return this.userService.create(createUser);
  }

  // GET /user
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  getAll(@Query() pagination: PaginationDto) {
    return this.userService.getAll(pagination);
  }

  // GET /user/:id
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.get(id);
  }

  // PATCH /user/:id
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDTO) {
    return this.userService.update(id, updateUser);
  }

  // DELETE /user/:id
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
