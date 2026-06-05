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
    getAllContracts() {
        return this.appService.getAllContracts();
    }
    getProducts() {
        return this.appService.getProducts();
    }
    createProduct(body) {
        return this.appService.createProduct(body);
    }
    getProductById(id) {
        return this.appService.getProductById(id);
    }
    updateProduct(id, body) {
        return this.appService.updateProduct(id, body);
    }
    addCoverage(id, body) {
        return this.appService.addCoverage(id, body);
    }
    addPricingRule(id, body) {
        return this.appService.addPricingRule(id, body.ruleJson);
    }
    publishProduct(id) {
        return this.appService.changeProductStatus(id, 'ACTIVE');
    }
    archiveProduct(id) {
        return this.appService.changeProductStatus(id, 'ARCHIVED');
    }
    getWorkflowCatalog() {
        return this.appService.getWorkflowCatalog();
    }
    runWorkflow(key, body) {
        return this.appService.runWorkflowByKey(key, body.context || {}, body.aggregateId);
    }
    runWorkflowFromBody(body) {
        return this.appService.runWorkflowByKey(body.key, body.context || {}, body.aggregateId);
    }
    getContractById(id) {
        return this.appService.getContractById(id);
    }
    calculateQuote(body) {
        return this.appService.calculateQuote(body);
    }
    emitPolicy(body) {
        return this.appService.emitPolicy({
            ...body,
            startDate: new Date(body.startDate)
        });
    }
    suspendPolicy(id) {
        return this.appService.suspendPolicy(id);
    }
    terminatePolicy(id) {
        return this.appService.terminatePolicy(id);
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
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAllContracts", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/coverages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addCoverage", null);
__decorate([
    (0, common_1.Post)('products/:id/pricing-rules'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addPricingRule", null);
__decorate([
    (0, common_1.Post)('products/:id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "publishProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/archive'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "archiveProduct", null);
__decorate([
    (0, common_1.Get)('workflows/catalog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getWorkflowCatalog", null);
__decorate([
    (0, common_1.Post)('workflows/:key/run'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "runWorkflow", null);
__decorate([
    (0, common_1.Post)('workflows/run'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "runWorkflowFromBody", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getContractById", null);
__decorate([
    (0, common_1.Post)('quotes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "calculateQuote", null);
__decorate([
    (0, common_1.Post)('emit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "emitPolicy", null);
__decorate([
    (0, common_1.Post)(':id/suspend'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "suspendPolicy", null);
__decorate([
    (0, common_1.Post)(':id/terminate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "terminatePolicy", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('contracts'),
    (0, common_1.UseGuards)(shared_1.JwtGuard),
    __metadata("design:paramtypes", [app_service_js_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map