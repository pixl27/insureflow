import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { BusinessEvent } from '@insureflow/shared';

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;
  private pubClient: Redis | null = null;
  private subClient: Redis | null = null;
  private useRedis = false;

  private constructor() {
    this.emitter = new EventEmitter();
    this.initRedis();
  }

  private initRedis() {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    
    try {
      console.log(`[EventBus] Connecting to Redis at ${redisHost}:${redisPort}...`);
      this.pubClient = new Redis({
        host: redisHost,
        port: redisPort,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.warn(`[EventBus] Redis connection failed after ${times} retries. Falling back to in-memory EventEmitter.`);
            this.useRedis = false;
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000);
        }
      });

      this.subClient = new Redis({
        host: redisHost,
        port: redisPort,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 200, 1000);
        }
      });

      this.pubClient.on('connect', () => {
        console.log('[EventBus] Redis Publisher connected.');
        this.useRedis = true;
      });

      this.subClient.on('connect', () => {
        console.log('[EventBus] Redis Subscriber connected.');
        this.subClient?.subscribe('insureflow-events');
      });

      this.subClient.on('message', (channel, message) => {
        if (channel === 'insureflow-events') {
          try {
            const event = JSON.parse(message) as BusinessEvent<any>;
            // Trigger local emitter
            this.emitter.emit(event.type, event);
          } catch (err) {
            console.error('[EventBus] Error parsing Redis event message:', err);
          }
        }
      });
      
      this.pubClient.on('error', (err) => {
        this.useRedis = false;
      });
      
      this.subClient.on('error', (err) => {
        this.useRedis = false;
      });

    } catch (e) {
      console.warn('[EventBus] Redis initialization failed. Using in-memory fallback.', e);
      this.useRedis = false;
    }
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Publish a business event to all registered listeners.
   */
  public publish<T>(event: BusinessEvent<T>): void {
    console.log(`[EventBus] Publishing event ${event.type} for Aggregate ${event.aggregateId}`);
    
    if (this.useRedis && this.pubClient) {
      this.pubClient.publish('insureflow-events', JSON.stringify(event))
        .catch(err => {
          console.error('[EventBus] Redis publish error, falling back to local emitter:', err);
          this.emitter.emit(event.type, event);
        });
    } else {
      this.emitter.emit(event.type, event);
    }
  }

  /**
   * Subscribe to a specific business event type.
   */
  public subscribe<T>(eventType: string, handler: (event: BusinessEvent<T>) => void): void {
    console.log(`[EventBus] Subscribing to event ${eventType}`);
    this.emitter.on(eventType, handler);
  }

  /**
   * Unsubscribe from a specific business event type.
   */
  public unsubscribe<T>(eventType: string, handler: (event: BusinessEvent<T>) => void): void {
    this.emitter.off(eventType, handler);
  }
}

export const eventBus = EventBus.getInstance();
export * from '@insureflow/shared';
