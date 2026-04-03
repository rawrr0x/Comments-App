import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { PaginationDto } from 'src/common/utils/pagination/pagination.dto';
import { CreateCommentRequestDto } from './dto/create-comment-request.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({
    type: PaginationDto,
    description: 'Optional data for pagination',
  })
  @ApiResponse({ status: 200, description: 'All comments' })
  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.commentsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get comment by id' })
  @ApiParam({ name: 'id', description: 'ID of comment' })
  @ApiResponse({ status: 200, description: 'Comment' })
  @Get(':id')
  async getOneById(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findById(id);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiParam({ name: 'id', description: 'ID of comment' })
  @ApiQuery({
    type: PaginationDto,
    description: 'Optional data for pagination',
  })
  @ApiResponse({ status: 200, description: 'All comments' })
  @Get(':id/replies')
  async getAllCommentReplies(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.commentsService.findAllCommentReplies(id, paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateCommentRequestDto) {
    return this.commentsService.create(dto);
  }

  @ApiOperation({ summary: 'Update comment text by id' })
  @ApiParam({ name: 'id', description: 'ID of comment' })
  @ApiResponse({ status: 200, description: 'Updated comment' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiParam({ name: 'id', description: 'ID of comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}
