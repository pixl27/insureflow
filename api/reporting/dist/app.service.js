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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@insureflow/database");
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getHello() {
        return 'Hello from INSUREFLOW REPORTING API!';
    }
    // Calculate Technical KPIs (Module 18 / 19: Reporting / Business Intelligence)
    async getTechnicalKpis() {
        // 1. Premiums (Issued or Paid Invoices)
        const invoices = await this.prisma.invoice.findMany({
            where: {
                status: { in: ['ISSUED', 'PAID'] }
            }
        });
        const totalPremiums = invoices.reduce((sum, inv) => sum + inv.amount, 0);
        // 2. Claims Costs (Payments + Active Reserves)
        const claimPayments = await this.prisma.claimPayment.findMany({
            where: { status: 'PROCESSED' }
        });
        const totalClaimPayments = claimPayments.reduce((sum, p) => sum + p.amount, 0);
        const claimReserves = await this.prisma.claimReserve.findMany({
            where: { status: 'ACTIVE' }
        });
        const totalClaimReserves = claimReserves.reduce((sum, r) => sum + r.amount, 0);
        const totalClaimsCost = totalClaimPayments + totalClaimReserves;
        // 3. Commissions & Expenses
        const commissions = await this.prisma.commission.findMany();
        const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
        const taxes = await this.prisma.tax.findMany();
        const totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);
        // 4. Contract and Claim Counts
        const activeContracts = await this.prisma.contract.count({
            where: { status: 'ACTIVE' }
        });
        const totalClaimsCount = await this.prisma.claim.count();
        // Calculations
        const lossRatio = totalPremiums > 0 ? (totalClaimsCost / totalPremiums) * 100 : 0;
        const combinedRatio = totalPremiums > 0 ? ((totalClaimsCost + totalCommissions + totalTaxes) / totalPremiums) * 100 : 0;
        const frequency = activeContracts > 0 ? totalClaimsCount / activeContracts : 0;
        const severity = totalClaimsCount > 0 ? totalClaimsCost / totalClaimsCount : 0;
        return {
            totalPremiums: parseFloat(totalPremiums.toFixed(2)),
            totalClaimsCost: parseFloat(totalClaimsCost.toFixed(2)),
            totalClaimPayments: parseFloat(totalClaimPayments.toFixed(2)),
            totalClaimReserves: parseFloat(totalClaimReserves.toFixed(2)),
            totalCommissions: parseFloat(totalCommissions.toFixed(2)),
            activeContractsCount: activeContracts,
            claimsCount: totalClaimsCount,
            lossRatio: parseFloat(lossRatio.toFixed(2)), // S/P
            combinedRatio: parseFloat(combinedRatio.toFixed(2)),
            claimsFrequency: parseFloat(frequency.toFixed(4)),
            averageSeverity: parseFloat(severity.toFixed(2)),
            generatedAt: new Date()
        };
    }
    async getOperationalDashboard() {
        const [kpis, recentContracts, recentClaims, overdueInvoices, pendingTasks, recentDocuments] = await Promise.all([
            this.getTechnicalKpis(),
            this.prisma.contract.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { contacts: true } }, product: true }
            }),
            this.prisma.claim.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { contacts: true } }, contract: true }
            }),
            this.prisma.invoice.findMany({
                where: {
                    status: { in: ['ISSUED', 'OVERDUE'] },
                    dueDate: { lt: new Date() }
                },
                take: 8,
                orderBy: { dueDate: 'asc' },
                include: { customer: { include: { contacts: true } } }
            }),
            this.prisma.task.findMany({
                where: { status: { in: ['TODO', 'IN_PROGRESS'] } },
                take: 8,
                orderBy: { dueDate: 'asc' },
                include: { customer: { include: { contacts: true } } }
            }),
            this.prisma.attachment.findMany({
                take: 8,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { contacts: true } } }
            })
        ]);
        return {
            kpis,
            workQueues: {
                recentContracts,
                recentClaims,
                overdueInvoices,
                pendingTasks,
                recentDocuments
            },
            generatedAt: new Date()
        };
    }
    async getAuditTrail() {
        const [contractEvents, claimEvents, interactions, transactions, payments] = await Promise.all([
            this.prisma.contractEvent.findMany({
                take: 50,
                orderBy: { timestamp: 'desc' },
                include: { contract: true }
            }),
            this.prisma.claimEvent.findMany({
                take: 50,
                orderBy: { timestamp: 'desc' },
                include: { claim: true }
            }),
            this.prisma.interaction.findMany({
                take: 50,
                orderBy: { date: 'desc' },
                include: { customer: { include: { contacts: true } } }
            }),
            this.prisma.transaction.findMany({
                take: 50,
                orderBy: { timestamp: 'desc' }
            }),
            this.prisma.payment.findMany({
                take: 50,
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return [
            ...contractEvents.map((event) => ({
                id: event.id,
                source: 'CONTRACT',
                action: event.eventType,
                resourceId: event.contractId,
                reference: event.contract.policyNumber,
                description: event.description,
                timestamp: event.timestamp
            })),
            ...claimEvents.map((event) => ({
                id: event.id,
                source: 'CLAIM',
                action: event.eventType,
                resourceId: event.claimId,
                reference: event.claim.claimNumber,
                description: event.description,
                timestamp: event.timestamp
            })),
            ...interactions.map((interaction) => ({
                id: interaction.id,
                source: 'CRM',
                action: interaction.type,
                resourceId: interaction.customerId,
                reference: interaction.customer.contacts[0]?.email || interaction.customerId,
                description: interaction.details,
                timestamp: interaction.date
            })),
            ...transactions.map((transaction) => ({
                id: transaction.id,
                source: 'ACCOUNTING',
                action: transaction.type,
                resourceId: transaction.id,
                reference: transaction.accountType,
                description: transaction.description,
                timestamp: transaction.timestamp
            })),
            ...payments.map((payment) => ({
                id: payment.id,
                source: 'PAYMENT',
                action: payment.status,
                resourceId: payment.id,
                reference: payment.reference,
                description: `${payment.paymentMethod} - ${payment.amount} EUR`,
                timestamp: payment.createdAt
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100);
    }
    // Export KPIs to CSV / Excel format (Module 18: Reporting - Exports)
    async exportKpisCsv() {
        const kpis = await this.getTechnicalKpis();
        let csv = "KPI;Valeur;Description\n";
        csv += `Total Primes Émises;${kpis.totalPremiums} €;Cumul des factures émises ou payées\n`;
        csv += `Coût Total des Sinistres;${kpis.totalClaimsCost} €;Règlements de sinistres + provisions\n`;
        csv += `Paiements Sinistres;${kpis.totalClaimPayments} €;Règlements décaissés effectifs\n`;
        csv += `Réserves Sinistres;${kpis.totalClaimReserves} €;Provisions techniques actives\n`;
        csv += `Total Commissions Courtiers;${kpis.totalCommissions} €;Commissions calculées dues\n`;
        csv += `Contrats Actifs;${kpis.activeContractsCount};Nombre de polices en vigueur\n`;
        csv += `Nombre de Sinistres;${kpis.claimsCount};Nombre total de sinistres déclarés\n`;
        csv += `Loss Ratio (S/P);${kpis.lossRatio} %;Ratio Sinistres sur Primes\n`;
        csv += `Combined Ratio;${kpis.combinedRatio} %;Ratio combiné technique\n`;
        csv += `Fréquence Sinistres;${(kpis.claimsFrequency * 100).toFixed(2)} %;Fréquence des sinistres par contrat actif\n`;
        csv += `Gravité Moyenne;${kpis.averageSeverity} €;Coût moyen d'un sinistre\n`;
        return csv;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map