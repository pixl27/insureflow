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
        await this.seedProducts();
        await this.seedContracts();
    }
    async seedProducts() {
        const count = await this.prisma.insuranceProduct.count();
        if (count === 0) {
            console.log('[Contracts Service] Seeding default insurance products...');
            await this.prisma.insuranceProduct.createMany({
                data: [
                    {
                        id: '1',
                        name: 'AUTO-CONFORT',
                        code: 'AUTO-CONFORT',
                        type: 'AUTO',
                        status: 'ACTIVE',
                    },
                    {
                        id: '2',
                        name: 'HOME-ESSENTIAL',
                        code: 'HOME-ESSENTIAL',
                        type: 'HABITATION',
                        status: 'ACTIVE',
                    },
                    {
                        id: '3',
                        name: 'PET-LOVE',
                        code: 'PET-LOVE',
                        type: 'ANIMAUX',
                        status: 'DRAFT',
                    }
                ]
            });
            console.log('[Contracts Service] Products seeded successfully.');
        }
    }
    async seedContracts() {
        const count = await this.prisma.contract.count();
        if (count === 0) {
            console.log('[Contracts Service] Seeding default contracts...');
            // Wait for Customer '1' (Jean Dupont) to be created by CRM service
            // We check if Customer '1' exists. If not, we wait or skip
            const customerExists = await this.prisma.customer.findUnique({
                where: { id: '1' }
            });
            if (!customerExists) {
                console.log('[Contracts Service] Customer 1 not found. Postponing contracts seeding.');
                return;
            }
            await this.prisma.contract.create({
                data: {
                    id: 'c1',
                    customerId: '1',
                    productId: '1',
                    brokerId: 'broker-1',
                    policyNumber: 'POL-AUTO-88219',
                    status: 'ACTIVE',
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2026-01-01')
                }
            });
            await this.prisma.contract.create({
                data: {
                    id: 'c2',
                    customerId: '1',
                    productId: '2',
                    brokerId: 'broker-1',
                    policyNumber: 'POL-MRH-99238',
                    status: 'ACTIVE',
                    startDate: new Date('2025-06-01'),
                    endDate: new Date('2026-06-01')
                }
            });
            console.log('[Contracts Service] Contracts seeded successfully.');
        }
    }
    async getHello() {
        return 'Hello from INSUREFLOW CONTRACTS API!';
    }
    async getProducts() {
        return this.prisma.insuranceProduct.findMany({
            include: {
                coverages: true,
                exclusions: true,
                deductibles: true,
                pricingRules: true,
                commissionRules: true,
                taxRules: true,
                versions: true
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getProductById(id) {
        const product = await this.prisma.insuranceProduct.findUnique({
            where: { id },
            include: {
                coverages: true,
                exclusions: true,
                deductibles: true,
                pricingRules: true,
                commissionRules: true,
                taxRules: true,
                versions: true
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async createProduct(data) {
        const product = await this.prisma.insuranceProduct.create({
            data: {
                name: data.name,
                code: data.code,
                type: data.type,
                status: data.status || 'DRAFT',
                coverages: data.coverages?.length ? {
                    create: data.coverages
                } : undefined,
                pricingRules: data.pricingRuleJson ? {
                    create: { ruleJson: data.pricingRuleJson }
                } : undefined,
                versions: {
                    create: {
                        versionNumber: '1.0',
                        status: data.status || 'DRAFT',
                        ruleJson: data.pricingRuleJson || '{}',
                        activeFrom: new Date()
                    }
                }
            },
            include: {
                coverages: true,
                pricingRules: true,
                versions: true
            }
        });
        return product;
    }
    async updateProduct(id, data) {
        await this.getProductById(id);
        return this.prisma.insuranceProduct.update({
            where: { id },
            data,
            include: {
                coverages: true,
                pricingRules: true,
                versions: true
            }
        });
    }
    async addCoverage(productId, data) {
        await this.getProductById(productId);
        return this.prisma.coverage.create({
            data: {
                productId,
                name: data.name,
                code: data.code,
                description: data.description
            }
        });
    }
    async addPricingRule(productId, ruleJson) {
        await this.getProductById(productId);
        return this.prisma.pricingRule.create({
            data: {
                productId,
                ruleJson: ruleJson || '{}'
            }
        });
    }
    async changeProductStatus(id, status) {
        await this.getProductById(id);
        const product = await this.prisma.insuranceProduct.update({
            where: { id },
            data: { status },
            include: {
                coverages: true,
                pricingRules: true,
                versions: true
            }
        });
        await this.prisma.productVersion.create({
            data: {
                productId: id,
                versionNumber: `${product.versions.length + 1}.0`,
                status,
                ruleJson: JSON.stringify({
                    statusChange: status,
                    at: new Date().toISOString()
                }),
                activeFrom: new Date()
            }
        });
        return this.getProductById(id);
    }
    // List all contracts
    async getAllContracts() {
        return this.prisma.contract.findMany({
            include: {
                customer: true,
                product: true
            }
        });
    }
    // Get contract by ID with versions and events
    async getContractById(id) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                customer: true,
                product: true,
                versions: true,
                events: true,
                beneficiaries: true,
                guarantees: true,
                premiums: true
            }
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract with ID ${id} not found`);
        }
        return contract;
    }
    async getWorkflowCatalog() {
        const workflowRoot = path.join(process.cwd(), '../../workflows');
        const keys = [
            { key: 'contracts/subscription_flow', file: 'contracts/subscription_flow.json', name: 'Souscription contrat' },
            { key: 'claims/claims_flow', file: 'claims/claims_flow.json', name: 'Instruction sinistre' },
            { key: 'billing/collection_flow', file: 'billing/collection_flow.json', name: 'Relance encaissement' }
        ];
        return keys.map((item) => {
            const fullPath = path.join(workflowRoot, item.file);
            const definition = fs.existsSync(fullPath) ? JSON.parse(fs.readFileSync(fullPath, 'utf8')) : null;
            return {
                key: item.key,
                name: item.name,
                available: Boolean(definition),
                stepsCount: definition?.steps?.length || 0,
                definition
            };
        });
    }
    async runWorkflowByKey(key, context, aggregateId) {
        const safeKey = key.replace(/\\/g, '/');
        const flowPath = path.join(process.cwd(), '../../workflows', `${safeKey}.json`);
        if (!fs.existsSync(flowPath)) {
            throw new common_1.NotFoundException(`Workflow ${key} not found`);
        }
        const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
        const engine = new shared_1.BpmnEngine();
        const result = engine.run(flowData, context);
        if (aggregateId && safeKey.startsWith('contracts/')) {
            for (const traceLog of result.trace) {
                await this.prisma.contractEvent.create({
                    data: {
                        contractId: aggregateId,
                        eventType: 'WORKFLOW_TRACE',
                        description: traceLog
                    }
                });
            }
        }
        return {
            key: safeKey,
            aggregateId,
            trace: result.trace,
            currentStepId: result.currentStepId,
            context
        };
    }
    // Run contracts subscription process workflow (Module 7)
    async runContractsWorkflow(contractId, context) {
        try {
            const flowPath = path.join(process.cwd(), '../../workflows/contracts/subscription_flow.json');
            if (fs.existsSync(flowPath)) {
                const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8'));
                const engine = new shared_1.BpmnEngine();
                const result = engine.run(flowData, context);
                console.log(`[Contracts Service] BPMN Workflow trace for Contract ${contractId}:`, result.trace);
                // Log all steps trace in the contract events
                for (const traceLog of result.trace) {
                    await this.prisma.contractEvent.create({
                        data: {
                            contractId,
                            eventType: 'BPMN_TRACE',
                            description: traceLog
                        }
                    });
                }
                // If completed or paused at specific step, update contract status accordingly
                if (result.currentStepId) {
                    const stepStatusMap = {
                        'scoring': 'PENDING_VALIDATION',
                        'broker_manual_review': 'PENDING_VALIDATION',
                        'signature_request': 'PENDING_VALIDATION',
                        'payment_setup': 'PENDING_VALIDATION',
                        'emit_policy': 'ACTIVE'
                    };
                    const nextStatus = stepStatusMap[result.currentStepId];
                    if (nextStatus) {
                        await this.prisma.contract.update({
                            where: { id: contractId },
                            data: { status: nextStatus }
                        });
                    }
                }
            }
        }
        catch (err) {
            console.error('[Contracts Service] Error running BPMN workflow:', err);
        }
    }
    // Calculate quote (Devis rapide/expert - Module 3)
    async calculateQuote(data) {
        const product = await this.prisma.insuranceProduct.findUnique({
            where: { id: data.productId }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${data.productId} not found`);
        }
        // Default base premium simulation (e.g. 500 €/year)
        let finalPremium = 500;
        // Execute rule engine logic: SI age < 25 ALORS +100, SI city == Paris ALORS +50
        if (data.age < 25) {
            finalPremium += 100;
        }
        if (data.city.toLowerCase() === 'paris') {
            finalPremium += 50;
        }
        const monthlyPremium = parseFloat((finalPremium / 12).toFixed(2));
        const commission = parseFloat((monthlyPremium * 0.10).toFixed(2)); // 10% commission
        return {
            productId: data.productId,
            customerId: data.customerId,
            basePremium: finalPremium,
            monthlyPremium,
            commission,
            score: 1.0,
            status: 'APPROVED'
        };
    }
    // Emit policy from quote (Module 4)
    async emitPolicy(data) {
        const contract = await this.prisma.contract.create({
            data: {
                customerId: data.customerId,
                productId: data.productId,
                brokerId: data.brokerId,
                policyNumber: data.policyNumber,
                status: 'ACTIVE',
                startDate: data.startDate,
                endDate: new Date(new Date(data.startDate).setFullYear(new Date(data.startDate).getFullYear() + 1))
            }
        });
        // Create contract event (audit trail)
        await this.prisma.contractEvent.create({
            data: {
                contractId: contract.id,
                eventType: 'SIGNED',
                description: `Contrat signé électroniquement et émis pour la police ${data.policyNumber}`
            }
        });
        // Publish ContractCreated event to EventBus
        events_1.eventBus.publish({
            id: `evt-${contract.id}`,
            type: 'ContractCreated',
            aggregateId: contract.id,
            timestamp: new Date(),
            version: 1,
            data: {
                contractId: contract.id,
                policyNumber: contract.policyNumber,
                customerId: contract.customerId,
                productId: contract.productId,
                startDate: contract.startDate
            }
        });
        // Run the BPMN workflow in background
        this.runContractsWorkflow(contract.id, {
            riskScore: 1.0,
            reviewStatus: 'APPROVED'
        });
        return contract;
    }
    // Suspend policy
    async suspendPolicy(id) {
        const contract = await this.prisma.contract.update({
            where: { id },
            data: { status: 'SUSPENDED' }
        });
        await this.prisma.contractEvent.create({
            data: {
                contractId: id,
                eventType: 'SUSPENDED',
                description: 'Contrat suspendu administrativement'
            }
        });
        return contract;
    }
    // Terminate policy (Résiliation)
    async terminatePolicy(id) {
        const contract = await this.prisma.contract.update({
            where: { id },
            data: { status: 'TERMINATED' }
        });
        await this.prisma.contractEvent.create({
            data: {
                contractId: id,
                eventType: 'TERMINATED',
                description: 'Contrat résilié'
            }
        });
        return contract;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map