import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
    declareClaim(body: {
        contractId: string;
        customerId: string;
        claimNumber: string;
        eventDate: string;
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
    adjustReserve(id: string, body: {
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
    payClaim(id: string, body: {
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
    assignExpert(id: string, body: {
        expertId: string;
        scheduledDate: string;
    }): Promise<{
        id: string;
        status: string;
        claimId: string;
        expertId: string;
        reportUrl: string | null;
        scheduledDate: Date;
        completedDate: Date | null;
    }>;
    qualifyClaim(id: string, body: {
        qualification: string;
        managerId?: string;
    }): Promise<{
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
    validateClaim(id: string, body: {
        decision: string;
        managerId?: string;
    }): Promise<{
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
    closeClaim(id: string, body: {
        reason: string;
    }): Promise<{
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
