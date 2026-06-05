import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<string>;
    getAllInvoices(): Promise<({
        contract: {
            id: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brokerId: string;
            policyNumber: string;
            productId: string;
            startDate: Date;
            endDate: Date | null;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
        };
        payments: {
            id: string;
            amount: number;
            status: string;
            createdAt: Date;
            customerId: string;
            paymentMethod: string;
            reference: string;
            processedAt: Date | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        invoiceNumber: string;
        amount: number;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        customerId: string;
    })[]>;
    recordPayment(body: {
        invoiceId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        reference: string;
    }): Promise<{
        id: string;
        amount: number;
        status: string;
        createdAt: Date;
        customerId: string;
        paymentMethod: string;
        reference: string;
        processedAt: Date | null;
        invoiceId: string;
    }>;
    getCommissions(): Promise<({
        contract: {
            id: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brokerId: string;
            policyNumber: string;
            productId: string;
            startDate: Date;
            endDate: Date | null;
        };
    } & {
        id: string;
        amount: number;
        status: string;
        contractId: string;
        brokerId: string;
        rate: number;
        calculatedAt: Date;
    })[]>;
    getTransactions(): Promise<({
        accountingEntries: {
            id: string;
            amount: number;
            debitAccount: string;
            creditAccount: string;
            date: Date;
            transactionId: string;
        }[];
    } & {
        id: string;
        amount: number;
        type: string;
        accountType: string;
        description: string;
        timestamp: Date;
    })[]>;
    getAccountingEntries(): Promise<({
        transaction: {
            id: string;
            amount: number;
            type: string;
            accountType: string;
            description: string;
            timestamp: Date;
        };
    } & {
        id: string;
        amount: number;
        debitAccount: string;
        creditAccount: string;
        date: Date;
        transactionId: string;
    })[]>;
    getOverdueInvoices(): Promise<({
        contract: {
            id: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            brokerId: string;
            policyNumber: string;
            productId: string;
            startDate: Date;
            endDate: Date | null;
        };
        customer: {
            contacts: {
                id: string;
                customerId: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string | null;
                role: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
        };
        payments: {
            id: string;
            amount: number;
            status: string;
            createdAt: Date;
            customerId: string;
            paymentMethod: string;
            reference: string;
            processedAt: Date | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        invoiceNumber: string;
        amount: number;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        dueDate: Date;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        customerId: string;
    })[]>;
    remindInvoice(invoiceId: string, body: {
        channel?: 'EMAIL' | 'SMS' | 'PORTAL';
        note?: string;
    }): Promise<{
        invoice: {
            id: string;
            invoiceNumber: string;
            amount: number;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            dueDate: Date;
            createdAt: Date;
            updatedAt: Date;
            contractId: string;
            customerId: string;
        };
        customerEmail: string;
        channel: "EMAIL" | "SMS" | "PORTAL";
        status: string;
        sentAt: Date;
    }>;
    calculateDynamicCommission(body: {
        contractId: string;
        premiumAmount: number;
    }): Promise<{
        id: string;
        amount: number;
        status: string;
        contractId: string;
        brokerId: string;
        rate: number;
        calculatedAt: Date;
    }>;
    getSageExport(): Promise<string>;
    getSapExport(): Promise<string>;
    getCegidExport(): Promise<string>;
}
