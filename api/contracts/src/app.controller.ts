import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard, Roles } from '@insureflow/shared';

@Controller('contracts')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get()
  getAllContracts() {
    return this.appService.getAllContracts();
  }

  @Get('products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Post('products')
  createProduct(
    @Body() body: {
      name: string;
      code: string;
      type: any;
      status?: string;
      coverages?: Array<{ name: string; code: string; description?: string }>;
      pricingRuleJson?: string;
    }
  ) {
    return this.appService.createProduct(body);
  }

  @Get('products/:id')
  getProductById(@Param('id') id: string) {
    return this.appService.getProductById(id);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      code?: string;
      type?: any;
      status?: string;
    }
  ) {
    return this.appService.updateProduct(id, body);
  }

  @Post('products/:id/coverages')
  addCoverage(
    @Param('id') id: string,
    @Body() body: { name: string; code: string; description?: string }
  ) {
    return this.appService.addCoverage(id, body);
  }

  @Post('products/:id/pricing-rules')
  addPricingRule(
    @Param('id') id: string,
    @Body() body: { ruleJson: string }
  ) {
    return this.appService.addPricingRule(id, body.ruleJson);
  }

  @Post('products/:id/publish')
  publishProduct(@Param('id') id: string) {
    return this.appService.changeProductStatus(id, 'ACTIVE');
  }

  @Post('products/:id/archive')
  archiveProduct(@Param('id') id: string) {
    return this.appService.changeProductStatus(id, 'ARCHIVED');
  }

  @Get('workflows/catalog')
  getWorkflowCatalog() {
    return this.appService.getWorkflowCatalog();
  }

  @Post('workflows/:key/run')
  runWorkflow(
    @Param('key') key: string,
    @Body() body: { context?: Record<string, any>; aggregateId?: string }
  ) {
    return this.appService.runWorkflowByKey(key, body.context || {}, body.aggregateId);
  }

  @Post('workflows/run')
  runWorkflowFromBody(
    @Body() body: { key: string; context?: Record<string, any>; aggregateId?: string }
  ) {
    return this.appService.runWorkflowByKey(body.key, body.context || {}, body.aggregateId);
  }

  @Get(':id')
  getContractById(@Param('id') id: string) {
    return this.appService.getContractById(id);
  }

  @Post('quotes')
  calculateQuote(
    @Body() body: { productId: string; customerId: string; age: number; city: string }
  ) {
    return this.appService.calculateQuote(body);
  }

  @Post('emit')
  emitPolicy(
    @Body() body: {
      customerId: string;
      productId: string;
      brokerId: string;
      policyNumber: string;
      monthlyPremium: number;
      startDate: string;
    }
  ) {
    return this.appService.emitPolicy({
      ...body,
      startDate: new Date(body.startDate)
    });
  }

  @Post(':id/suspend')
  suspendPolicy(@Param('id') id: string) {
    return this.appService.suspendPolicy(id);
  }

  @Post(':id/terminate')
  terminatePolicy(@Param('id') id: string) {
    return this.appService.terminatePolicy(id);
  }
}
