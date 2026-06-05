import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';
export declare class AppService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedProducts(): Promise<void>;
    seedContracts(): Promise<void>;
    getHello(): Promise<string>;
    getProducts(): Promise<({
        versions: {
            id: string;
            status: string;
            productId: string;
            ruleJson: string;
            versionNumber: string;
            activeFrom: Date;
            activeTo: Date | null;
        }[];
        coverages: {
            id: string;
            name: string;
            productId: string;
            code: string;
            description: string | null;
        }[];
        exclusions: {
            id: string;
            productId: string;
            description: string;
        }[];
        deductibles: {
            id: string;
            productId: string;
            description: string;
            amount: number;
        }[];
        pricingRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        commissionRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        taxRules: {
            id: string;
            type: string;
            productId: string;
            rate: number;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        code: string;
    })[]>;
    getProductById(id: string): Promise<{
        versions: {
            id: string;
            status: string;
            productId: string;
            ruleJson: string;
            versionNumber: string;
            activeFrom: Date;
            activeTo: Date | null;
        }[];
        coverages: {
            id: string;
            name: string;
            productId: string;
            code: string;
            description: string | null;
        }[];
        exclusions: {
            id: string;
            productId: string;
            description: string;
        }[];
        deductibles: {
            id: string;
            productId: string;
            description: string;
            amount: number;
        }[];
        pricingRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        commissionRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        taxRules: {
            id: string;
            type: string;
            productId: string;
            rate: number;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        code: string;
    }>;
    createProduct(data: {
        name: string;
        code: string;
        type: any;
        status?: string;
        coverages?: Array<{
            name: string;
            code: string;
            description?: string;
        }>;
        pricingRuleJson?: string;
    }): Promise<{
        versions: {
            id: string;
            status: string;
            productId: string;
            ruleJson: string;
            versionNumber: string;
            activeFrom: Date;
            activeTo: Date | null;
        }[];
        coverages: {
            id: string;
            name: string;
            productId: string;
            code: string;
            description: string | null;
        }[];
        pricingRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        code: string;
    }>;
    updateProduct(id: string, data: {
        name?: string;
        code?: string;
        type?: any;
        status?: string;
    }): Promise<{
        versions: {
            id: string;
            status: string;
            productId: string;
            ruleJson: string;
            versionNumber: string;
            activeFrom: Date;
            activeTo: Date | null;
        }[];
        coverages: {
            id: string;
            name: string;
            productId: string;
            code: string;
            description: string | null;
        }[];
        pricingRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        code: string;
    }>;
    addCoverage(productId: string, data: {
        name: string;
        code: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        productId: string;
        code: string;
        description: string | null;
    }>;
    addPricingRule(productId: string, ruleJson: string): Promise<{
        id: string;
        productId: string;
        ruleJson: string;
    }>;
    changeProductStatus(id: string, status: string): Promise<{
        versions: {
            id: string;
            status: string;
            productId: string;
            ruleJson: string;
            versionNumber: string;
            activeFrom: Date;
            activeTo: Date | null;
        }[];
        coverages: {
            id: string;
            name: string;
            productId: string;
            code: string;
            description: string | null;
        }[];
        exclusions: {
            id: string;
            productId: string;
            description: string;
        }[];
        deductibles: {
            id: string;
            productId: string;
            description: string;
            amount: number;
        }[];
        pricingRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        commissionRules: {
            id: string;
            productId: string;
            ruleJson: string;
        }[];
        taxRules: {
            id: string;
            type: string;
            productId: string;
            rate: number;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.ProductType;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        status: string;
        code: string;
    }>;
    getAllContracts(): Promise<({
        customer: {
            id: string;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
            createdAt: Date;
            updatedAt: Date;
        };
        product: {
            id: string;
            type: import(".prisma/client").$Enums.ProductType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brokerId: string;
        policyNumber: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        productId: string;
    })[]>;
    getContractById(id: string): Promise<{
        customer: {
            id: string;
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
            createdAt: Date;
            updatedAt: Date;
        };
        product: {
            id: string;
            type: import(".prisma/client").$Enums.ProductType;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: string;
            code: string;
        };
        versions: {
            id: string;
            createdAt: Date;
            versionNumber: number;
            contractId: string;
            changeReason: string;
            dataJson: string;
        }[];
        events: {
            id: string;
            description: string;
            eventType: string;
            timestamp: Date;
            contractId: string;
        }[];
        beneficiaries: {
            id: string;
            name: string;
            contractId: string;
            relationship: string;
            sharePercentage: number;
        }[];
        guarantees: {
            id: string;
            status: string;
            contractId: string;
            deductible: number;
            coverageId: string;
            limit: number;
        }[];
        premiums: {
            id: string;
            contractId: string;
            netAmount: number;
            taxAmount: number;
            commissionAmount: number;
            grossAmount: number;
            dueDate: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brokerId: string;
        policyNumber: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        productId: string;
    }>;
    getWorkflowCatalog(): Promise<{
        key: string;
        name: string;
        available: boolean;
        stepsCount: any;
        definition: any;
    }[]>;
    runWorkflowByKey(key: string, context: Record<string, any>, aggregateId?: string): Promise<{
        key: string;
        aggregateId: string | undefined;
        trace: string[];
        currentStepId: string | null;
        context: Record<string, any>;
    }>;
    runContractsWorkflow(contractId: string, context: Record<string, any>): Promise<void>;
    calculateQuote(data: {
        productId: string;
        customerId: string;
        age: number;
        city: string;
    }): Promise<{
        productId: string;
        customerId: string;
        basePremium: number;
        monthlyPremium: number;
        commission: number;
        score: number;
        status: string;
    }>;
    emitPolicy(data: {
        customerId: string;
        productId: string;
        brokerId: string;
        policyNumber: string;
        monthlyPremium: number;
        startDate: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brokerId: string;
        policyNumber: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        productId: string;
    }>;
    suspendPolicy(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brokerId: string;
        policyNumber: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        productId: string;
    }>;
    terminatePolicy(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        brokerId: string;
        policyNumber: string;
        status: import(".prisma/client").$Enums.ContractStatus;
        startDate: Date;
        endDate: Date | null;
        customerId: string;
        productId: string;
    }>;
}
