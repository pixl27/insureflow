import { PrismaService } from '@insureflow/database';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    summarizeClaim(claimId: string): Promise<{
        claimId: string;
        summary: string;
        severityLevel: string;
    }>;
    evaluateFraudScore(claimId: string): Promise<{
        claimId: string;
        fraudScore: number;
        riskLevel: string;
    }>;
    extractDocumentInfo(attachmentId: string): Promise<{
        attachmentId: string;
        filename: string;
        extractedData: {
            fullName: string;
            address: string;
            date: string;
            amountTtc: number;
            policyReference: string;
            documentType: string;
        };
        confidenceScore: number;
        ocrProcessedAt: Date;
    }>;
}
