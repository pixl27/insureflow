import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@insureflow/database';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedCustomers();
  }

  async seedCustomers() {
    const count = await this.prisma.customer.count();
    if (count === 0) {
      console.log('[CRM Service] Seeding default customers...');
      
      // Customer 1: Jean Dupont
      await this.prisma.customer.create({
        data: {
          id: '1',
          type: 'INDIVIDUAL',
          kycStatus: 'APPROVED',
          score: 1.2,
          contacts: {
            create: {
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@gmail.com',
              phone: '06 12 34 56 78',
              role: 'Owner'
            }
          },
          addresses: {
            create: {
              street: '12 Rue de la Paix',
              city: 'Paris',
              postalCode: '75002',
              country: 'France',
              isBilling: true,
              isPrimary: true
            }
          }
        }
      });

      // Customer 2: Acme Corporation
      await this.prisma.customer.create({
        data: {
          id: '2',
          type: 'COMPANY',
          kycStatus: 'APPROVED',
          score: 2.5,
          contacts: {
            create: {
              firstName: 'Marc',
              lastName: 'Aurele',
              email: 'contact@acme.com',
              phone: '01 45 67 89 00',
              role: 'Director'
            }
          },
          addresses: {
            create: {
              street: '45 Avenue des Champs-Élysées',
              city: 'Lyon',
              postalCode: '69002',
              country: 'France',
              isBilling: true,
              isPrimary: true
            }
          }
        }
      });

      // Customer 3: Association Sportive Bel-Air
      await this.prisma.customer.create({
        data: {
          id: '3',
          type: 'ASSOCIATION',
          kycStatus: 'PENDING',
          score: 0.9,
          contacts: {
            create: {
              firstName: 'Pierre',
              lastName: 'Dubois',
              email: 'contact@sport-belair.fr',
              phone: '04 91 22 33 44',
              role: 'President'
            }
          },
          addresses: {
            create: {
              street: '18 Rue du Stade',
              city: 'Marseille',
              postalCode: '13008',
              country: 'France',
              isBilling: true,
              isPrimary: true
            }
          }
        }
      });

      // Customer 4: Marie Curie
      await this.prisma.customer.create({
        data: {
          id: '4',
          type: 'INDIVIDUAL',
          kycStatus: 'APPROVED',
          score: 1.5,
          contacts: {
            create: {
              firstName: 'Marie',
              lastName: 'Curie',
              email: 'marie.curie@yahoo.fr',
              phone: '06 88 99 00 11',
              role: 'Owner'
            }
          },
          addresses: {
            create: {
              street: '2 Avenue des Sciences',
              city: 'Paris',
              postalCode: '75005',
              country: 'France',
              isBilling: true,
              isPrimary: true
            }
          }
        }
      });

      // Customer 5: Tech Solutions SAS
      await this.prisma.customer.create({
        data: {
          id: '5',
          type: 'COMPANY',
          kycStatus: 'REJECTED',
          score: 0.5,
          contacts: {
            create: {
              firstName: 'Sarah',
              lastName: 'Connor',
              email: 'admin@techsolutions.io',
              phone: '09 70 80 90 10',
              role: 'CTO'
            }
          },
          addresses: {
            create: {
              street: '8 Rue de la Technologie',
              city: 'Nantes',
              postalCode: '44000',
              country: 'France',
              isBilling: true,
              isPrimary: true
            }
          }
        }
      });

      console.log('[CRM Service] Customers seeded successfully.');
    }
  }

  async getHello(): Promise<string> {
    return 'Hello from INSUREFLOW CRM API!';
  }

  async getAllCustomers() {
    return this.prisma.customer.findMany({
      include: {
        contacts: true,
        addresses: true
      }
    });
  }

  async getCustomerById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: true,
        addresses: true,
        notes: true,
        tasks: true,
        interactions: true,
        attachments: true
      }
    });
  }

  async getCustomerTimeline(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        notes: true,
        tasks: true,
        interactions: true,
        attachments: true,
        contracts: { include: { events: true, product: true } },
        claims: { include: { events: true } },
        invoices: true,
        payments: true
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const timeline = [
      ...customer.notes.map((note) => ({
        id: note.id,
        type: 'NOTE',
        label: note.content,
        date: note.createdAt
      })),
      ...customer.tasks.map((task) => ({
        id: task.id,
        type: 'TASK',
        label: `${task.title} (${task.status})`,
        date: task.dueDate
      })),
      ...customer.interactions.map((interaction) => ({
        id: interaction.id,
        type: interaction.type,
        label: interaction.details,
        date: interaction.date
      })),
      ...customer.attachments.map((attachment) => ({
        id: attachment.id,
        type: 'DOCUMENT',
        label: attachment.name,
        date: attachment.createdAt
      })),
      ...customer.contracts.flatMap((contract) => contract.events.map((event) => ({
        id: event.id,
        type: `CONTRACT_${event.eventType}`,
        label: `${contract.policyNumber} - ${event.description}`,
        date: event.timestamp
      }))),
      ...customer.claims.flatMap((claim) => claim.events.map((event) => ({
        id: event.id,
        type: `CLAIM_${event.eventType}`,
        label: `${claim.claimNumber} - ${event.description}`,
        date: event.timestamp
      }))),
      ...customer.invoices.map((invoice) => ({
        id: invoice.id,
        type: 'INVOICE',
        label: `${invoice.invoiceNumber} - ${invoice.status}`,
        date: invoice.createdAt
      })),
      ...customer.payments.map((payment) => ({
        id: payment.id,
        type: 'PAYMENT',
        label: `${payment.reference} - ${payment.amount} EUR`,
        date: payment.createdAt
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      customerId: id,
      timeline
    };
  }

  async createNote(customerId: string, data: { content: string; authorId?: string }) {
    await this.ensureCustomerExists(customerId);
    const note = await this.prisma.note.create({
      data: {
        customerId,
        content: data.content,
        authorId: data.authorId || 'system'
      }
    });
    await this.createInteraction(customerId, {
      type: 'SYSTEM',
      details: `Note ajoutee: ${data.content.slice(0, 120)}`
    });
    return note;
  }

  async createTask(customerId: string, data: { title: string; description?: string; dueDate?: string; assigneeId?: string }) {
    await this.ensureCustomerExists(customerId);
    return this.prisma.task.create({
      data: {
        customerId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assigneeId: data.assigneeId || 'backoffice'
      }
    });
  }

  async updateTask(
    taskId: string,
    data: { status?: string; title?: string; description?: string; dueDate?: string; assigneeId?: string }
  ) {
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
        ...(data.assigneeId ? { assigneeId: data.assigneeId } : {})
      }
    });

    await this.createInteraction(task.customerId, {
      type: 'SYSTEM',
      details: `Tache ${task.title} mise a jour: ${task.status}`
    });

    return task;
  }

  async createInteraction(customerId: string, data: { type: string; details: string }) {
    await this.ensureCustomerExists(customerId);
    return this.prisma.interaction.create({
      data: {
        customerId,
        type: data.type,
        details: data.details
      }
    });
  }

  private async ensureCustomerExists(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async createCustomer(data: {
    type: 'INDIVIDUAL' | 'COMPANY' | 'ASSOCIATION';
    score?: number;
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
  }) {
    let firstName = '';
    let lastName = data.name || '';
    if (data.name && data.name.includes(' ')) {
      const parts = data.name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    return this.prisma.customer.create({
      data: {
        type: data.type,
        score: data.score ?? 1.0,
        kycStatus: 'PENDING',
        contacts: data.email ? {
          create: {
            firstName,
            lastName,
            email: data.email,
            phone: data.phone || '06 00 00 00 00',
            role: 'Owner'
          }
        } : undefined,
        addresses: data.city ? {
          create: {
            street: 'Rue Principale',
            city: data.city,
            postalCode: '75000',
            country: 'France',
            isBilling: true,
            isPrimary: true
          }
        } : undefined
      },
      include: {
        contacts: true,
        addresses: true
      }
    });
  }

  async updateCustomer(
    id: string,
    data: {
      kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
      score?: number;
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      street?: string;
      postalCode?: string;
      country?: string;
    }
  ) {
    const { kycStatus, score, name, email, phone, city, street, postalCode, country } = data;
    const customerUpdate: any = {};
    if (kycStatus) customerUpdate.kycStatus = kycStatus;
    if (score !== undefined) customerUpdate.score = score;

    let firstName = '';
    let lastName = name || '';
    if (name && name.includes(' ')) {
      const parts = name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    return this.prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({
        where: { id },
        include: { contacts: true, addresses: true }
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      if (Object.keys(customerUpdate).length > 0) {
        customer = await tx.customer.update({
          where: { id },
          data: customerUpdate,
          include: { contacts: true, addresses: true }
        });
      }

      if (name || email || phone) {
        const contact = customer.contacts[0];
        if (contact) {
          await tx.contact.update({
            where: { id: contact.id },
            data: {
              ...(name ? { firstName, lastName } : {}),
              ...(email ? { email } : {}),
              ...(phone ? { phone } : {}),
            }
          });
        } else if (email) {
          await tx.contact.create({
            data: {
              customerId: id,
              firstName,
              lastName,
              email,
              phone: phone || '06 00 00 00 00',
              role: 'Owner'
            }
          });
        }
      }

      if (city || street || postalCode || country) {
        const address = customer.addresses[0];
        if (address) {
          await tx.address.update({
            where: { id: address.id },
            data: {
              ...(city ? { city } : {}),
              ...(street ? { street } : {}),
              ...(postalCode ? { postalCode } : {}),
              ...(country ? { country } : {})
            }
          });
        } else {
          await tx.address.create({
            data: {
              customerId: id,
              street: street || 'Rue Principale',
              city: city || 'Paris',
              postalCode: postalCode || '75000',
              country: country || 'France',
              isBilling: true,
              isPrimary: true
            }
          });
        }
      }

      return tx.customer.findUnique({
        where: { id },
        include: { contacts: true, addresses: true }
      });
    });
  }

  async deleteCustomer(id: string) {
    return this.prisma.customer.delete({
      where: { id }
    });
  }

  // Merge duplicate customers (Module 1: CRM - Fusion de doublons)
  async mergeCustomers(primaryId: string, duplicateId: string) {
    const primary = await this.prisma.customer.findUnique({ where: { id: primaryId } });
    const duplicate = await this.prisma.customer.findUnique({ where: { id: duplicateId } });

    if (!primary || !duplicate) {
      throw new Error('Primary or duplicate customer not found');
    }

    // Run in transaction to maintain database integrity
    return this.prisma.$transaction(async (tx) => {
      // Re-link sub-entities
      await tx.contact.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.address.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.note.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.task.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.interaction.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.attachment.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.contract.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.claim.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.invoice.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });
      await tx.payment.updateMany({ where: { customerId: duplicateId }, data: { customerId: primaryId } });

      // Delete the duplicate customer
      await tx.customer.delete({ where: { id: duplicateId } });

      return { success: true, primaryId };
    });
  }

  // Intelligent Search (Module 1 / Module 17: Recherche unifiée)
  async searchCustomers(query: string) {
    return this.prisma.customer.findMany({
      where: {
        OR: [
          { id: { contains: query, mode: 'insensitive' } },
          { contacts: { some: { firstName: { contains: query, mode: 'insensitive' } } } },
          { contacts: { some: { lastName: { contains: query, mode: 'insensitive' } } } },
          { contacts: { some: { email: { contains: query, mode: 'insensitive' } } } },
          { contacts: { some: { phone: { contains: query, mode: 'insensitive' } } } },
          { addresses: { some: { city: { contains: query, mode: 'insensitive' } } } },
        ]
      },
      include: {
        contacts: true,
        addresses: true
      }
    });
  }

  // Customer Segmentation (Module 1: CRM - Segmentation)
  async getSegments() {
    const customers = await this.prisma.customer.findMany({
      include: {
        contracts: true,
        claims: true
      }
    });

    const segments = {
      VIP: [] as any[],
      RisqueEleve: [] as any[],
      Sain: [] as any[],
      MultiProduits: [] as any[],
      Standard: [] as any[]
    };

    for (const customer of customers) {
      const activeContractsCount = customer.contracts.filter(c => c.status === 'ACTIVE').length;
      const claimsCount = customer.claims.length;
      const fraudScoreMax = customer.claims.reduce((max, c) => Math.max(max, c.fraudScore), 0);

      if (customer.score >= 4.0 || activeContractsCount >= 3) {
        segments.VIP.push(customer);
      } else if (fraudScoreMax > 0.6 || claimsCount >= 2) {
        segments.RisqueEleve.push(customer);
      } else if (claimsCount === 0 && activeContractsCount > 0) {
        segments.Sain.push(customer);
      } else if (activeContractsCount > 1) {
        segments.MultiProduits.push(customer);
      } else {
        segments.Standard.push(customer);
      }
    }

    return segments;
  }
}
