import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @Length(1, 500, {
    message: 'Text length should be only between 1 and 500 symbols',
  })
  text: string;
}
