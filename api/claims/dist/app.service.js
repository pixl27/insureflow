"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@insureflow/database");
const events_1 = require("@insureflow/events");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const shared_1 = require("@insureflow/shared");
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedClaims();
    }
    async seedClaims() {
        const count = await this.prisma.claim.count();
        if (count === 0) {
            console.log('[Claims Service] Seeding default claims...');
            // We check if Customer '1' and Contract 'c1' exist
            const contractExists = await this.prisma.contract.findUnique({
                where: { id: 'c1' }
            });
            if (!contractExists) {
                console.log('[Claims Service] Contract c1 not found. Postponing claims seeding.');
                return;
            }
            // Seed claim 1: S-7721
            await this.prisma.claim.create({
                data: {
                    id: 's1',
                    contractId: 'c1',
                    customerId: '1',
                    claimNumber: 'S-7721',
                    eventDate: new Date('2026-04-12'),
                    status: 'VALIDATED',
                    description: 'Accident parking (portière enfoncée)',
                    fraudScore: 0.1,
                    reserves: {
                        create: {
                            amount: 500,
                            type: 'DAMAGE',
                            status: 'ACTIVE'
                        }
                    }
                }
            });
            // Seed claim 2: S-8910
            await this.prisma.claim.create({
                data: {
                    id: 's2',
                    contractId: 'c2',
                    customerId: '1',
                    claimNumber: 'S-8910',
                    eventDate: new Date('2026-06-02'),
                    status: 'DECLARED',
                    description: 'Dégât des eaux (salle de bain)',
                    fraudScore: 0.2
                }
            });
            console.log('[Claims Service] Claims seeded successfully.');
        }
    }
    async getHello() {
        return 'Hello from INSUREFLOW CLAIMS API!';
    }
    // Get all claims
    async getAllClaims() {
        return this.prisma.claim.findMany({
            include: {
                contract: true,
                customer: true
            }
        });
    }
    // Get claim by ID with detailed events, reserves and payments
    async getClaimById(id) {
        const claim = await this.prisma.claim.findUnique({
            where: { id },
            include: {
                contract: true,
                customer: true,
                events: true,
                reserves: true,
                payments: true,
                expertMissions: true,
                documents: true
            }
        });
        if (!claim) {
            throw new common_1.NotFoundException(`Claim with ID ${id} not found`);
        }
        return claim;
    }
    // Run claims process workflow (Module 7)
    async runClaimsWorkflow(claimId, context) {
        try {
            const flowPath = path.join(process.cwd(), '../../workflows/claims/claims_flow.json');
            if (fs.existsSync(flowPath)) {
                const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
                const engine = new shared_1.BpmnEngine();
                const result = engine.run(flowData, context);
                console.log(`[Claims Service] BPMN Workflow trace for Claim ${claimId}:`, result.trace);
                // Log all steps trace in the claim events
                for (const traceLog of result.trace) {
                    await this.prisma.claimEvent.create({
                        data: {
                            claimId,
                            eventType: 'BPMN_TRACE',
                            description: traceLog
                        }
                    });
                }
                // If completed or paused at specific step, update claim status accordingly
                if (result.currentStepId) {
                    const stepStatusMap = {
                        'qualification': 'QUALIFIED',
                        'fraud_investigation': 'ASSIGNED',
                        'expert_mission': 'INSPECTED',
                        'manager_approval': 'VALIDATED',
                        'direct_payout': 'PAID'
                    };
                    const nextStatus = stepStatusMap[result.currentStepId];
                    if (nextStatus) {
                        await this.prisma.claim.update({
                            where: { id: claimId },
                            data: { status: nextStatus }
                        });
                    }
                }
            }
        }
        catch (err) {
            console.error('[Claims Service] Error running BPMN workflow:', err);
        }
    }
    // Declare a claim (Module 5)
    async declareClaim(data) {
        // Basic AI fraud score simulation: if description mentions certain keywords, increase score (Module 24)
        let fraudScore = 0.1;
        const lowerDesc = data.description.toLowerCase();
        if (lowerDesc.includes('fraude') || lowerDesc.includes('volé') && lowerDesc.includes('clé')) {
            fraudScore = 0.75; // Suspect
        }
        const claim = await this.prisma.claim.create({
            data: {
                contractId: data.contractId,
                customerId: data.customerId,
                claimNumber: data.claimNumber,
                eventDate: data.eventDate,
                description: data.description,
                status: 'DECLARED',
                fraudScore
            }
        });
        // Create claim event
        await this.prisma.claimEvent.create({
            data: {
                claimId: claim.id,
                eventType: 'DECLARED',
                description: `Sinistre déclaré par le client. Score IA suspicion fraude : ${fraudScore}`
            }
        });
        // Publish ClaimOpenedEvent to EventBus
        events_1.eventBus.publish({
            id: `evt-${claim.id}`,
            type: 'ClaimOpened',
            aggregateId: claim.id,
            timestamp: new Date(),
            version: 1,
            data: {
                claimId: claim.id,
                claimNumber: claim.claimNumber,
                contractId: claim.contractId,
                customerId: claim.customerId,
                eventDate: claim.eventDate
            }
        });
        // Run the BPMN workflow in background
        this.runClaimsWorkflow(claim.id, {
            claimAmount: 600, // Dummy claim amount
            fraudScore: fraudScore
        });
        return claim;
    }
    // Adjust Claim Reserves (Module 5/8)
    async adjustReserve(claimId, data) {
        const reserve = await this.prisma.claimReserve.create({
            data: {
                claimId,
                amount: data.amount,
                type: data.type,
                status: 'ACTIVE'
            }
        });
        await this.prisma.claimEvent.create({
            data: {
                claimId,
                eventType: 'RESERVE_ADJUSTED',
                description: `Provisionnement de type ${data.type} d'un montant de ${data.amount} €`
            }
        });
        return reserve;
    }
    // Register payout transaction
    async payClaim(claimId, data) {
        const payment = await this.prisma.claimPayment.create({
            data: {
                claimId,
                amount: data.amount,
                paymentDate: new Date(),
                payeeId: data.payeeId,
                status: 'PROCESSED'
            }
        });
        await this.prisma.claimEvent.create({
            data: {
                claimId,
                eventType: 'PAYMENT_ISSUED',
                description: `Règlement émis à l'ordre de ${data.payeeId} pour un montant de ${data.amount} €`
            }
        });
        // Update claim status if necessary
        await this.prisma.claim.update({
            where: { id: claimId },
            data: { status: 'PAID' }
        });
        return payment;
    }
    // Assign Expert Mission
    async assignExpert(claimId, data) {
        const mission = await this.prisma.expertMission.create({
            data: {
                claimId,
                expertId: data.expertId,
                status: 'ASSIGNED',
                scheduledDate: data.scheduledDate
            }
        });
        await this.prisma.claim.update({
            where: { id: claimId },
            data: { status: 'ASSIGNED' }
        });
        await this.prisma.claimEvent.create({
            data: {
                claimId,
                eventType: 'EXPERT_ASSIGNED',
                description: `Mission d'expertise confiée à l'expert ${data.expertId} le ${data.scheduledDate}`
            }
        });
        return mission;
    }
    async transitionClaim(claimId, status, eventType, description) {
        const claim = await this.prisma.claim.update({
            where: { id: claimId },
            data: { status },
            include: {
                events: true,
                reserves: true,
                payments: true,
                expertMissions: true,
                documents: true,
                contract: true,
                customer: true
            }
        });
        await this.prisma.claimEvent.create({
            data: {
                claimId,
                eventType,
                description
            }
        });
        events_1.eventBus.publish({
            id: `evt-claim-${claimId}-${Date.now()}`,
            type: `Claim${eventType}`,
            aggregateId: claimId,
            timestamp: new Date(),
            version: claim.events.length + 1,
            data: {
                claimId,
                claimNumber: claim.claimNumber,
                status,
                description
            }
        });
        return this.getClaimById(claimId);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map