import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { QuoteDto } from './dto/quote.dto';
import { QuoteService } from './quote.service';

@UseGuards(JwtGuard)
@Controller('quotes')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Post()
  publishQuote(@Body() dto: QuoteDto, @GetUser() user: User) {
    return this.quoteService.publishQuote(dto, user);
  }

  @Get()
  getallMyQuotes(@GetUser() user: User) {
    return this.quoteService.getAllMyQuotes(user);
  }

  @Get('trendy')
  popularQuotes() {
    return this.quoteService.popularQuotes();
  }

  @Get('dashboard')
  displayDashboard(@GetUser() user: User) {
    return this.quoteService.displayDashboard(user);
  }

  @Get('newest')
  newestQuotes() {
    return this.quoteService.newestQuotes();
  }

  @Get(':id')
  displaySomeoneQuotes(@Param('id', ParseIntPipe) id: number) {
    return this.quoteService.displaySomeoneQuotes(id);
  }

  @Patch(':id')
  updateQuote(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    dto: QuoteDto,
  ) {
    return this.quoteService.updateQuote(user, id, dto);
  }

  @Delete(':id')
  deleteQuote(@GetUser() user: User, @Param('id', ParseIntPipe) id) {
    return this.quoteService.deleteQuote(user, id);
  }

  @Post(':id/like')
  likeQuote(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.quoteService.likeQuote(user, id);
  }

  @Delete(':id/unlike')
  unlikeQuote(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.quoteService.unlikeQuote(user, id);
  }
}
