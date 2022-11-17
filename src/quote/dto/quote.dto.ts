import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class QuoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'The maximum entry length is 500',
  })
  content: string;
}
