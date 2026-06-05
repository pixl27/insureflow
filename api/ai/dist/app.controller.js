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
    summarizeClaim(claimId) {
        return this.appService.summarizeClaim(claimId);
    }
    evaluateFraudScore(claimId) {
        return this.appService.evaluateFraudScore(claimId);
    }
    extractDocumentInfo(attachmentId) {
        return this.appService.extractDocumentInfo(attachmentId);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('summarize-claim'),
    __param(0, (0, common_1.Body)('claimId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "summarizeClaim", null);
__decorate([
    (0, common_1.Post)('fraud-score'),
    __param(0, (0, common_1.Body)('claimId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "evaluateFraudScore", null);
__decorate([
    (0, common_1.Post)('extract-doc'),
    __param(0, (0, common_1.Body)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "extractDocumentInfo", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(shared_1.JwtGuard),
    __metadata("design:paramtypes", [app_service_js_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map