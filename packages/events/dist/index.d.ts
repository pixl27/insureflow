import { BusinessEvent } from '@insureflow/shared';
export declare class EventBus {
    private static instance;
    private emitter;
    private pubClient;
    private subClient;
    private useRedis;
    private constructor();
    private initRedis;
    static getInstance(): EventBus;
    /**
     * Publish a business event to all registered listeners.
     */
    publish<T>(event: BusinessEvent<T>): void;
    /**
     * Subscribe to a specific business event type.
     */
    subscribe<T>(eventType: string, handler: (event: BusinessEvent<T>) => void): void;
    /**
     * Unsubscribe from a specific business event type.
     */
    unsubscribe<T>(eventType: string, handler: (event: BusinessEvent<T>) => void): void;
}
export declare const eventBus: EventBus;
export * from '@insureflow/shared';
