import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post(':id/follow')
  startFollow(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.userService.startFollow(user, id);
  }

  @Delete(':id/unfollow')
  unFollow(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.userService.unFollow(user, id);
  }
}
