import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250, {
    message: 'The maximum comment length is 250',
  })
  content: string;
}
