import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard } from '@insureflow/shared';

@Controller('payments')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('charge')
  chargePayment(
    @Body() body: {
      invoiceId: string;
      customerId: string;
      amount: number;
      paymentMethod: 'STRIPE' | 'CB' | 'SEPA' | 'GOCARDLESS';
    }
  ) {
    return this.appService.chargePayment(body);
  }

  @Post('refund')
  refundPayment(
    @Body() body: {
      paymentId: string;
      amount: number;
    }
  ) {
    return this.appService.refundPayment(body);
  }

  @Post('sepa/mandate')
  setupSepaMandate(
    @Body() body: {
      customerId: string;
      iban: string;
      bic: string;
    }
  ) {
    return this.appService.setupSepaMandate(body);
  }
}
