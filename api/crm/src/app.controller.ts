import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtGuard, Roles } from '@insureflow/shared';

@Controller('customers')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('search')
  searchCustomers(@Query('q') q: string) {
    return this.appService.searchCustomers(q || '');
  }

  @Get('segments')
  getSegments() {
    return this.appService.getSegments();
  }

  @Post('merge')
  mergeCustomers(
    @Body('primaryId') primaryId: string,
    @Body('duplicateId') duplicateId: string
  ) {
    return this.appService.mergeCustomers(primaryId, duplicateId);
  }

  @Get()
  getAllCustomers() {
    return this.appService.getAllCustomers();
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.appService.getCustomerById(id);
  }

  @Get(':id/timeline')
  getCustomerTimeline(@Param('id') id: string) {
    return this.appService.getCustomerTimeline(id);
  }

  @Post(':id/notes')
  createNote(
    @Param('id') id: string,
    @Body() body: { content: string; authorId?: string }
  ) {
    return this.appService.createNote(id, body);
  }

  @Post(':id/tasks')
  createTask(
    @Param('id') id: string,
    @Body() body: { title: string; description?: string; dueDate?: string; assigneeId?: string }
  ) {
    return this.appService.createTask(id, body);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @Param('taskId') taskId: string,
    @Body() body: { status?: string; title?: string; description?: string; dueDate?: string; assigneeId?: string }
  ) {
    return this.appService.updateTask(taskId, body);
  }

  @Post(':id/interactions')
  createInteraction(
    @Param('id') id: string,
    @Body() body: { type: string; details: string }
  ) {
    return this.appService.createInteraction(id, body);
  }

  @Post()
  createCustomer(@Body() body: { type: 'INDIVIDUAL' | 'COMPANY' | 'ASSOCIATION'; score?: number }) {
    return this.appService.createCustomer(body);
  }

  @Patch(':id')
  updateCustomer(
    @Param('id') id: string,
    @Body() body: { kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'; score?: number }
  ) {
    return this.appService.updateCustomer(id, body);
  }

  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.appService.deleteCustomer(id);
  }
}
