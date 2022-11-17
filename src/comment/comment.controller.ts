import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CommentService } from './comment.service';
import { CommentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('quotes/:id/comment')
  putAComment(
    @Body() dto: CommentDto,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.commentService.putAComment(dto, id, user);
  }

  @Patch('comments/:id')
  updateComment(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    dto: CommentDto,
  ) {
    return this.commentService.updateComment(user, id, dto);
  }

  @Delete('comments/:id')
  deleteComment(@GetUser() user: User, @Param('id', ParseIntPipe) id) {
    return this.commentService.deleteComment(user, id);
  }

  @Post('comments/:id/like')
  likeComment(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.likeComment(user, id);
  }

  @Delete('comments/:id/unlike')
  unlikeComment(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.unlikeComment(user, id);
  }
}
