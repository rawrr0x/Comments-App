import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersService: UsersService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    return this.commentRepository.findAll(paginationDto);
  }

  async findById(id: number) {
    const comment = await this.commentRepository.findOneById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async create(dto: CreateCommentRequestDto) {
    const user = await this.usersService.findByEmail(dto.email);

    const createCommentDto: CreateCommentDto = {
      text: dto.text,
      userId: user.id,
    };

    return this.commentRepository.create(createCommentDto);
  }

  async delete(id: number) {
    const existingComment = await this.commentRepository.findOneById(id);

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    return this.commentRepository.delete(id);
  }
}
