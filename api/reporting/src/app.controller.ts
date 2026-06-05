import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard } from '@insureflow/shared';

@Controller('reporting')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kpis')
  getTechnicalKpis() {
    return this.appService.getTechnicalKpis();
  }

  @Get('operational-dashboard')
  getOperationalDashboard() {
    return this.appService.getOperationalDashboard();
  }

  @Get('audit-trail')
  getAuditTrail() {
    return this.appService.getAuditTrail();
  }

  @Get('export/excel')
  exportKpisCsv() {
    return this.appService.exportKpisCsv();
  }
}
