import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentRequestDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @Length(1, 500, {
    message: 'Password length should be only between 1 and 500 symbols',
  })
  text: string;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;
}
