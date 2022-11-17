import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async putAComment(dto: CommentDto, id: number, user: User) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        userId: user.id,
        quoteId: id,
      },
    });
    return comment;
  }

  async updateComment(user: User, id: number, dto: CommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
    });
    if (!comment || comment.userId !== user.id)
      throw new ForbiddenException('Access to resource denied');

    return await this.prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteComment(user: User, id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!comment || comment.userId !== user.id)
      throw new ForbiddenException('Access to resource denied');

    return await this.prisma.comment.delete({
      where: {
        id: id,
      },
    });
  }

  async likeComment(user: User, id: number) {
    const commentsCount = await this.checkIfExists(id);
    if (commentsCount !== 1)
      throw new ForbiddenException('Comment does not exist');

    const checkedComment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        likes: true,
      },
    });
    if (checkedComment.likes.filter((e) => e.id === user.id).length > 0)
      throw new ForbiddenException('Already liked');

    const likedComment = await this.prisma.comment.update({
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
    return likedComment;
  }

  async unlikeComment(user: User, id: number) {
    const commentsCount = await this.checkIfExists(id);
    if (commentsCount !== 1)
      throw new ForbiddenException('Comment does not exist');

    const checkedComment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        likes: true,
      },
    });
    if (checkedComment.likes.filter((e) => e.id === user.id).length === 0)
      throw new ForbiddenException('Cant unlike unliked comment');

    const likedComment = await this.prisma.comment.update({
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
    return likedComment;
  }

  async checkIfExists(id: number): Promise<number> {
    const commentsCount = await this.prisma.comment.count({
      where: {
        id: id,
      },
    });
    return commentsCount;
  }
}
