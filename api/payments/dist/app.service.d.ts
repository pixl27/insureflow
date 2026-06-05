import { PrismaService } from '@insureflow/database';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    chargePayment(data: {
        invoiceId: string;
        customerId: string;
        amount: number;
        paymentMethod: 'STRIPE' | 'CB' | 'SEPA' | 'GOCARDLESS';
    }): Promise<{
        success: boolean;
        paymentId: string;
        reference: string;
        amount: number;
        status: string;
    }>;
    refundPayment(data: {
        paymentId: string;
        amount: number;
    }): Promise<{
        success: boolean;
        refundId: string;
        reference: string;
        amount: number;
    }>;
    setupSepaMandate(data: {
        customerId: string;
        iban: string;
        bic: string;
    }): Promise<{
        success: boolean;
        mandateReference: string;
        status: string;
        registeredAt: Date;
    }>;
}
