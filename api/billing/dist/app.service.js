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
const events_1 = require("@insureflow/events");
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHello() {
        return 'Hello from INSUREFLOW BILLING API!';
    }
    // Subscribe to ContractCreated events at boot
    onModuleInit() {
        events_1.eventBus.subscribe('ContractCreated', async (event) => {
            console.log(`[Billing Service] Event received: ContractCreated for Contract ${event.aggregateId}`);
            try {
                await this.initializeContractBilling({
                    contractId: event.data.contractId,
                    customerId: event.data.customerId,
                    productId: event.data.productId,
                    policyNumber: event.data.policyNumber
                });
            }
            catch (err) {
                console.error(`[Billing Service] Failed to initialize billing for Contract ${event.aggregateId}:`, err);
            }
        });
    }
    // Initialize Billing & Commission when a contract is created (Module 8/10)
    async initializeContractBilling(data) {
        // 1. Create Premium Invoice (Module 8: Quittancement)
        const amount = 50.00; // Mocked standard monthly premium
        const invoice = await this.prisma.invoice.create({
            data: {
                contractId: data.contractId,
                customerId: data.customerId,
                invoiceNumber: `INV-${data.policyNumber}-${Date.now().toString().slice(-4)}`,
                amount,
                status: 'ISSUED',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 14)) // Due in 14 days
            }
        });
        console.log(`[Billing Service] Generated Invoice ${invoice.invoiceNumber} for Contract ${data.contractId}`);
        // 2. Calculate Commission using dynamic rule engine (Module 10: Commissionnement)
        await this.calculateDynamicCommission(data.contractId, amount);
    }
    // Dynamic commissions calculation engine (Module 10: Commissionnement)
    async calculateDynamicCommission(contractId, baseAmount) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: { product: true, customer: { include: { addresses: true } } }
        });
        if (!contract) {
            throw new Error(`Contract with ID ${contractId} not found`);
        }
        // Determine Base Rate based on Product Type
        let rate = 10.0; // Default 10%
        const productType = contract.product.type;
        if (productType === 'RC_PRO' || productType === 'MRP') {
            rate = 12.0;
        }
        else if (productType === 'AUTO' || productType === 'MOTO') {
            rate = 8.0;
        }
        else if (productType === 'SANTE' || productType === 'PREVOYANCE') {
            rate = 10.0;
        }
        // Determine Broker Volume Bonus (e.g. number of active contracts for this broker)
        const brokerContractsCount = await this.prisma.contract.count({
            where: { brokerId: contract.brokerId }
        });
        if (brokerContractsCount > 50) {
            rate += 4.0; // 4% super volume bonus
        }
        else if (brokerContractsCount > 10) {
            rate += 2.0; // 2% volume bonus
        }
        // Region adjustments: if customer lives in Paris, add +1% region bonus
        const address = contract.customer.addresses.find(addr => addr.isBilling || addr.isPrimary);
        if (address && address.city.toLowerCase() === 'paris') {
            rate += 1.0;
        }
        const commissionAmount = parseFloat((baseAmount * (rate / 100)).toFixed(2));
        const commission = await this.prisma.commission.create({
            data: {
                contractId,
                brokerId: contract.brokerId,
                amount: commissionAmount,
                rate,
                status: 'CALCULATED'
            }
        });
        console.log(`[Billing Service] Dynamic Commission of ${commissionAmount} € (${rate}%) calculated for Broker ${contract.brokerId}`);
        // Publish CommissionCalculated event
        events_1.eventBus.publish({
            id: `evt-${commission.id}`,
            type: 'CommissionCalculated',
            aggregateId: commission.id,
            timestamp: new Date(),
            version: 1,
            data: {
                commissionId: commission.id,
                contractId: commission.contractId,
                brokerId: commission.brokerId,
                amount: commission.amount
            }
        });
        return commission;
    }
    // List all invoices
    async getAllInvoices() {
        return this.prisma.invoice.findMany({
            include: {
                contract: true,
                customer: true,
                payments: true
            }
        });
    }
    // Record payment received (Module 11: Payments)
    async recordPayment(data) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: data.invoiceId }
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${data.invoiceId} not found`);
        }
        // Create payment entry
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId: data.invoiceId,
                customerId: data.customerId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                reference: data.reference,
                status: 'SUCCESS',
                processedAt: new Date()
            }
        });
        // Update invoice status
        await this.prisma.invoice.update({
            where: { id: data.invoiceId },
            data: { status: 'PAID' }
        });
        // Create general accounting transactions entries (Module 9: Comptabilité générale)
        const transaction = await this.prisma.transaction.create({
            data: {
                amount: data.amount,
                type: 'CREDIT',
                accountType: 'TECHNICAL',
                description: `Paiement facture ${invoice.invoiceNumber} via ${data.paymentMethod}`
            }
        });
        await this.prisma.accountingEntry.create({
            data: {
                transactionId: transaction.id,
                debitAccount: '512000', // Bank account
                creditAccount: '411000', // Customer account
                amount: data.amount
            }
        });
        console.log(`[Billing Service] Payment recorded. Setteled invoice ${invoice.invoiceNumber}. General ledger entries created.`);
        // Publish PaymentReceived event
        events_1.eventBus.publish({
            id: `evt-${payment.id}`,
            type: 'PaymentReceived',
            aggregateId: payment.id,
            timestamp: new Date(),
            version: 1,
            data: {
                paymentId: payment.id,
                invoiceId: payment.invoiceId,
                customerId: payment.customerId,
                amount: payment.amount,
                processedAt: payment.processedAt
            }
        });
        return payment;
    }
    // Get commissions list
    async getCommissions() {
        return this.prisma.commission.findMany({
            include: {
                contract: true
            }
        });
    }
    async getTransactions() {
        return this.prisma.transaction.findMany({
            include: {
                accountingEntries: true
            },
            orderBy: { timestamp: 'desc' }
        });
    }
    async getAccountingEntries() {
        return this.prisma.accountingEntry.findMany({
            include: {
                transaction: true
            },
            orderBy: { date: 'desc' }
        });
    }
    async getOverdueInvoices() {
        return this.prisma.invoice.findMany({
            where: {
                status: { in: ['ISSUED', 'OVERDUE'] },
                dueDate: { lt: new Date() }
            },
            include: {
                customer: { include: { contacts: true } },
                contract: true,
                payments: true
            },
            orderBy: { dueDate: 'asc' }
        });
    }
    async remindInvoice(invoiceId, data) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                customer: { include: { contacts: true } }
            }
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${invoiceId} not found`);
        }
        const updatedInvoice = await this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: invoice.status === 'PAID' ? 'PAID' : 'OVERDUE' }
        });
        await this.prisma.interaction.create({
            data: {
                customerId: invoice.customerId,
                type: 'COLLECTION',
                details: `Relance ${data.channel || 'EMAIL'} envoyee pour ${invoice.invoiceNumber}. ${data.note || ''}`.trim()
            }
        });
        return {
            invoice: updatedInvoice,
            customerEmail: invoice.customer.contacts[0]?.email,
            channel: data.channel || 'EMAIL',
            status: 'REMINDER_SENT',
            sentAt: new Date()
        };
    }
    // Export Sage Format
    async exportSage() {
        const entries = await this.prisma.accountingEntry.findMany({
            include: {
                transaction: true
            }
        });
        let csv = "Journal;Date;Compte;Reference;Libelle;Debit;Credit\n";
        for (const entry of entries) {
            const dateStr = entry.date.toISOString().slice(0, 10).replace(/-/g, "");
            const label = entry.transaction.description;
            csv += `VT;${dateStr};${entry.debitAccount};${entry.transactionId.slice(-8)};${label};${entry.amount.toFixed(2)};0.00\n`;
            csv += `VT;${dateStr};${entry.creditAccount};${entry.transactionId.slice(-8)};${label};0.00;${entry.amount.toFixed(2)}\n`;
        }
        return csv;
    }
    // Export SAP Format
    async exportSap() {
        const entries = await this.prisma.accountingEntry.findMany({
            include: {
                transaction: true
            }
        });
        let csv = "DocDate,DocType,CompCode,Account,Amount,Currency,Text\n";
        for (const entry of entries) {
            const dateStr = entry.date.toISOString().slice(0, 10);
            csv += `${dateStr},DG,1000,${entry.debitAccount},${entry.amount.toFixed(2)},EUR,${entry.transaction.description}\n`;
            csv += `${dateStr},DG,1000,${entry.creditAccount},-${entry.amount.toFixed(2)},EUR,${entry.transaction.description}\n`;
        }
        return csv;
    }
    // Export Cegid Format
    async exportCegid() {
        const entries = await this.prisma.accountingEntry.findMany({
            include: {
                transaction: true
            }
        });
        let csv = "CodeJournal;DateEcriture;CompteGeneral;ReferencePiece;LibelleEcriture;MontantDebit;MontantCredit\n";
        for (const entry of entries) {
            const dateStr = entry.date.toLocaleDateString('fr-FR');
            csv += `VE;${dateStr};${entry.debitAccount};${entry.transactionId.slice(-8)};${entry.transaction.description};${entry.amount.toFixed(2)};\n`;
            csv += `VE;${dateStr};${entry.creditAccount};${entry.transactionId.slice(-8)};${entry.transaction.description};;${entry.amount.toFixed(2)}\n`;
        }
        return csv;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map