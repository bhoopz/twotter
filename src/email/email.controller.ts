import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Get('verify')
  sendEmail(@Query('token') token: string) {
    return this.emailService.verifyEmail(token);
  }
}
