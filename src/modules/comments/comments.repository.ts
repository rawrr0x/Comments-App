import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/base.repository';
import { Comment } from './comments.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';
import { Pagination } from 'src/common/utils/pagination/pagiantion.util';
import { ParentCommentReturn } from 'src/common/interfaces/parent-comment-return.interface';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(@InjectRepository(Comment) userRepository: Repository<Comment>) {
    super(userRepository);
  }

  async findAllParentComments(paginationDto: PaginationDto) {
    const pagination = new Pagination<ParentCommentReturn>(paginationDto);

    const [comments, total] = await this.repository.findAndCount({
      where: { parentId: IsNull() },
      relations: ['replies'],
      take: Number(pagination.limit),
      skip: Number(pagination.offset()),
    });

    const data: ParentCommentReturn[] = comments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      userId: comment.userId,
      parentId: comment.parentId,
      repliesCount: comment.replies.length,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return pagination.result(total, data);
  }

  async findAllCommentReplies(id: number, paginationDto: PaginationDto) {
    const pagiantion = new Pagination<ParentCommentReturn>(paginationDto);

    const [replies, total] = await this.repository.findAndCount({
      where: { parentId: id },
      relations: ['replies'],
      take: Number(pagiantion.limit),
      skip: Number(pagiantion.offset()),
    });

    const data: ParentCommentReturn[] = replies.map((comment) => ({
      id: comment.id,
      text: comment.text,
      userId: comment.userId,
      parentId: comment.parentId,
      repliesCount: comment.replies.length,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return pagiantion.result(total, data);
  }

  async findOneById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['replies'],
    });
  }

  async create(dto: CreateCommentDto) {
    const comment = this.repository.create(dto);
    return this.repository.save(comment);
  }

  async update(id: number, dto: UpdateCommentDto) {
    await this.repository.update(id, { text: dto.text });
    return this.findOneById(id);
  }
}
