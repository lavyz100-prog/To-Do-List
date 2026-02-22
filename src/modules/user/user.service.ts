import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create User
  async create(createUser: CreateUserDTO): Promise<User> {
    const newUser = this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  // Get All Users
  // user.service.ts
  async getAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'name', 'email', 'type', 'createdAt'], // exclude password
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get User by ID
  async get(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Get User by Email
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'type'], // explicitly include password
    });
    return user;
  }

  // Update User
  async update(id: string, updateUser: UpdateUserDTO): Promise<User> {
    const user = await this.get(id);
    Object.assign(user, updateUser);
    return await this.userRepository.save(user);
  }

  // Update Last Login
  async updateLastLogin(id: string, time: Date): Promise<void> {
    const user = await this.get(id);
    user.lastLogin = time;
    await this.userRepository.save(user); // 👈 was missing
  }

  // Delete User
  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
