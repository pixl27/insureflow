import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello from INSUREFLOW AI API!';
  }

  // AI Dossier Summary (Module 24: IA - Résumé dossier)
  async summarizeClaim(claimId: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        customer: { include: { contacts: true } },
        contract: { include: { product: true } },
        events: true,
        reserves: true,
        payments: true
      }
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found`);
    }

    const contact = claim.customer.contacts[0];
    const customerName = contact ? `${contact.firstName} ${contact.lastName}` : 'Client Inconnu';
    const activeReserves = claim.reserves.reduce((sum, r) => sum + r.amount, 0);
    const totalPayments = claim.payments.reduce((sum, p) => sum + p.amount, 0);

    const summary = `
    RÉSUMÉ IA DU DOSSIER DE SINISTRE #${claim.claimNumber}
    --------------------------------------------------
    Client : ${customerName} (Type: ${claim.customer.type})
    Contrat : Police ${claim.contract.policyNumber} (Produit: ${claim.contract.product.name})
    Statut Actuel : ${claim.status}
    Date de l'événement : ${claim.eventDate.toLocaleDateString('fr-FR')}
    Date de déclaration : ${claim.declarationDate.toLocaleDateString('fr-FR')}
    
    Description du sinistre :
    "${claim.description}"

    Finances :
    - Indemnisations versées : ${totalPayments} €
    - Provisions actives (Réserves) : ${activeReserves} €
    
    Score de suspicion de fraude IA : ${(claim.fraudScore * 100).toFixed(0)}%
    Derniers événements BPMN/Opérateur :
    ${claim.events.slice(-3).map(e => `- [${e.timestamp.toLocaleDateString('fr-FR')}] ${e.eventType} : ${e.description}`).join('\n')}
    `;

    return {
      claimId,
      summary: summary.trim(),
      severityLevel: activeReserves > 5000 ? 'HIGH' : activeReserves > 1000 ? 'MEDIUM' : 'LOW'
    };
  }

  // AI Fraud Scoring & Behavior Analysis (Module 5: Sinistres - Détection Fraude / Module 24)
  async evaluateFraudScore(claimId: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        contract: true,
        customer: { include: { claims: true } }
      }
    });

    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found`);
    }

    let fraudScore = 0.05; // Base score

    // Rule 1: Declaration timeline (incident happening right after policy starts)
    const diffTime = Math.abs(claim.eventDate.getTime() - claim.contract.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      fraudScore += 0.40; // High suspicion factor
    } else if (diffDays <= 30) {
      fraudScore += 0.15;
    }

    // Rule 2: Behavior keyword check in description
    const descLower = claim.description.toLowerCase();
    const suspiciousKeywords = ['volé', 'fraude', 'perdu', 'accident suspect', 'vol de clés', 'sans effraction'];
    const matchedKeywords = suspiciousKeywords.filter(keyword => descLower.includes(keyword));
    fraudScore += matchedKeywords.length * 0.15;

    // Rule 3: Past claims frequency for the same customer
    const pastClaimsCount = claim.customer.claims.filter(c => c.id !== claimId).length;
    if (pastClaimsCount >= 3) {
      fraudScore += 0.25;
    } else if (pastClaimsCount >= 1) {
      fraudScore += 0.08;
    }

    // Cap score at 0.99
    const finalScore = Math.min(parseFloat(fraudScore.toFixed(2)), 0.99);

    // Persist new fraud score in DB
    await this.prisma.claim.update({
      where: { id: claimId },
      data: { fraudScore: finalScore }
    });

    // Create claim event audit
    await this.prisma.claimEvent.create({
      data: {
        claimId,
        eventType: 'FRAUD_EVALUATED',
        description: `Ré-évaluation automatique du score de suspicion de fraude par l'IA : ${(finalScore * 100).toFixed(0)}%`
      }
    });

    return {
      claimId,
      fraudScore: finalScore,
      riskLevel: finalScore > 0.6 ? 'HIGH' : finalScore > 0.3 ? 'MEDIUM' : 'LOW'
    };
  }

  // OCR Document Extraction (Module 6: GED - OCR / Module 24)
  async extractDocumentInfo(attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId }
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${attachmentId} not found`);
    }

    // Simulate OCR Extraction using attachment file info & regex simulation
    const simulatedText = `
    FACTURE D'ASSURANCE HABITATION
    Nom Client: Sophie Lemoine
    Adresse: 12 Rue de la Paix, 75002 Paris
    Date Facturation: 05/06/2026
    Montant Net HT: 200.00 EUR
    TVA (20%): 40.00 EUR
    Montant TTC: 240.00 EUR
    Reference Contrat: POL-HAB-998
    `;

    return {
      attachmentId,
      filename: attachment.name,
      extractedData: {
        fullName: 'Sophie Lemoine',
        address: '12 Rue de la Paix, 75002 Paris',
        date: '05/06/2026',
        amountTtc: 240.00,
        policyReference: 'POL-HAB-998',
        documentType: 'INVOICE'
      },
      confidenceScore: 0.95,
      ocrProcessedAt: new Date()
    };
  }
}
