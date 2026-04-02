import { IsString, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(1, { message: 'Name length should be more than 1' })
  name: string;

  @IsString()
  @Length(6, 100, {
    message: 'Password length should be only between 6 and 100 symbols',
  })
  password: string;
}
