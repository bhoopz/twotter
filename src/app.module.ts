import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { QuoteModule } from './quote/quote.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    AuthModule,
    UserModule,
    QuoteModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentModule,
    MailerModule.forRoot({
      transport: {
        host: '',
        auth: {
          user: '',
          pass: '',
        },
      },
    }),
  ],
})
export class AppModule {}
