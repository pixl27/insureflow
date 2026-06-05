import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    chargePayment(body: {
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
    refundPayment(body: {
        paymentId: string;
        amount: number;
    }): Promise<{
        success: boolean;
        refundId: string;
        reference: string;
        amount: number;
    }>;
    setupSepaMandate(body: {
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
