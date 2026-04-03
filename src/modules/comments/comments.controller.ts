import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return this.commentsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get comment by id' })
  @ApiParam({ name: 'id', description: 'ID of comment' })
  @ApiResponse({ status: 200, description: 'Comment' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneById(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateCommentRequestDto) {
    return this.commentsService.create(dto);
  }
}
