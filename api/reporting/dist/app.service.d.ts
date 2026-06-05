import { PrismaService } from '@insureflow/database';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    getTechnicalKpis(): Promise<{
        totalPremiums: number;
        totalClaimsCost: number;
        totalClaimPayments: number;
        totalClaimReserves: number;
        totalCommissions: number;
        activeContractsCount: number;
        claimsCount: number;
        lossRatio: number;
        combinedRatio: number;
        claimsFrequency: number;
        averageSeverity: number;
        generatedAt: Date;
    }>;
    getOperationalDashboard(): Promise<{
        kpis: {
            totalPremiums: number;
            totalClaimsCost: number;
            totalClaimPayments: number;
            totalClaimReserves: number;
            totalCommissions: number;
            activeContractsCount: number;
            claimsCount: number;
            lossRatio: number;
            combinedRatio: number;
            claimsFrequency: number;
            averageSeverity: number;
            generatedAt: Date;
        };
        workQueues: {
            recentContracts: ({
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
                product: {
                    id: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    type: import(".prisma/client").$Enums.ProductType;
                    code: string;
                };
            } & {
                id: string;
                customerId: string;
                status: import(".prisma/client").$Enums.ContractStatus;
                createdAt: Date;
                updatedAt: Date;
                brokerId: string;
                productId: string;
                policyNumber: string;
                startDate: Date;
                endDate: Date | null;
            })[];
            recentClaims: ({
                contract: {
                    id: string;
                    customerId: string;
                    status: import(".prisma/client").$Enums.ContractStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    brokerId: string;
                    productId: string;
                    policyNumber: string;
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
            } & {
                id: string;
                contractId: string;
                customerId: string;
                status: import(".prisma/client").$Enums.ClaimStatus;
                createdAt: Date;
                updatedAt: Date;
                claimNumber: string;
                eventDate: Date;
                declarationDate: Date;
                description: string;
                fraudScore: number;
            })[];
            overdueInvoices: ({
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
            } & {
                id: string;
                contractId: string;
                customerId: string;
                invoiceNumber: string;
                amount: number;
                status: import(".prisma/client").$Enums.InvoiceStatus;
                dueDate: Date;
                createdAt: Date;
                updatedAt: Date;
            })[];
            pendingTasks: ({
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
            } & {
                id: string;
                customerId: string;
                status: string;
                dueDate: Date;
                description: string | null;
                title: string;
                assigneeId: string;
            })[];
            recentDocuments: ({
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
            } & {
                id: string;
                customerId: string;
                createdAt: Date;
                name: string;
                url: string;
                fileType: string;
                size: number;
                hash: string;
            })[];
        };
        generatedAt: Date;
    }>;
    getAuditTrail(): Promise<{
        id: string;
        source: string;
        action: string;
        resourceId: string;
        reference: string;
        description: string;
        timestamp: Date;
    }[]>;
    exportKpisCsv(): Promise<string>;
}
