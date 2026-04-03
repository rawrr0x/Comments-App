import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;
}
