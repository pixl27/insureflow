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
    getHello() {
        return 'Hello from INSUREFLOW PAYMENTS API!';
    }
    // Charge Payment via Stripe/CB/SEPA (Module 11: Payments)
    async chargePayment(data) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: data.invoiceId }
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${data.invoiceId} not found`);
        }
        if (invoice.status === 'PAID') {
            throw new common_1.BadRequestException('Invoice is already paid');
        }
        // Simulate Payment Gateway Success (e.g. Stripe API call)
        const transactionReference = `ch_${Math.random().toString(36).substring(2, 15)}`;
        // Register Payment record
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId: data.invoiceId,
                customerId: data.customerId,
                amount: data.amount,
                paymentMethod: data.paymentMethod,
                reference: transactionReference,
                status: 'SUCCESS',
                processedAt: new Date()
            }
        });
        // Update Invoice status to PAID
        await this.prisma.invoice.update({
            where: { id: data.invoiceId },
            data: { status: 'PAID' }
        });
        // Create Technical & General Ledger entries (Module 9)
        const transaction = await this.prisma.transaction.create({
            data: {
                amount: data.amount,
                type: 'CREDIT',
                accountType: 'TECHNICAL',
                description: `Paiement facture ${invoice.invoiceNumber} via ${data.paymentMethod} (Ref: ${transactionReference})`
            }
        });
        await this.prisma.accountingEntry.create({
            data: {
                transactionId: transaction.id,
                debitAccount: data.paymentMethod === 'SEPA' ? '512002' : '512000', // Separate bank journal
                creditAccount: '411000',
                amount: data.amount
            }
        });
        console.log(`[Payments Service] Payment of ${data.amount} EUR processed successfully.`);
        // Publish PaymentReceivedEvent to EventBus
        events_1.eventBus.publish({
            id: `evt-pay-${payment.id}`,
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
        return {
            success: true,
            paymentId: payment.id,
            reference: transactionReference,
            amount: data.amount,
            status: 'SUCCESS'
        };
    }
    // Refund Payment (Module 11: Payments - Remboursements)
    async refundPayment(data) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: data.paymentId },
            include: { invoice: true }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${data.paymentId} not found`);
        }
        if (data.amount > payment.amount) {
            throw new common_1.BadRequestException('Refund amount exceeds original payment amount');
        }
        // Simulate Refund Gateway Success (e.g. Stripe Refund API)
        const refundReference = `re_${Math.random().toString(36).substring(2, 15)}`;
        // Create Negative Payment entry representing Refund
        const refundPayment = await this.prisma.payment.create({
            data: {
                invoiceId: payment.invoiceId,
                customerId: payment.customerId,
                amount: -data.amount,
                paymentMethod: payment.paymentMethod,
                reference: refundReference,
                status: 'SUCCESS',
                processedAt: new Date()
            }
        });
        // Update Invoice status to CANCELLED/PARTIALLY_REFUNDED if fully refunded
        if (data.amount === payment.amount) {
            await this.prisma.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: 'CANCELLED' }
            });
        }
        // Create Technical & General Ledger entries
        const transaction = await this.prisma.transaction.create({
            data: {
                amount: data.amount,
                type: 'DEBIT',
                accountType: 'TECHNICAL',
                description: `Remboursement paiement ${payment.reference} (Ref: ${refundReference})`
            }
        });
        await this.prisma.accountingEntry.create({
            data: {
                transactionId: transaction.id,
                debitAccount: '411000',
                creditAccount: payment.paymentMethod === 'SEPA' ? '512002' : '512000',
                amount: data.amount
            }
        });
        console.log(`[Payments Service] Refund of ${data.amount} EUR processed successfully.`);
        return {
            success: true,
            refundId: refundPayment.id,
            reference: refundReference,
            amount: data.amount
        };
    }
    // Verify and Setup SEPA Mandate (Module 11: SEPA/Mandates)
    async setupSepaMandate(data) {
        // Basic verification of IBAN/BIC format
        const cleanedIban = data.iban.replace(/\s/g, '').toUpperCase();
        const cleanedBic = data.bic.replace(/\s/g, '').toUpperCase();
        if (cleanedIban.length < 15 || cleanedBic.length < 8) {
            throw new common_1.BadRequestException('Invalid IBAN or BIC format');
        }
        // Save mandate setup under customer interactions for audit/KYC (Module 1/5/11)
        await this.prisma.interaction.create({
            data: {
                customerId: data.customerId,
                type: 'SYSTEM',
                details: `Mandat SEPA enregistré avec succès. IBAN: ${cleanedIban.substring(0, 4)}...${cleanedIban.slice(-4)}, BIC: ${cleanedBic}`
            }
        });
        return {
            success: true,
            mandateReference: `RUM-${data.customerId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            status: 'ACTIVE',
            registeredAt: new Date()
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map