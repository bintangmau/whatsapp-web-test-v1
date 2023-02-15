import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send-message')
  async sendMessage(@Body() body: any) {
    await this.appService.sendMessage(
      body.phone,
      body.message
    );
    return "Message Sent";
  }
  
}
