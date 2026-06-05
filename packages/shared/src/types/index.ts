// Shared Types and Business Events for InsureFlow

// CRM types
export type CustomerType = 'INDIVIDUAL' | 'COMPANY' | 'ASSOCIATION';
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CustomerDTO {
  id: string;
  type: CustomerType;
  kycStatus: KycStatus;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export type ProductType = 
  | 'AUTO' 
  | 'MOTO' 
  | 'HABITATION' 
  | 'SANTE' 
  | 'PREVOYANCE' 
  | 'RC_PRO' 
  | 'MRP' 
  | 'AFFINITAIRE' 
  | 'ANIMAUX';

// Contract types
export type ContractStatus = 
  | 'DRAFT' 
  | 'PENDING_VALIDATION' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'TERMINATED';

export interface ContractDTO {
  id: string;
  customerId: string;
  productId: string;
  brokerId: string;
  policyNumber: string;
  status: ContractStatus;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Claim types
export type ClaimStatus = 
  | 'DECLARED' 
  | 'QUALIFIED' 
  | 'ASSIGNED' 
  | 'INSPECTED' 
  | 'VALIDATED' 
  | 'PAID' 
  | 'CLOSED';

export interface ClaimDTO {
  id: string;
  contractId: string;
  customerId: string;
  claimNumber: string;
  eventDate: Date;
  declarationDate: Date;
  status: ClaimStatus;
  description: string;
  fraudScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Billing & Accounting types
export type InvoiceStatus = 
  | 'DRAFT' 
  | 'ISSUED' 
  | 'PAID' 
  | 'OVERDUE' 
  | 'CANCELLED';

// Business Events (Event Sourcing / Messaging)
export interface BusinessEvent<T = any> {
  id: string;
  type: string;
  aggregateId: string;
  timestamp: Date;
  version: number;
  data: T;
  meta?: Record<string, any>;
}

// Event Data payloads
export interface ContractCreatedEvent {
  contractId: string;
  policyNumber: string;
  customerId: string;
  productId: string;
  startDate: Date;
}

export interface ClaimOpenedEvent {
  claimId: string;
  claimNumber: string;
  contractId: string;
  customerId: string;
  eventDate: Date;
}

export interface PaymentReceivedEvent {
  paymentId: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  processedAt: Date;
}

export interface CommissionCalculatedEvent {
  commissionId: string;
  contractId: string;
  brokerId: string;
  amount: number;
}
