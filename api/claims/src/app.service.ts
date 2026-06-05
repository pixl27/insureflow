import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';
import { eventBus } from '@insureflow/events';
import * as fs from 'fs';
import * as path from 'path';
import { BpmnEngine, BpmnWorkflow } from '@insureflow/shared';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedClaims();
  }

  async seedClaims() {
    const count = await this.prisma.claim.count();
    if (count === 0) {
      console.log('[Claims Service] Seeding default claims...');
      
      // We check if Customer '1' and Contract 'c1' exist
      const contractExists = await this.prisma.contract.findUnique({
        where: { id: 'c1' }
      });
      if (!contractExists) {
        console.log('[Claims Service] Contract c1 not found. Postponing claims seeding.');
        return;
      }

      // Seed claim 1: S-7721
      await this.prisma.claim.create({
        data: {
          id: 's1',
          contractId: 'c1',
          customerId: '1',
          claimNumber: 'S-7721',
          eventDate: new Date('2026-04-12'),
          status: 'VALIDATED',
          description: 'Accident parking (portière enfoncée)',
          fraudScore: 0.1,
          reserves: {
            create: {
              amount: 500,
              type: 'DAMAGE',
              status: 'ACTIVE'
            }
          }
        }
      });

      // Seed claim 2: S-8910
      await this.prisma.claim.create({
        data: {
          id: 's2',
          contractId: 'c2',
          customerId: '1',
          claimNumber: 'S-8910',
          eventDate: new Date('2026-06-02'),
          status: 'DECLARED',
          description: 'Dégât des eaux (salle de bain)',
          fraudScore: 0.2
        }
      });

      console.log('[Claims Service] Claims seeded successfully.');
    }
  }

  async getHello(): Promise<string> {
    return 'Hello from INSUREFLOW CLAIMS API!';
  }

  // Get all claims
  async getAllClaims() {
    return this.prisma.claim.findMany({
      include: {
        contract: true,
        customer: true
      }
    });
  }

  // Get claim by ID with detailed events, reserves and payments
  async getClaimById(id: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        contract: true,
        customer: true,
        events: true,
        reserves: true,
        payments: true,
        expertMissions: true,
        documents: true
      }
    });
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return claim;
  }

  // Run claims process workflow (Module 7)
  async runClaimsWorkflow(claimId: string, context: Record<string, any>) {
    try {
      const flowPath = path.join(process.cwd(), '../../workflows/claims/claims_flow.json');
      if (fs.existsSync(flowPath)) {
        const flowData = JSON.parse(fs.readFileSync(flowPath, 'utf8')) as BpmnWorkflow;
        const engine = new BpmnEngine();
        const result = engine.run(flowData, context);
        
        console.log(`[Claims Service] BPMN Workflow trace for Claim ${claimId}:`, result.trace);
        
        // Log all steps trace in the claim events
        for (const traceLog of result.trace) {
          await this.prisma.claimEvent.create({
            data: {
              claimId,
              eventType: 'BPMN_TRACE',
              description: traceLog
            }
          });
        }

        // If completed or paused at specific step, update claim status accordingly
        if (result.currentStepId) {
          const stepStatusMap: Record<string, any> = {
            'qualification': 'QUALIFIED',
            'fraud_investigation': 'ASSIGNED',
            'expert_mission': 'INSPECTED',
            'manager_approval': 'VALIDATED',
            'direct_payout': 'PAID'
          };
          const nextStatus = stepStatusMap[result.currentStepId];
          if (nextStatus) {
            await this.prisma.claim.update({
              where: { id: claimId },
              data: { status: nextStatus }
            });
          }
        }
      }
    } catch (err) {
      console.error('[Claims Service] Error running BPMN workflow:', err);
    }
  }

  // Declare a claim (Module 5)
  async declareClaim(data: {
    contractId: string;
    customerId: string;
    claimNumber: string;
    eventDate: Date;
    description: string;
  }) {
    // Basic AI fraud score simulation: if description mentions certain keywords, increase score (Module 24)
    let fraudScore = 0.1;
    const lowerDesc = data.description.toLowerCase();
    if (lowerDesc.includes('fraude') || lowerDesc.includes('volé') && lowerDesc.includes('clé')) {
      fraudScore = 0.75; // Suspect
    }

    const claim = await this.prisma.claim.create({
      data: {
        contractId: data.contractId,
        customerId: data.customerId,
        claimNumber: data.claimNumber,
        eventDate: data.eventDate,
        description: data.description,
        status: 'DECLARED',
        fraudScore
      }
    });

    // Create claim event
    await this.prisma.claimEvent.create({
      data: {
        claimId: claim.id,
        eventType: 'DECLARED',
        description: `Sinistre déclaré par le client. Score IA suspicion fraude : ${fraudScore}`
      }
    });

    // Publish ClaimOpenedEvent to EventBus
    eventBus.publish({
      id: `evt-${claim.id}`,
      type: 'ClaimOpened',
      aggregateId: claim.id,
      timestamp: new Date(),
      version: 1,
      data: {
        claimId: claim.id,
        claimNumber: claim.claimNumber,
        contractId: claim.contractId,
        customerId: claim.customerId,
        eventDate: claim.eventDate
      }
    });

    // Run the BPMN workflow in background
    this.runClaimsWorkflow(claim.id, {
      claimAmount: 600, // Dummy claim amount
      fraudScore: fraudScore
    });

    return claim;
  }

  // Adjust Claim Reserves (Module 5/8)
  async adjustReserve(claimId: string, data: { amount: number; type: 'DAMAGE' | 'FEES' | 'RECOVERY' }) {
    const reserve = await this.prisma.claimReserve.create({
      data: {
        claimId,
        amount: data.amount,
        type: data.type,
        status: 'ACTIVE'
      }
    });

    await this.prisma.claimEvent.create({
      data: {
        claimId,
        eventType: 'RESERVE_ADJUSTED',
        description: `Provisionnement de type ${data.type} d'un montant de ${data.amount} €`
      }
    });

    return reserve;
  }

  // Register payout transaction
  async payClaim(claimId: string, data: { amount: number; payeeId: string }) {
    const payment = await this.prisma.claimPayment.create({
      data: {
        claimId,
        amount: data.amount,
        paymentDate: new Date(),
        payeeId: data.payeeId,
        status: 'PROCESSED'
      }
    });

    await this.prisma.claimEvent.create({
      data: {
        claimId,
        eventType: 'PAYMENT_ISSUED',
        description: `Règlement émis à l'ordre de ${data.payeeId} pour un montant de ${data.amount} €`
      }
    });

    // Update claim status if necessary
    await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: 'PAID' }
    });

    return payment;
  }

  // Assign Expert Mission
  async assignExpert(claimId: string, data: { expertId: string; scheduledDate: Date }) {
    const mission = await this.prisma.expertMission.create({
      data: {
        claimId,
        expertId: data.expertId,
        status: 'ASSIGNED',
        scheduledDate: data.scheduledDate
      }
    });

    await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: 'ASSIGNED' }
    });

    await this.prisma.claimEvent.create({
      data: {
        claimId,
        eventType: 'EXPERT_ASSIGNED',
        description: `Mission d'expertise confiée à l'expert ${data.expertId} le ${data.scheduledDate}`
      }
    });

    return mission;
  }

  async transitionClaim(
    claimId: string,
    status: 'DECLARED' | 'QUALIFIED' | 'ASSIGNED' | 'INSPECTED' | 'VALIDATED' | 'PAID' | 'CLOSED',
    eventType: string,
    description: string
  ) {
    const claim = await this.prisma.claim.update({
      where: { id: claimId },
      data: { status },
      include: {
        events: true,
        reserves: true,
        payments: true,
        expertMissions: true,
        documents: true,
        contract: true,
        customer: true
      }
    });

    await this.prisma.claimEvent.create({
      data: {
        claimId,
        eventType,
        description
      }
    });

    eventBus.publish({
      id: `evt-claim-${claimId}-${Date.now()}`,
      type: `Claim${eventType}`,
      aggregateId: claimId,
      timestamp: new Date(),
      version: claim.events.length + 1,
      data: {
        claimId,
        claimNumber: claim.claimNumber,
        status,
        description
      }
    });

    return this.getClaimById(claimId);
  }
}
