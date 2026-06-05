import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard, Roles } from '@insureflow/shared';

@Controller('billing')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('invoices')
  getAllInvoices() {
    return this.appService.getAllInvoices();
  }

  @Post('payments')
  recordPayment(
    @Body() body: {
      invoiceId: string;
      customerId: string;
      amount: number;
      paymentMethod: string;
      reference: string;
    }
  ) {
    return this.appService.recordPayment(body);
  }

  @Get('commissions')
  getCommissions() {
    return this.appService.getCommissions();
  }

  @Get('accounting/transactions')
  getTransactions() {
    return this.appService.getTransactions();
  }

  @Get('accounting/entries')
  getAccountingEntries() {
    return this.appService.getAccountingEntries();
  }

  @Get('collections/overdue')
  getOverdueInvoices() {
    return this.appService.getOverdueInvoices();
  }

  @Post('collections/:invoiceId/remind')
  remindInvoice(
    @Param('invoiceId') invoiceId: string,
    @Body() body: { channel?: 'EMAIL' | 'SMS' | 'PORTAL'; note?: string }
  ) {
    return this.appService.remindInvoice(invoiceId, body);
  }

  @Post('commissions/calculate')
  calculateDynamicCommission(
    @Body() body: {
      contractId: string;
      premiumAmount: number;
    }
  ) {
    return this.appService.calculateDynamicCommission(body.contractId, body.premiumAmount);
  }

  @Get('exports/sage')
  async getSageExport() {
    return this.appService.exportSage();
  }

  @Get('exports/sap')
  async getSapExport() {
    return this.appService.exportSap();
  }

  @Get('exports/cegid')
  async getCegidExport() {
    return this.appService.exportCegid();
  }
}
