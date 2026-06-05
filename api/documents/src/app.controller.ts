import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, Body, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service.js';
import { JwtGuard, Roles } from '@insureflow/shared';

@Controller('documents')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getDocuments(@Query('customerId') customerId?: string, @Query('q') q?: string) {
    return this.appService.getDocuments({ customerId, q });
  }

  @Get('templates')
  getTemplates() {
    return this.appService.getTemplates();
  }

  @Post('generate')
  generateDocument(
    @Body() body: {
      customerId: string;
      templateKey: string;
      variables?: Record<string, string | number>;
    }
  ) {
    return this.appService.generateDocument(body);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Body('customerId') customerId: string
  ) {
    const buffer = file?.buffer || Buffer.from('Nom: Sophie Lemoine\nMontant: 45.99\nAdresse: 12 Rue de la Paix, Paris');
    const filename = file?.originalname || 'facture_test.txt';
    const mimetype = file?.mimetype || 'text/plain';
    const cid = customerId || 'cust-default-ocr-99';

    return this.appService.uploadDocument(cid, filename, buffer, mimetype);
  }

  @Post(':id/signature-request')
  requestSignature(
    @Param('id') id: string,
    @Body() body: { signerEmail: string; channel?: 'EMAIL' | 'SMS' | 'PORTAL' }
  ) {
    return this.appService.requestSignature(id, body);
  }

  @Get(':id/url')
  async getDocumentUrl(@Param('id') id: string) {
    const url = await this.appService.getDocumentUrl(id);
    return { url };
  }
}
