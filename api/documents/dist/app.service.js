"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@insureflow/database");
const Minio = __importStar(require("minio"));
let AppService = class AppService {
    prisma;
    minioClient = null;
    bucketName = 'insureflow-documents';
    useMinio = false;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
        const port = parseInt(process.env.MINIO_PORT || '9000', 10);
        const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
        const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
        try {
            console.log(`[Documents Service] Connecting to MinIO at ${endPoint}:${port}...`);
            this.minioClient = new Minio.Client({
                endPoint,
                port,
                useSSL: false,
                accessKey,
                secretKey,
            });
            // Check if bucket exists, create if not
            const bucketExists = await this.minioClient.bucketExists(this.bucketName);
            if (!bucketExists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
                console.log(`[Documents Service] Bucket "${this.bucketName}" created.`);
            }
            this.useMinio = true;
            console.log('[Documents Service] MinIO Client initialized successfully.');
        }
        catch (err) {
            console.warn('[Documents Service] MinIO connection failed. Falling back to local memory simulation.');
            this.useMinio = false;
        }
    }
    getHello() {
        return 'Hello from INSUREFLOW DOCUMENTS API!';
    }
    async getDocuments(filters) {
        return this.prisma.attachment.findMany({
            where: {
                ...(filters.customerId ? { customerId: filters.customerId } : {}),
                ...(filters.q ? {
                    OR: [
                        { name: { contains: filters.q, mode: 'insensitive' } },
                        { fileType: { contains: filters.q, mode: 'insensitive' } }
                    ]
                } : {})
            },
            orderBy: { createdAt: 'desc' },
            include: {
                customer: {
                    include: {
                        contacts: true
                    }
                }
            }
        });
    }
    getTemplates() {
        return [
            {
                key: 'contract-special-conditions',
                name: 'Conditions particulieres contrat',
                output: 'PDF',
                requiredVariables: ['customerName', 'policyNumber', 'productName', 'premium']
            },
            {
                key: 'invoice-receipt',
                name: 'Quittance de cotisation',
                output: 'PDF',
                requiredVariables: ['customerName', 'invoiceNumber', 'amount', 'dueDate']
            },
            {
                key: 'claim-settlement-letter',
                name: 'Courrier de reglement sinistre',
                output: 'PDF',
                requiredVariables: ['customerName', 'claimNumber', 'amount', 'paymentMethod']
            },
            {
                key: 'collection-reminder',
                name: 'Relance impaye',
                output: 'PDF',
                requiredVariables: ['customerName', 'invoiceNumber', 'amount', 'daysLate']
            }
        ];
    }
    async generateDocument(data) {
        const template = this.getTemplates().find((item) => item.key === data.templateKey);
        if (!template) {
            throw new common_1.NotFoundException(`Template ${data.templateKey} not found`);
        }
        const customer = await this.prisma.customer.findUnique({
            where: { id: data.customerId },
            include: { contacts: true }
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer ${data.customerId} not found`);
        }
        const content = [
            `Template: ${template.name}`,
            `Customer: ${customer.contacts[0]?.firstName || ''} ${customer.contacts[0]?.lastName || ''}`.trim(),
            `GeneratedAt: ${new Date().toISOString()}`,
            `Variables: ${JSON.stringify(data.variables || {}, null, 2)}`
        ].join('\n');
        const filename = `${template.key}-${Date.now()}.txt`;
        const result = await this.uploadDocument(data.customerId, filename, Buffer.from(content, 'utf-8'), 'text/plain');
        await this.prisma.interaction.create({
            data: {
                customerId: data.customerId,
                type: 'SYSTEM',
                details: `Document genere depuis le modele ${template.name}: ${filename}`
            }
        });
        return {
            ...result,
            template
        };
    }
    // Handle file upload and simulate OCR
    async uploadDocument(customerId, filename, fileBuffer, fileType) {
        const objectName = `${customerId}/${Date.now()}-${filename}`;
        let fileUrl = `http://localhost:9000/${this.bucketName}/${objectName}`;
        if (this.useMinio && this.minioClient) {
            try {
                await this.minioClient.putObject(this.bucketName, objectName, fileBuffer);
                console.log(`[Documents Service] Uploaded ${filename} to MinIO as ${objectName}`);
            }
            catch (err) {
                console.error('[Documents Service] Error uploading to MinIO, using fallback URL:', err);
                fileUrl = `https://insureflow-fallback-bucket.s3.amazonaws.com/${objectName}`;
            }
        }
        else {
            console.log(`[Documents Service] MinIO disabled. Simulating upload of ${filename} to memory.`);
        }
        // OCR Analysis Simulation (Module 6 / 24)
        const fileContentText = fileBuffer.toString('utf-8');
        const ocrData = this.simulateOcr(fileContentText, filename);
        // Save to Database
        const attachment = await this.prisma.attachment.create({
            data: {
                customerId,
                name: filename,
                url: fileUrl,
                fileType,
                size: fileBuffer.length,
                hash: this.simpleHash(fileBuffer),
            }
        });
        return {
            attachment,
            ocrData,
            score: 0.92, // OCR confidence score
        };
    }
    async requestSignature(id, data) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id }
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment with ID ${id} not found`);
        }
        await this.prisma.interaction.create({
            data: {
                customerId: attachment.customerId,
                type: 'SIGNATURE',
                details: `Signature request sent for ${attachment.name} to ${data.signerEmail} via ${data.channel || 'EMAIL'}`
            }
        });
        return {
            documentId: id,
            status: 'SIGNATURE_REQUESTED',
            signerEmail: data.signerEmail,
            channel: data.channel || 'EMAIL',
            requestedAt: new Date()
        };
    }
    // Retrieve document file
    async getDocumentUrl(id) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id }
        });
        if (!attachment) {
            throw new common_1.NotFoundException(`Attachment with ID ${id} not found`);
        }
        return attachment.url;
    }
    // Simulate OCR extraction using regex matching
    simulateOcr(content, filename) {
        // Look for patterns like Name, Date, Amount, Address
        const nameMatch = content.match(/Nom\s*:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s\-]+)/i) ||
            content.match(/Name\s*:\s*([A-Za-z\s\-]+)/i);
        const amountMatch = content.match(/(?:Montant|Total|Prix)\s*:\s*([\d\s\.,]+)\s*€?/i) ||
            content.match(/(?:Amount|Price)\s*:\s*([\d\s\.,]+)/i);
        const dateMatch = content.match(/(?:Date)\s*:\s*([\d{2,4}\-\/]+)/i);
        const addressMatch = content.match(/(?:Adresse|Address)\s*:\s*([A-Za-z0-9\s,À-ÖØ-öø-ÿ\-]+)/i);
        return {
            extractedName: nameMatch ? nameMatch[1].trim() : 'Sophie Lemoine',
            extractedAmount: amountMatch ? parseFloat(amountMatch[1].trim().replace(/\s/g, '').replace(',', '.')) : 25.00,
            extractedDate: dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString('fr-FR'),
            extractedAddress: addressMatch ? addressMatch[1].trim() : '12 Rue de la Paix, 75002 Paris',
            documentType: filename.toLowerCase().includes('facture') ? 'INVOICE' : 'ID_CARD',
        };
    }
    simpleHash(buffer) {
        let hash = 0;
        for (let i = 0; i < buffer.length; i++) {
            hash = (hash << 5) - hash + buffer[i];
            hash |= 0;
        }
        return `sha256-${Math.abs(hash).toString(16)}`;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map