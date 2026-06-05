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
    getAllInvoices() {
        return this.appService.getAllInvoices();
    }
    recordPayment(body) {
        return this.appService.recordPayment(body);
    }
    getCommissions() {
        return this.appService.getCommissions();
    }
    getTransactions() {
        return this.appService.getTransactions();
    }
    getAccountingEntries() {
        return this.appService.getAccountingEntries();
    }
    getOverdueInvoices() {
        return this.appService.getOverdueInvoices();
    }
    remindInvoice(invoiceId, body) {
        return this.appService.remindInvoice(invoiceId, body);
    }
    calculateDynamicCommission(body) {
        return this.appService.calculateDynamicCommission(body.contractId, body.premiumAmount);
    }
    async getSageExport() {
        return this.appService.exportSage();
    }
    async getSapExport() {
        return this.appService.exportSap();
    }
    async getCegidExport() {
        return this.appService.exportCegid();
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
    (0, common_1.Get)('invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAllInvoices", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)('commissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCommissions", null);
__decorate([
    (0, common_1.Get)('accounting/transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('accounting/entries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAccountingEntries", null);
__decorate([
    (0, common_1.Get)('collections/overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getOverdueInvoices", null);
__decorate([
    (0, common_1.Post)('collections/:invoiceId/remind'),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "remindInvoice", null);
__decorate([
    (0, common_1.Post)('commissions/calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "calculateDynamicCommission", null);
__decorate([
    (0, common_1.Get)('exports/sage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSageExport", null);
__decorate([
    (0, common_1.Get)('exports/sap'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getSapExport", null);
__decorate([
    (0, common_1.Get)('exports/cegid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCegidExport", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('billing'),
    (0, common_1.UseGuards)(shared_1.JwtGuard),
    __metadata("design:paramtypes", [app_service_js_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map