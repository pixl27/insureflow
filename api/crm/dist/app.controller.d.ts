import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<string>;
    searchCustomers(q: string): Promise<({
        contacts: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string | null;
            customerId: string;
        }[];
        addresses: {
            id: string;
            street: string;
            city: string;
            postalCode: string;
            country: string;
            isBilling: boolean;
            isPrimary: boolean;
            customerId: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getSegments(): Promise<{
        VIP: any[];
        RisqueEleve: any[];
        Sain: any[];
        MultiProduits: any[];
        Standard: any[];
    }>;
    mergeCustomers(primaryId: string, duplicateId: string): Promise<{
        success: boolean;
        primaryId: string;
    }>;
    getAllCustomers(): Promise<({
        contacts: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string | null;
            customerId: string;
        }[];
        addresses: {
            id: string;
            street: string;
            city: string;
            postalCode: string;
            country: string;
            isBilling: boolean;
            isPrimary: boolean;
            customerId: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCustomerById(id: string): Promise<({
        contacts: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string | null;
            customerId: string;
        }[];
        addresses: {
            id: string;
            street: string;
            city: string;
            postalCode: string;
            country: string;
            isBilling: boolean;
            isPrimary: boolean;
            customerId: string;
        }[];
        notes: {
            id: string;
            createdAt: Date;
            customerId: string;
            content: string;
            authorId: string;
        }[];
        tasks: {
            id: string;
            customerId: string;
            title: string;
            description: string | null;
            status: string;
            dueDate: Date;
            assigneeId: string;
        }[];
        interactions: {
            id: string;
            type: string;
            customerId: string;
            details: string;
            date: Date;
        }[];
        attachments: {
            id: string;
            createdAt: Date;
            name: string;
            customerId: string;
            url: string;
            fileType: string;
            size: number;
            hash: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    getCustomerTimeline(id: string): Promise<{
        customerId: string;
        timeline: {
            id: string;
            type: string;
            label: string;
            date: Date;
        }[];
    }>;
    createNote(id: string, body: {
        content: string;
        authorId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        content: string;
        authorId: string;
    }>;
    createTask(id: string, body: {
        title: string;
        description?: string;
        dueDate?: string;
        assigneeId?: string;
    }): Promise<{
        id: string;
        customerId: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date;
        assigneeId: string;
    }>;
    updateTask(taskId: string, body: {
        status?: string;
        title?: string;
        description?: string;
        dueDate?: string;
        assigneeId?: string;
    }): Promise<{
        id: string;
        customerId: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date;
        assigneeId: string;
    }>;
    createInteraction(id: string, body: {
        type: string;
        details: string;
    }): Promise<{
        id: string;
        type: string;
        customerId: string;
        details: string;
        date: Date;
    }>;
    createCustomer(body: {
        type: 'INDIVIDUAL' | 'COMPANY' | 'ASSOCIATION';
        score?: number;
    }): Promise<{
        contacts: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string | null;
            customerId: string;
        }[];
        addresses: {
            id: string;
            street: string;
            city: string;
            postalCode: string;
            country: string;
            isBilling: boolean;
            isPrimary: boolean;
            customerId: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateCustomer(id: string, body: {
        kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
        score?: number;
    }): Promise<({
        contacts: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: string | null;
            customerId: string;
        }[];
        addresses: {
            id: string;
            street: string;
            city: string;
            postalCode: string;
            country: string;
            isBilling: boolean;
            isPrimary: boolean;
            customerId: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    deleteCustomer(id: string): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.CustomerType;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
