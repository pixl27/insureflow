import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';
export declare class AppService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedClaims(): Promise<void>;
    getHello(): Promise<string>;
    getAllClaims(): Promise<({
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
        };
        contract: {
            id: string;
            policyNumber: string;
            customerId: string;
            productId: string;
            brokerId: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            startDate: Date;
            endDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        customerId: string;
        status: import(".prisma/client").$Enums.ClaimStatus;
        createdAt: Date;
        updatedAt: Date;
        claimNumber: string;
        eventDate: Date;
        declarationDate: Date;
        description: string;
        fraudScore: number;
        contractId: string;
    })[]>;
    getClaimById(id: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
        };
        events: {
            id: string;
            description: string;
            eventType: string;
            timestamp: Date;
            claimId: string;
        }[];
        contract: {
            id: string;
            policyNumber: string;
            customerId: string;
            productId: string;
            brokerId: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            startDate: Date;
            endDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        reserves: {
            id: string;
            status: string;
            updatedAt: Date;
            amount: number;
            type: string;
            claimId: string;
        }[];
        payments: {
            id: string;
            status: string;
            amount: number;
            claimId: string;
            paymentDate: Date;
            payeeId: string;
        }[];
        expertMissions: {
            id: string;
            status: string;
            claimId: string;
            expertId: string;
            reportUrl: string | null;
            scheduledDate: Date;
            completedDate: Date | null;
        }[];
        documents: {
            id: string;
            name: string;
            claimId: string;
            url: string;
            fileType: string;
        }[];
    } & {
        id: string;
        customerId: string;
        status: import(".prisma/client").$Enums.ClaimStatus;
        createdAt: Date;
        updatedAt: Date;
        claimNumber: string;
        eventDate: Date;
        declarationDate: Date;
        description: string;
        fraudScore: number;
        contractId: string;
    }>;
    runClaimsWorkflow(claimId: string, context: Record<string, any>): Promise<void>;
    declareClaim(data: {
        contractId: string;
        customerId: string;
        claimNumber: string;
        eventDate: Date;
        description: string;
    }): Promise<{
        id: string;
        customerId: string;
        status: import(".prisma/client").$Enums.ClaimStatus;
        createdAt: Date;
        updatedAt: Date;
        claimNumber: string;
        eventDate: Date;
        declarationDate: Date;
        description: string;
        fraudScore: number;
        contractId: string;
    }>;
    adjustReserve(claimId: string, data: {
        amount: number;
        type: 'DAMAGE' | 'FEES' | 'RECOVERY';
    }): Promise<{
        id: string;
        status: string;
        updatedAt: Date;
        amount: number;
        type: string;
        claimId: string;
    }>;
    payClaim(claimId: string, data: {
        amount: number;
        payeeId: string;
    }): Promise<{
        id: string;
        status: string;
        amount: number;
        claimId: string;
        paymentDate: Date;
        payeeId: string;
    }>;
    assignExpert(claimId: string, data: {
        expertId: string;
        scheduledDate: Date;
    }): Promise<{
        id: string;
        status: string;
        claimId: string;
        expertId: string;
        reportUrl: string | null;
        scheduledDate: Date;
        completedDate: Date | null;
    }>;
    transitionClaim(claimId: string, status: 'DECLARED' | 'QUALIFIED' | 'ASSIGNED' | 'INSPECTED' | 'VALIDATED' | 'PAID' | 'CLOSED', eventType: string, description: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
        };
        events: {
            id: string;
            description: string;
            eventType: string;
            timestamp: Date;
            claimId: string;
        }[];
        contract: {
            id: string;
            policyNumber: string;
            customerId: string;
            productId: string;
            brokerId: string;
            status: import(".prisma/client").$Enums.ContractStatus;
            startDate: Date;
            endDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        reserves: {
            id: string;
            status: string;
            updatedAt: Date;
            amount: number;
            type: string;
            claimId: string;
        }[];
        payments: {
            id: string;
            status: string;
            amount: number;
            claimId: string;
            paymentDate: Date;
            payeeId: string;
        }[];
        expertMissions: {
            id: string;
            status: string;
            claimId: string;
            expertId: string;
            reportUrl: string | null;
            scheduledDate: Date;
            completedDate: Date | null;
        }[];
        documents: {
            id: string;
            name: string;
            claimId: string;
            url: string;
            fileType: string;
        }[];
    } & {
        id: string;
        customerId: string;
        status: import(".prisma/client").$Enums.ClaimStatus;
        createdAt: Date;
        updatedAt: Date;
        claimNumber: string;
        eventDate: Date;
        declarationDate: Date;
        description: string;
        fraudScore: number;
        contractId: string;
    }>;
}
