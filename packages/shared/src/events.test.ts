import { BusinessEvent } from './types/index.js';

describe('Shared Events Payload', () => {
  it('should construct a valid contract created event structure', () => {
    const event: BusinessEvent = {
      id: 'evt-100',
      type: 'ContractCreated',
      aggregateId: 'contract-992',
      timestamp: new Date('2026-06-05T09:00:00.000Z'),
      version: 1,
      data: {
        contractId: 'contract-992',
        policyNumber: 'POL-AUTO-11',
        customerId: 'cust-202',
        productId: 'prod-50',
        startDate: new Date('2026-06-05T09:00:00.000Z'),
      }
    };

    expect(event.type).toBe('ContractCreated');
    expect(event.version).toBe(1);
    expect(event.data.policyNumber).toBe('POL-AUTO-11');
    expect(event.data.customerId).toBe('cust-202');
  });
});
