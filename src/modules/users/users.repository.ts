import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base.repository';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async create(dto: CreateUserDto) {
    const user = this.repository.create(dto);
    return this.repository.save(user);
  }
}
