import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    return this.commentRepository.findAllParentComments(paginationDto);
  }

  async findById(id: number) {
    const comment = await this.commentRepository.findOneById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findAllCommentReplies(id: number, paginationDto: PaginationDto) {
    const comment = await this.commentRepository.findOneById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.commentRepository.findAllCommentReplies(id, paginationDto);
  }

  async create(dto: CreateCommentRequestDto) {
    const user = await this.usersService.findByEmail(dto.email);

    const createCommentDto: CreateCommentDto = {
      text: dto.text,
      userId: user.id,
      parentId: dto.parentId ?? null,
    };

    if (!dto.parentId) {
      await this.notificationsService.notifyUser(user.id, 'Comment created');
      return this.commentRepository.create(createCommentDto);
    }

    await this.notificationsService.notifyUser(user.id, 'Replied');

    const parentComment = await this.commentRepository.findOneById(
      dto.parentId,
    );

    if (!parentComment) {
      throw new NotFoundException('Comment not found');
    }

    const parentCommentOwner = await this.usersService.findById(
      parentComment.userId,
    );

    await this.notificationsService.notifyUser(
      parentCommentOwner.id,
      `${user.email} replied to your comment ID: ${parentComment.id}`,
    );

    return this.commentRepository.create(createCommentDto);
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOneById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.commentRepository.update(id, dto);
  }

  async delete(id: number) {
    const existingComment = await this.commentRepository.findOneById(id);

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    return this.commentRepository.delete(id);
  }
}
