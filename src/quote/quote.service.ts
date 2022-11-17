import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuoteDto } from './dto/quote.dto';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  async publishQuote(dto: QuoteDto, user: User) {
    const quote = await this.prisma.quote.create({
      data: {
        content: dto.content,
        userId: user.id,
      },
    });
    return quote;
  }

  async getAllMyQuotes(user: User) {
    const allMyQuotes = await this.prisma.quote.findMany({
      where: {
        userId: user.id,
      },
      include: {
        comments: { select: { content: true } },
        likes: { select: { id: true } },
        _count: true,
      },
    });

    return allMyQuotes;
  }

  async displaySomeoneQuotes(id: number) {
    const someoneQuotes = await this.prisma.quote.findMany({
      where: {
        userId: id,
      },
      include: {
        comments: true,
      },
    });

    return someoneQuotes;
  }

  async displayDashboard(user: User): Promise<{}[]> {
    const dashboard = await this.prisma.user.findMany({
      where: {
        id: user.id,
      },
      select: {
        followers: {
          select: {
            quotes: {
              select: {
                id: true,
                userId: true,
                createdAt: true,
                content: true,
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });
    const dashboardToDisplay: {}[] = dashboard[0].followers
      .map((item) => item.quotes)
      .filter(({ length }) => length > 0)
      .flat()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return dashboardToDisplay;
  }

  async updateQuote(user: User, id: number, dto: QuoteDto) {
    const quote = await this.prisma.quote.findUnique({
      where: {
        id: id,
      },
    });
    if (!quote || quote.userId !== user.id)
      throw new ForbiddenException('Access to resource denied');

    return await this.prisma.quote.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteQuote(user: User, id: number) {
    const quote = await this.prisma.quote.findUnique({
      where: {
        id: id,
      },
    });

    if (!quote || quote.userId !== user.id)
      throw new ForbiddenException('Access to resource denied');

    return await this.prisma.quote.delete({
      where: {
        id: id,
      },
    });
  }

  async likeQuote(user: User, id: number) {
    const quotesCount = await this.checkIfExists(id);
    if (quotesCount !== 1) throw new ForbiddenException('Quote does not exist');

    const checkedQuote = await this.prisma.quote.findUnique({
      where: {
        id: id,
      },
      include: {
        likes: true,
      },
    });
    if (checkedQuote.likes.filter((e) => e.id === user.id).length > 0)
      throw new ForbiddenException('Already liked');

    const likedQuote = await this.prisma.quote.update({
      where: {
        id: id,
      },
      data: {
        likes: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return likedQuote;
  }

  async unlikeQuote(user: User, id: number) {
    const quotesCount = await this.checkIfExists(id);
    if (quotesCount !== 1) throw new ForbiddenException('Quote does not exist');

    const checkedQuote = await this.prisma.quote.findUnique({
      where: {
        id: id,
      },
      include: {
        likes: true,
      },
    });
    if (checkedQuote.likes.filter((e) => e.id === user.id).length === 0)
      throw new ForbiddenException('Cant unlike unliked quote');

    const unlikedQuote = await this.prisma.quote.update({
      where: {
        id: id,
      },
      data: {
        likes: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
    return unlikedQuote;
  }

  async popularQuotes() {
    let lastDay: number | string = Date.now() - 2 * 24 * 60 * 60 * 1000; //  2 days
    lastDay = new Date(lastDay).toISOString();

    const trendyQuotes = await this.prisma.quote.findMany({
      take: 20,
      where: {
        createdAt: {
          gte: lastDay,
        },
      },
      include: {
        likes: { select: { id: true } },
        comments: { select: { content: true } },
        _count: true,
      },
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    });

    return trendyQuotes;
  }

  async newestQuotes() {
    const newQuotes = await this.prisma.quote.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        likes: { select: { id: true } },
        comments: { select: { content: true } },
        _count: true,
      },
    });

    return newQuotes;
  }

  async checkIfExists(id: number): Promise<number> {
    const quotesCount = await this.prisma.quote.count({
      where: {
        id: id,
      },
    });
    return quotesCount;
  }
}
