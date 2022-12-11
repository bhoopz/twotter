import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [JwtModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
