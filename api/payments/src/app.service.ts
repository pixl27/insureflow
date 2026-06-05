import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';
import { eventBus } from '@insureflow/events';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello from INSUREFLOW PAYMENTS API!';
  }

  // Charge Payment via Stripe/CB/SEPA (Module 11: Payments)
  async chargePayment(data: {
    invoiceId: string;
    customerId: string;
    amount: number;
    paymentMethod: 'STRIPE' | 'CB' | 'SEPA' | 'GOCARDLESS';
  }) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: data.invoiceId }
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${data.invoiceId} not found`);
    }

    if (invoice.status === 'PAID') {
      throw new BadRequestException('Invoice is already paid');
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
    eventBus.publish({
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
        processedAt: payment.processedAt!
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
  async refundPayment(data: { paymentId: string; amount: number }) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: data.paymentId },
      include: { invoice: true }
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${data.paymentId} not found`);
    }

    if (data.amount > payment.amount) {
      throw new BadRequestException('Refund amount exceeds original payment amount');
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
  async setupSepaMandate(data: { customerId: string; iban: string; bic: string }) {
    // Basic verification of IBAN/BIC format
    const cleanedIban = data.iban.replace(/\s/g, '').toUpperCase();
    const cleanedBic = data.bic.replace(/\s/g, '').toUpperCase();

    if (cleanedIban.length < 15 || cleanedBic.length < 8) {
      throw new BadRequestException('Invalid IBAN or BIC format');
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
}
