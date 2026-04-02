import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base.repository';
import { Comment } from './comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(@InjectRepository(Comment) userRepository: Repository<Comment>) {
    super(userRepository);
  }

  async create(dto: CreateCommentDto) {
    const comment = this.repository.create(dto);
    return this.repository.save(comment);
  }
}
