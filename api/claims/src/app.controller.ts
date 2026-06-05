import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard, Roles } from '@insureflow/shared';

@Controller('claims')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get()
  getAllClaims() {
    return this.appService.getAllClaims();
  }

  @Get(':id')
  getClaimById(@Param('id') id: string) {
    return this.appService.getClaimById(id);
  }

  @Post()
  declareClaim(
    @Body() body: {
      contractId: string;
      customerId: string;
      claimNumber: string;
      eventDate: string;
      description: string;
    }
  ) {
    return this.appService.declareClaim({
      ...body,
      eventDate: new Date(body.eventDate)
    });
  }

  @Post(':id/reserves')
  adjustReserve(
    @Param('id') id: string,
    @Body() body: { amount: number; type: 'DAMAGE' | 'FEES' | 'RECOVERY' }
  ) {
    return this.appService.adjustReserve(id, body);
  }

  @Post(':id/payments')
  payClaim(
    @Param('id') id: string,
    @Body() body: { amount: number; payeeId: string }
  ) {
    return this.appService.payClaim(id, body);
  }

  @Post(':id/expert')
  assignExpert(
    @Param('id') id: string,
    @Body() body: { expertId: string; scheduledDate: string }
  ) {
    return this.appService.assignExpert(id, {
      expertId: body.expertId,
      scheduledDate: new Date(body.scheduledDate)
    });
  }

  @Post(':id/qualify')
  qualifyClaim(
    @Param('id') id: string,
    @Body() body: { qualification: string; managerId?: string }
  ) {
    return this.appService.transitionClaim(id, 'QUALIFIED', 'QUALIFIED', body.qualification || 'Sinistre qualifie');
  }

  @Post(':id/validate')
  validateClaim(
    @Param('id') id: string,
    @Body() body: { decision: string; managerId?: string }
  ) {
    return this.appService.transitionClaim(id, 'VALIDATED', 'VALIDATED', body.decision || 'Validation manager accordee');
  }

  @Post(':id/close')
  closeClaim(
    @Param('id') id: string,
    @Body() body: { reason: string }
  ) {
    return this.appService.transitionClaim(id, 'CLOSED', 'CLOSED', body.reason || 'Dossier cloture');
  }
}
