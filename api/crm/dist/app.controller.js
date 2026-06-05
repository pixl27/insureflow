"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_js_1 = require("./app.service.js");
const shared_1 = require("@insureflow/shared");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    searchCustomers(q) {
        return this.appService.searchCustomers(q || '');
    }
    getSegments() {
        return this.appService.getSegments();
    }
    mergeCustomers(primaryId, duplicateId) {
        return this.appService.mergeCustomers(primaryId, duplicateId);
    }
    getAllCustomers() {
        return this.appService.getAllCustomers();
    }
    getCustomerById(id) {
        return this.appService.getCustomerById(id);
    }
    getCustomerTimeline(id) {
        return this.appService.getCustomerTimeline(id);
    }
    createNote(id, body) {
        return this.appService.createNote(id, body);
    }
    createTask(id, body) {
        return this.appService.createTask(id, body);
    }
    updateTask(taskId, body) {
        return this.appService.updateTask(taskId, body);
    }
    createInteraction(id, body) {
        return this.appService.createInteraction(id, body);
    }
    createCustomer(body) {
        return this.appService.createCustomer(body);
    }
    updateCustomer(id, body) {
        return this.appService.updateCustomer(id, body);
    }
    deleteCustomer(id) {
        return this.appService.deleteCustomer(id);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "searchCustomers", null);
__decorate([
    (0, common_1.Get)('segments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getSegments", null);
__decorate([
    (0, common_1.Post)('merge'),
    __param(0, (0, common_1.Body)('primaryId')),
    __param(1, (0, common_1.Body)('duplicateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "mergeCustomers", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCustomerById", null);
__decorate([
    (0, common_1.Get)(':id/timeline'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCustomerTimeline", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createNote", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Post)(':id/interactions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createInteraction", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteCustomer", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('customers'),
    (0, common_1.UseGuards)(shared_1.JwtGuard),
    __metadata("design:paramtypes", [app_service_js_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map