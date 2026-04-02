import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { HASH_SALT } from 'src/common/constants';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.findOneByEmail(dto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }

    dto.password = await bcrypt.hash(dto.password, HASH_SALT);

    return this.userRepository.create(dto);
  }
}
