import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('token')
  getToken(@Body() body: { username: string; roles: string[] }) {
    const username = body.username || 'mahery';
    const roles = body.roles || ['UNDERWRITER', 'CUSTOMER', 'AGENT'];
    const token = this.appService.generateToken(username, roles);
    return { access_token: token };
  }
}
