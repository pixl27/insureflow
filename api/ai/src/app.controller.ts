import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard } from '@insureflow/shared';

@Controller('ai')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('summarize-claim')
  summarizeClaim(@Body('claimId') claimId: string) {
    return this.appService.summarizeClaim(claimId);
  }

  @Post('fraud-score')
  evaluateFraudScore(@Body('claimId') claimId: string) {
    return this.appService.evaluateFraudScore(claimId);
  }

  @Post('extract-doc')
  extractDocumentInfo(@Body('attachmentId') attachmentId: string) {
    return this.appService.extractDocumentInfo(attachmentId);
  }
}
