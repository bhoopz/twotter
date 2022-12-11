import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailService {
  constructor(
    private mailer: MailerService,
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}
  async sendEmail(email: string, header: string, token: string) {
    await this.mailer.sendMail({
      to: email,
      from: 'dominikfilip88@gmail.com',
      subject: 'Email confirmation - TWOTTER',
      text: `http://${header}/email/verify?token=${token}`,
      html: `
      <h1>Hello</h1>
      <p>Thank for registering on out website.</p>
      <p>Please click link below to verify your account.</p>
      <a href="http://${header}/email/verify?token=${token}">Verify your account</a>
      `,
    });

    return 'Thanks for registering. Please check your email to verify your account.';
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      const confirmUser = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!confirmUser) return 'No user found';
      if (confirmUser.confirmed === true) return 'Email already confirmed';
      await this.prisma.user.update({
        where: {
          id: user.sub,
        },
        data: {
          confirmed: true,
        },
      });
      return 'Thank you for confirming the email, now you can log in';
    } catch (error) {
      return error;
    }
  }
}
