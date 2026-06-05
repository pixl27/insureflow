import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';
export declare class AppService implements OnModuleInit {
    private readonly prisma;
    private minioClient;
    private bucketName;
    private useMinio;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getHello(): string;
    getDocuments(filters: {
        customerId?: string;
        q?: string;
    }): Promise<({
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
            type: import(".prisma/client").$Enums.CustomerType;
            kycStatus: import(".prisma/client").$Enums.KycStatus;
            score: number;
            updatedAt: Date;
        };
    } & {
        id: string;
        customerId: string;
        name: string;
        url: string;
        fileType: string;
        size: number;
        hash: string;
        createdAt: Date;
    })[]>;
    getTemplates(): {
        key: string;
        name: string;
        output: string;
        requiredVariables: string[];
    }[];
    generateDocument(data: {
        customerId: string;
        templateKey: string;
        variables?: Record<string, string | number>;
    }): Promise<{
        template: {
            key: string;
            name: string;
            output: string;
            requiredVariables: string[];
        };
        attachment: {
            id: string;
            customerId: string;
            name: string;
            url: string;
            fileType: string;
            size: number;
            hash: string;
            createdAt: Date;
        };
        ocrData: {
            extractedName: string;
            extractedAmount: number;
            extractedDate: string;
            extractedAddress: string;
            documentType: string;
        };
        score: number;
    }>;
    uploadDocument(customerId: string, filename: string, fileBuffer: Buffer, fileType: string): Promise<{
        attachment: {
            id: string;
            customerId: string;
            name: string;
            url: string;
            fileType: string;
            size: number;
            hash: string;
            createdAt: Date;
        };
        ocrData: {
            extractedName: string;
            extractedAmount: number;
            extractedDate: string;
            extractedAddress: string;
            documentType: string;
        };
        score: number;
    }>;
    requestSignature(id: string, data: {
        signerEmail: string;
        channel?: 'EMAIL' | 'SMS' | 'PORTAL';
    }): Promise<{
        documentId: string;
        status: string;
        signerEmail: string;
        channel: "EMAIL" | "SMS" | "PORTAL";
        requestedAt: Date;
    }>;
    getDocumentUrl(id: string): Promise<string>;
    private simulateOcr;
    private simpleHash;
}
