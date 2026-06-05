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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventBus = void 0;
const events_1 = require("events");
const ioredis_1 = __importDefault(require("ioredis"));
class EventBus {
    static instance;
    emitter;
    pubClient = null;
    subClient = null;
    useRedis = false;
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.initRedis();
    }
    initRedis() {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
        try {
            console.log(`[EventBus] Connecting to Redis at ${redisHost}:${redisPort}...`);
            this.pubClient = new ioredis_1.default({
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
            this.subClient = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3)
                        return null;
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
                        const event = JSON.parse(message);
                        // Trigger local emitter
                        this.emitter.emit(event.type, event);
                    }
                    catch (err) {
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
        }
        catch (e) {
            console.warn('[EventBus] Redis initialization failed. Using in-memory fallback.', e);
            this.useRedis = false;
        }
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    /**
     * Publish a business event to all registered listeners.
     */
    publish(event) {
        console.log(`[EventBus] Publishing event ${event.type} for Aggregate ${event.aggregateId}`);
        if (this.useRedis && this.pubClient) {
            this.pubClient.publish('insureflow-events', JSON.stringify(event))
                .catch(err => {
                console.error('[EventBus] Redis publish error, falling back to local emitter:', err);
                this.emitter.emit(event.type, event);
            });
        }
        else {
            this.emitter.emit(event.type, event);
        }
    }
    /**
     * Subscribe to a specific business event type.
     */
    subscribe(eventType, handler) {
        console.log(`[EventBus] Subscribing to event ${eventType}`);
        this.emitter.on(eventType, handler);
    }
    /**
     * Unsubscribe from a specific business event type.
     */
    unsubscribe(eventType, handler) {
        this.emitter.off(eventType, handler);
    }
}
exports.EventBus = EventBus;
exports.eventBus = EventBus.getInstance();
__exportStar(require("@insureflow/shared"), exports);
//# sourceMappingURL=index.js.map