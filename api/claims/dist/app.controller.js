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
    getAllClaims() {
        return this.appService.getAllClaims();
    }
    getClaimById(id) {
        return this.appService.getClaimById(id);
    }
    declareClaim(body) {
        return this.appService.declareClaim({
            ...body,
            eventDate: new Date(body.eventDate)
        });
    }
    adjustReserve(id, body) {
        return this.appService.adjustReserve(id, body);
    }
    payClaim(id, body) {
        return this.appService.payClaim(id, body);
    }
    assignExpert(id, body) {
        return this.appService.assignExpert(id, {
            expertId: body.expertId,
            scheduledDate: new Date(body.scheduledDate)
        });
    }
    qualifyClaim(id, body) {
        return this.appService.transitionClaim(id, 'QUALIFIED', 'QUALIFIED', body.qualification || 'Sinistre qualifie');
    }
    validateClaim(id, body) {
        return this.appService.transitionClaim(id, 'VALIDATED', 'VALIDATED', body.decision || 'Validation manager accordee');
    }
    closeClaim(id, body) {
        return this.appService.transitionClaim(id, 'CLOSED', 'CLOSED', body.reason || 'Dossier cloture');
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
], AppController.prototype, "getAllClaims", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getClaimById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "declareClaim", null);
__decorate([
    (0, common_1.Post)(':id/reserves'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "adjustReserve", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "payClaim", null);
__decorate([
    (0, common_1.Post)(':id/expert'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "assignExpert", null);
__decorate([
    (0, common_1.Post)(':id/qualify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "qualifyClaim", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "validateClaim", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "closeClaim", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('claims'),
    (0, common_1.UseGuards)(shared_1.JwtGuard),
    __metadata("design:paramtypes", [app_service_js_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map