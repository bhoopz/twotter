import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async startFollow(user: User, id: number) {
    if (user.id === id)
      throw new ForbiddenException('You cant follow yourself lol');

    const usersCount = await this.checkIfExists(id);
    if (usersCount !== 1)
      throw new ForbiddenException('You cant follow this user');

    const checkedUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        followers: true,
      },
    });

    if (checkedUser.followers.filter((e) => e.id === id).length > 0)
      throw new ForbiddenException('Already following');

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        followers: {
          connect: {
            id: id,
          },
        },
      },
    });
    delete updatedUser.hashPassword;
    return updatedUser;
  }

  async unFollow(user: User, id: number) {
    if (user.id === id)
      throw new ForbiddenException('You cant unfollow yourself lol');

    const usersCount = await this.checkIfExists(id);
    if (usersCount !== 1)
      throw new ForbiddenException('You cant unfollow this user');

    const checkedUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        followers: true,
      },
    });
    if (checkedUser.followers.filter((e) => e.id === id).length === 0)
      throw new ForbiddenException('You are not following this user');

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        followers: {
          disconnect: {
            id: id,
          },
        },
      },
    });
    delete updatedUser.hashPassword;
    return updatedUser;
  }

  async checkIfExists(id: number): Promise<number> {
    const usersCount = await this.prisma.user.count({
      where: {
        id: id,
      },
    });
    return usersCount;
  }
}
